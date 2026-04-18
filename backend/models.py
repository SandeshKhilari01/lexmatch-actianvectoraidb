from pydantic import BaseModel, Field
from typing import List, Optional

class SearchRequest(BaseModel):
    clause: str
    limit: Optional[int] = 5
    risk_level: Optional[str] = "all"
    clause_type: Optional[str] = "all"
    hybrid: Optional[bool] = False

class SearchResult(BaseModel):
    id: int
    score: float
    text: str
    clause_type: str
    risk_level: str
    source_contract: str

class SearchResponse(BaseModel):
    results: List[SearchResult]
    query_vector_preview: List[float]
    search_time_ms: float

class StatsResponse(BaseModel):
    total_clauses: int
    by_risk_level: dict
    by_clause_type: dict
    collection_status: str

class HealthResponse(BaseModel):
    status: str
    vectordb: str
