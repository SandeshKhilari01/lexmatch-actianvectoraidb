import asyncio
from typing import List, Optional
from pydantic import BaseModel

class Point:
    def __init__(self, id, vector, payload):
        self.id = id
        self.vector = vector
        self.payload = payload
        self.score = 0.0

class VectorParams:
    def __init__(self, size, distance):
        pass

class Distance:
    COSINE = "cosine"

class Field:
    def __init__(self, name):
        self.name = name
    def eq(self, value):
        return self

class FilterBuilder:
    def __init__(self):
        self._conditions = []
    def must(self, condition):
        self._conditions.append(condition)
        return self
    def build(self):
        return self

class MockVDE:
    async def open_collection(self, name): pass
    async def flush(self, name): pass
    async def save_snapshot(self, name): pass

SAMPLE_DATA = [
    {
        "id": 1,
        "score": 0.9142,
        "payload": {
            "text": "Either party may terminate this agreement with immediate effect and no cure period required, provided 30 days written notice has been attempted.",
            "clause_type": "Termination",
            "risk_level": "high",
            "source_contract": "high_risk_vendor_2024.pdf"
        }
    },
    {
        "id": 2,
        "score": 0.7821,
        "payload": {
            "text": "Either party may terminate this agreement for convenience upon 60 days prior written notice to the other party.",
            "clause_type": "Termination",
            "risk_level": "medium",
            "source_contract": "standard_service_agmt.pdf"
        }
    },
    {
        "id": 3,
        "score": 0.6415,
        "payload": {
            "text": "This agreement shall remain in effect until terminated by either party with 90 days prior written notice.",
            "clause_type": "Termination",
            "risk_level": "low",
            "source_contract": "long_term_partnership.pdf"
        }
    }
]

class MockPoints:
    async def search(self, collection, vector, limit=5, filter=None):
        # Return mock data for demo
        results = []
        for item in SAMPLE_DATA[:limit]:
            class MockResult:
                def __init__(self, data):
                    self.id = data["id"]
                    self.score = data["score"]
                    self.payload = data["payload"]
            results.append(MockResult(item))
        return results
    async def create_field_index(self, collection, field, type): pass

class MockCollections:
    async def list(self): return []
    async def create(self, name, params): pass
    async def get(self, name):
        class Info:
            points_count = 0
        return Info()

class AsyncVectorAIClient:
    def __init__(self, host_port):
        self.points = MockPoints()
        self.collections = MockCollections()
        self.vde = MockVDE()
    async def connect(self): return self
    async def close(self): pass
    async def __aenter__(self): return self
    async def __aexit__(self, exc_type, exc_val, exc_tb): pass

def reciprocal_rank_fusion(results_list, limit=5, weights=None):
    if not results_list: return []
    return results_list[0][:limit]
