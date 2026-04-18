# LexMatch — AI-Powered Legal Clause Similarity Search

LexMatch is a precision tool for legal teams to find semantically similar clauses from a library of past contracts. Powered by **Actian VectorAI DB**, it identifies risky clauses even when reworded, providing institutional memory and risk awareness in seconds.

## 🚀 Key Features

- **Semantic Search**: Finds meaning, not just keywords, using `sentence-transformers`.
- **Actian VectorAI DB**: High-performance ANN search with payload filtering and hybrid fusion.
- **Risk Tagging**: Instantly flags historically problematic clauses (High, Medium, Low risk).
- **Side-by-Side Diff**: Compare query clauses with matches to see exactly what changed.
- **Hybrid Fusion**: Combines dense semantic search with reciprocal rank fusion (RRF) for superior accuracy.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI (Python 3.11+), Uvicorn.
- **Vector Database**: Actian VectorAI DB (Docker).
- **Embedding Model**: `all-MiniLM-L6-v2` (384 dimensions).
- **Dataset**: CUAD (Contract Understanding Atticus Dataset).

## 📋 Prerequisites

- Docker and Docker Compose.
- Python 3.11+.
- Node.js 18+.

## ⚙️ Setup & Installation

### 1. Start VectorAI DB
```bash
docker compose up -d
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

### 4. Data Ingestion
Load the CUAD dataset or fallback seed data into VectorAI DB:
```bash
export PYTHONPATH=$PYTHONPATH:.
python backend/scripts/ingest.py
```

## 🏃‍♂️ Running the Application

Use the provided run script to start both servers:
```bash
./scripts/run.sh
```
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000

## 📂 Project Structure

```text
lexmatch/
├── backend/            # FastAPI Application
│   ├── scripts/        # Ingestion & Seed scripts
│   ├── main.py         # API entry point
│   └── vectordb.py     # VectorAI DB client wrapper
├── frontend/           # React Application (Vite)
│   ├── src/components/ # UI Components
│   └── src/App.jsx     # Main Layout
├── scripts/            # Utility scripts (run.sh)
└── docker-compose.yml  # VectorAI DB service
```

## ⚖️ Judging Criteria Alignment

- **VectorAI DB Usage (30%)**: Implements AsyncClient, FilterBuilder, RRF Hybrid Fusion, SmartBatcher, and VDE lifecycle management.
- **Real-world Impact (25%)**: Addresses a $30B/year contract review pain point using real-world CUAD data.
- **Technical Execution (25%)**: Clean 3-tier architecture with full async support and pydantic models.
- **Presentation (20%)**: High-fidelity UI with animated score bars, risk badges, and diff modal.

---
Built for the **Actian VectorAI DB Hackathon 2026**.
