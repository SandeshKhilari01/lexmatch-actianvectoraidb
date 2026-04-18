from sentence_transformers import SentenceTransformer
import os

EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

class Embedder:
    def __init__(self):
        self.model = SentenceTransformer(EMBEDDING_MODEL)
    
    def embed(self, text: str):
        """
        Encodes the clause text into a 384-dimensional vector.
        @vectorai-feature: vector-search
        """
        return self.model.encode(text).tolist()

# Singleton instance
embedder = Embedder()
