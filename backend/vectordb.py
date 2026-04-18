import os
from backend.actian_vectorai import AsyncVectorAIClient, VectorParams, Distance, FilterBuilder, Field

VECTORDB_HOST = os.getenv("VECTORDB_HOST", "localhost")
VECTORDB_PORT = os.getenv("VECTORDB_PORT", "50051")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "legal_clauses")

class VectorDB:
    def __init__(self):
        self.client = None

    async def connect(self):
        """
        Connects to Actian VectorAI DB via gRPC.
        @vectorai-feature: async-client
        """
        self.client = AsyncVectorAIClient(f"{VECTORDB_HOST}:{VECTORDB_PORT}")
        return self.client

    async def setup_collection(self):
        """
        Creates the 'legal_clauses' collection if it doesn't exist.
        @vectorai-feature: collection-create
        """
        collections = await self.client.collections.list()
        if not any(c.name == COLLECTION_NAME for c in collections):
            await self.client.collections.create(
                COLLECTION_NAME,
                VectorParams(size=384, distance=Distance.COSINE)
            )
            # Create field indexes for performance
            # @vectorai-feature: field-index
            await self.client.points.create_field_index(COLLECTION_NAME, "clause_type", "keyword")
            await self.client.points.create_field_index(COLLECTION_NAME, "risk_level", "keyword")
        
        # @vectorai-feature: vde-lifecycle
        await self.client.vde.open_collection(COLLECTION_NAME)

    async def disconnect(self):
        """
        Flushes, snapshots, and closes the client.
        @vectorai-feature: vde-lifecycle
        """
        if self.client:
            await self.client.vde.flush(COLLECTION_NAME)
            await self.client.vde.save_snapshot(COLLECTION_NAME)
            await self.client.close()

vectordb = VectorDB()
