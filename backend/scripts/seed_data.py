from actian_vectorai import Point, VectorParams, Distance
from backend.embedder import embedder
import os

COLLECTION_NAME = os.getenv("COLLECTION_NAME", "legal_clauses")

SAMPLE_CLAUSES = [
    {
        "text": "Either party may terminate this agreement with 30 days written notice.",
        "type": "Termination",
        "source": "standard_vendor_agmt.pdf"
    },
    {
        "text": "The maximum liability of either party shall not exceed $1,000,000.",
        "type": "Liability",
        "source": "service_contract_v1.pdf"
    },
    {
        "text": "This agreement shall be governed by the laws of the State of Delaware.",
        "type": "Governing Law",
        "source": "generic_corp_terms.pdf"
    },
    {
        "text": "Either party may terminate this agreement with immediate effect and no cure period.",
        "type": "Termination",
        "source": "high_risk_contract.pdf"
    }
]

def get_risk_level(clause_type: str, text: str) -> str:
    if "immediate effect" in text.lower() or "no cure period" in text.lower():
        return "high"
    if "Liability" in clause_type or "Termination" in clause_type:
        return "high" if "Liability" in clause_type else "medium"
    return "low"

def seed_fallback(client):
    print("Seeding fallback data...")
    points = []
    for i, item in enumerate(SAMPLE_CLAUSES):
        vector = embedder.embed(item["text"])
        points.append(Point(
            id=i + 1,
            vector=vector,
            payload={
                "text": item["text"],
                "clause_type": item["type"],
                "risk_level": get_risk_level(item["type"], item["text"]),
                "source_contract": item["source"],
                "word_count": len(item["text"].split())
            }
        ))
    
    # @vectorai-feature: smart-batcher
    client.upload_points(COLLECTION_NAME, points)
    print(f"Seeded {len(points)} fallback clauses.")
