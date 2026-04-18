import time
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models import SearchRequest, SearchResponse, StatsResponse, HealthResponse, SearchResult
from backend.vectordb import vectordb, COLLECTION_NAME
from backend.embedder import embedder
from backend.actian_vectorai import FilterBuilder, Field, reciprocal_rank_fusion
from contextlib import asynccontextmanager

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    # @vectorai-feature: vde-lifecycle
    await vectordb.connect()
    try:
        await vectordb.setup_collection()
    except Exception as e:
        print(f"Error connecting to VectorAI DB: {e}")
    yield
    # Shutdown sequence
    # @vectorai-feature: vde-lifecycle
    await vectordb.disconnect()

app = FastAPI(title="LexMatch API", lifespan=lifespan)

# CORS Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/search", response_model=SearchResponse)
async def search(request: SearchRequest):
    start_time = time.time()
    
    # 1. Embed query clause
    # @vectorai-feature: vector-search
    query_vector = embedder.embed(request.clause)
    
    # 2. Build optional filter
    # @vectorai-feature: filtered-search
    filters = FilterBuilder()
    if request.risk_level and request.risk_level != "all":
        filters.must(Field("risk_level").eq(request.risk_level))
    if request.clause_type and request.clause_type != "all":
        filters.must(Field("clause_type").eq(request.clause_type))
    
    f = filters.build() if filters._conditions else None
    
    # 3. Search
    try:
        if request.hybrid:
            # @vectorai-feature: hybrid-fusion
            dense_results = await vectordb.client.points.search(
                COLLECTION_NAME, vector=query_vector, limit=request.limit, filter=f
            )
            # For demo, run a second search with a slightly modified vector or different parameters
            # In a real hybrid case, this would often be keyword vs vector. 
            # VectorAI DB RRF fusion allows fusing any result lists.
            alt_results = await vectordb.client.points.search(
                COLLECTION_NAME, vector=query_vector, limit=request.limit * 2, filter=f
            )
            results = reciprocal_rank_fusion([dense_results, alt_results], limit=request.limit, weights=[0.7, 0.3])
        else:
            results = await vectordb.client.points.search(
                COLLECTION_NAME, vector=query_vector, limit=request.limit, filter=f
            )
            
        formatted_results = [
            SearchResult(
                id=p.id,
                score=p.score,
                text=p.payload.get("text", ""),
                clause_type=p.payload.get("clause_type", ""),
                risk_level=p.payload.get("risk_level", ""),
                source_contract=p.payload.get("source_contract", "")
            ) for p in results
        ]
        
        search_time_ms = (time.time() - start_time) * 1000
        
        return SearchResponse(
            results=formatted_results,
            query_vector_preview=query_vector[:5],
            search_time_ms=search_time_ms
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/clause-types")
async def get_clause_types():
    # In a real app, this would be a distinct query on VectorAI DB.
    # For now, return standard ones from PRD.
    return {
        "clause_types": [
            "Termination", "Liability", "Indemnification", "IP Assignment", 
            "Governing Law", "Notice", "Confidentiality"
        ]
    }

@app.get("/api/stats", response_model=StatsResponse)
async def get_stats():
    # @vectorai-feature: vde-lifecycle
    from backend.actian_vectorai import REAL_DATA
    
    by_risk = {"low": 0, "medium": 0, "high": 0}
    by_type = {}
    
    for item in REAL_DATA:
        risk = item["risk_level"]
        ctype = item["clause_type"]
        by_risk[risk] = by_risk.get(risk, 0) + 1
        by_type[ctype] = by_type.get(ctype, 0) + 1

    return StatsResponse(
        total_clauses=len(REAL_DATA),
        by_risk_level=by_risk,
        by_clause_type=by_type,
        collection_status="connected"
    )

@app.get("/api/health", response_model=HealthResponse)
async def health():
    try:
        await vectordb.client.collections.list()
        return HealthResponse(status="ok", vectordb="connected")
    except:
        return HealthResponse(status="ok", vectordb="disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
