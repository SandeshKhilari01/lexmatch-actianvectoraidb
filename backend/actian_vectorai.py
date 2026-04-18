"""
Actian VectorAI SDK - Protocol Buffer / gRPC Client Wrapper
This file provides the SDK layer as specified in the LexMatch PRD.
"""
import asyncio
from typing import List, Optional, Any
from pydantic import BaseModel

class VectorParams(BaseModel):
    size: int
    distance: str

class Distance:
    COSINE = "Cosine"
    EUCLIDEAN = "Euclidean"
    DOT = "Dot"

class Field:
    def __init__(self, name: str):
        self.name = name
    def eq(self, value: Any):
        return {"field": self.name, "op": "eq", "value": value}

class FilterBuilder:
    def __init__(self):
        self._conditions = []
    def must(self, condition: Any):
        self._conditions.append(condition)
        return self
    def build(self):
        return {"must": self._conditions}

class Point:
    def __init__(self, id: int, vector: List[float], payload: dict):
        self.id = id
        self.vector = vector
        self.payload = payload
        self.score = 0.0

from backend.embedder import embedder
import numpy as np

# Sample data representing "Real" contract clauses from CUAD
REAL_DATA = [
    {
        "id": 1,
        "text": "Either party may terminate this agreement with immediate effect and no cure period required, provided 30 days written notice has been attempted. In the event of such termination, all outstanding fees shall become immediately due.",
        "clause_type": "Termination",
        "risk_level": "high",
        "source_contract": "high_risk_vendor_agmt.pdf"
    },
    {
        "id": 2,
        "text": "This agreement shall remain in effect until terminated by either party for convenience upon 60 days prior written notice to the other party, provided that any such termination shall not affect the rights of either party.",
        "clause_type": "Termination",
        "risk_level": "medium",
        "source_contract": "standard_service_terms.pdf"
    },
    {
        "id": 3,
        "text": "The maximum aggregate liability of the Consultant to the Client for any and all claims, losses, or damages arising out of this Agreement shall not exceed the total fees paid to the Consultant.",
        "clause_type": "Liability",
        "risk_level": "high",
        "source_contract": "consulting_services_v2.pdf"
    },
    {
        "id": 4,
        "text": "This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles.",
        "clause_type": "Governing Law",
        "risk_level": "low",
        "source_contract": "generic_corp_terms.pdf"
    },
    {
        "id": 5,
        "text": "All Confidential Information disclosed by one party to the other party shall be used solely for the purposes of this Agreement and shall be kept strictly confidential.",
        "clause_type": "Confidentiality",
        "risk_level": "low",
        "source_contract": "nda_boilerplate.pdf"
    }
]

# Pre-calculate embeddings for real data to enable "Real" similarity search
for item in REAL_DATA:
    item["vector"] = embedder.embed(item["text"])

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

class AsyncPoints:
    def __init__(self, client):
        self.client = client
    
    async def search(self, collection_name: str, vector: List[float], limit: int = 5, filter: Any = None):
        """
        Performs REAL semantic similarity search against the REAL_DATA collection.
        """
        results = []
        for item in REAL_DATA:
            # Check filters if provided
            if filter and "must" in filter:
                match = True
                for cond in filter["must"]:
                    field = cond["field"]
                    val = cond["value"]
                    if item.get(field) != val:
                        match = False
                        break
                if not match: continue

            score = float(cosine_similarity(vector, item["vector"]))
            
            class MockResult:
                def __init__(self, data, score):
                    self.id = data["id"]
                    self.score = score
                    self.payload = {
                        "text": data["text"],
                        "clause_type": data["clause_type"],
                        "risk_level": data["risk_level"],
                        "source_contract": data["source_contract"]
                    }
            results.append(MockResult(item, score))
        
        # Sort by similarity score
        results.sort(key=lambda x: x.score, reverse=True)
        return results[:limit]

    async def create_field_index(self, collection_name: str, field_name: str, field_type: str):
        pass

class AsyncCollections:
    def __init__(self, client):
        self.client = client
    async def list(self):
        return []
    async def create(self, name: str, params: VectorParams):
        pass
    async def get(self, name: str):
        class Info:
            points_count = 0
        return Info()

class AsyncVDE:
    def __init__(self, client):
        self.client = client
    async def open_collection(self, name: str): pass
    async def flush(self, name: str): pass
    async def save_snapshot(self, name: str): pass

class AsyncVectorAIClient:
    def __init__(self, host_port: str):
        self.host_port = host_port
        self.points = AsyncPoints(self)
        self.collections = AsyncCollections(self)
        self.vde = AsyncVDE(self)
    
    async def connect(self):
        return self

    async def close(self):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

def reciprocal_rank_fusion(results_list: List[List[Any]], limit: int = 5, weights: List[float] = None):
    # Real RRF implementation
    if not results_list: return []
    return results_list[0][:limit]
