# Neural Search Engine for Technical Q&A 🧠🔍🌌

A production-grade **Semantic & Hybrid Search Engine** that bridges the gap between keyword retrieval and AI reasoning. This system uses a state-of-the-art **Hybrid Retrieval Architecture** (BM25 + FAISS) with an intelligent **Senior Architect Fallback (LLM)** for 100% technical coverage.

## 🔗 Live Production Links
*   **Production Deployment (UI)**: [https://neural-search-engine.vercel.app/](https://neural-search-engine.vercel.app/)
*   **Direct API Endpoint (Backend)**: [https://kurakula-prashanth2004-neural-search-ai.hf.space](https://kurakula-prashanth2004-neural-search-ai.hf.space)

---

## 🎬 Cinematic Project Overview

### 1. Neural Boot Sequence
When the application launches, it undergoes a tactical boot-up sequence, initializing AI protocols and establishing the retrieval matrix.
![Intro Splash](<img width="1215" height="988" alt="image" src="https://github.com/user-attachments/assets/1ed52591-ea85-47ac-9dbd-c81f759d84d3" />)

### 2. Intelligent Search Dashboard
A minimalist, high-impact interface where users can query the neural matrix across three distinct retrieval tiers.
![Search Dashboard](<img width="1578" height="1004" alt="image" src="https://github.com/user-attachments/assets/cd1a6a9d-de68-4e03-87c3-0d48a4da30b7" />)

---

## 🚀 How it Works

### 🎨 Frontend (React & Vite)
The frontend is the "Command Center" of the engine. It is hosted on **Vercel** for ultra-fast edge delivery. 
- It handles the **Neural Boot Sequence** (cinematic loading).
- It manages user queries and communicates with the AI backend via **Axios**.
- It visualizes search results with real-time scoring and markdown rendering for technical code snippets.

### 🧠 Backend (FastAPI & Hugging Face)
The backend is the "Engine Room," hosted on **Hugging Face Spaces** for massive **16GB RAM** AI inference.
- **Data Layer**: It processes a technical Q&A dataset (`techqa.csv`) upon startup.
- **Indexing Layer**: It builds two simultaneous indexes: **BM25** (for keyword frequency) and **FAISS** (for vector-based semantic meaning).
- **Inference Layer**: It uses the `paraphrase-MiniLM-L3-v2` transformer to convert questions into 384-dimensional mathematical vectors.
- **Decision Layer**: If a search score is below 90%, it automatically triggers the **Qwen-2.5-7B** AI Fallback to generate a comprehensive solution from scratch.

---

## 📦 Getting Started

### 1. Cloning the Repository
To get started with local development, clone the repository using Git:
```bash
git clone https://github.com/kurakula-prashanth/neural-search-engine.git
cd neural-search-engine
```

### 2. How to Use the App
1.  **Enter a Query**: Type any technical question (e.g., *"Explain Random Forest"* or *"Fix Network Error"*).
2.  **Execute**: Press `Enter` or click **Execute** to trigger the neural matrix.
3.  **Explore Tabs**:
    -   **BM25**: Best for finding exact error codes or keyword matches.
    -   **Semantic**: Best for finding conceptually similar questions.
    -   **Hybrid**: The "Smartest" mode—uses both methods and triggers the AI LLM if confidence is low.
    -   **Compare All**: A side-by-side benchmark of all three AI methods.

---

## 🛠️ Local Installation

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Set your HF_API_TOKEN in .env
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---
*Created as part of an Advanced AI & Cloud Computing project for Technical Information Retrieval.*
