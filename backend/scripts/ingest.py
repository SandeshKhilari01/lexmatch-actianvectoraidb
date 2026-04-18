import asyncio
import os
import sys
from datasets import load_dataset
from actian_vectorai import VectorAIClient, Point, VectorParams, Distance
from backend.embedder import embedder

# Add parent dir to sys.path to import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.vectordb import VECTORDB_HOST, VECTORDB_PORT, COLLECTION_NAME

def get_risk_level(clause_type: str) -> str:
    """
    Risk labeling logic as defined in PRD Section 9.
    """
    high_risk = ["Termination", "Liability", "Indemnification"]
    medium_risk = ["IP Assignment", "Change of Control"]
    low_risk = ["Governing Law", "Notice", "Confidentiality"]
    
    if any(hr in clause_type for hr in high_risk):
        return "high"
    if any(mr in clause_type for mr in medium_risk):
        return "medium"
    if any(lr in clause_type for lr in low_risk):
        return "low"
    return "medium"

async def ingest_cuad():
    """
    Load CUAD → embed → upsert into VectorAI DB.
    @vectorai-feature: smart-batcher
    """
    print("Connecting to VectorAI DB...")
    client = VectorAIClient(f"{VECTORDB_HOST}:{VECTORDB_PORT}")
    
    # Ensure collection exists
    collections = client.collections.list()
    if not any(c.name == COLLECTION_NAME for c in collections):
        client.collections.create(
            COLLECTION_NAME,
            VectorParams(size=384, distance=Distance.COSINE)
        )
    
    print("Loading CUAD dataset...")
    try:
        dataset = load_dataset("theatticusproject/cuad", split="train", trust_remote_code=True)
        # Process first 500 items as per PRD
        clauses_to_ingest = []
        for i, item in enumerate(dataset):
            if i >= 500: break
            
            # Simplified extraction for demo purposes
            # In a real scenario, we'd parse 'answers' properly
            text = item.get("context", "")[:1000]
            clause_type = item.get("question", "General")
            source = item.get("title", "Unknown Contract")
            
            vector = embedder.embed(text)
            
            clauses_to_ingest.append(Point(
                id=i + 1,
                vector=vector,
                payload={
                    "text": text,
                    "clause_type": clause_type,
                    "risk_level": get_risk_level(clause_type),
                    "source_contract": source,
                    "word_count": len(text.split())
                }
            ))
            
            if len(clauses_to_ingest) >= 100:
                print(f"Uploading batch of {len(clauses_to_ingest)}...")
                # @vectorai-feature: smart-batcher
                client.upload_points(COLLECTION_NAME, clauses_to_ingest, batch_size=256)
                clauses_to_ingest = []
                
        if clauses_to_ingest:
            client.upload_points(COLLECTION_NAME, clauses_to_ingest)
            
        print("Ingestion complete.")
        # @vectorai-feature: vde-lifecycle
        client.vde.flush(COLLECTION_NAME)
        client.vde.save_snapshot(COLLECTION_NAME)
        
    except Exception as e:
        print(f"CUAD ingestion failed: {e}")
        print("Falling back to seed data...")
        from backend.scripts.seed_data import seed_fallback
        seed_fallback(client)

if __name__ == "__main__":
    asyncio.run(ingest_cuad())
