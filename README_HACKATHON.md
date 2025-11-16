# Grant Writing Assistant - Hackathon Project

AI-powered grant writing assistant that helps researchers discover relevant grants and draft stronger applications by learning from real, successfully funded proposals and official rubrics from agencies like NIH, NSF, etc.

## 🎯 Tech Stack

### Frontend
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- Simple, clean UI with two main pages: Grant Assistant and Data Admin

### Backend
- **Node.js** + **Express** + **TypeScript**
- REST API endpoints for ingestion and assistant queries

### Data & AI
- **PostgreSQL** - User data and sessions (minimal for MVP)
- **In-Memory Vector Store** - Semantic search using cosine similarity (no external DB needed)
- **OpenAI GPT-4** - LLM for reasoning and generation
- **OpenAI Embeddings API** - Vector embeddings for RAG

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ installed
- API keys for:
  - OpenAI (for both GPT-4 and embeddings)

### Installation

1. **Clone and install dependencies:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Set up environment variables:**

Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
DATA_DIR=./data
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. **Add PDF documents:**

Place grant proposal PDFs in: `backend/data/source_pdfs/grants/`
Place rubric PDFs in: `backend/data/source_pdfs/rubrics/`

4. **Run the application:**

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

5. **Index your documents:**

- Open http://localhost:3000
- Go to "Data Admin" tab
- Click "Run Ingestion" to process and index all PDFs

6. **Start using the assistant:**

- Go to "Grant Assistant" tab
- Ask questions about grant writing
- Get contextualized answers based on your indexed documents!

## 📁 Project Structure

```
grant-assistant/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment config
│   │   ├── routes/          # API routes (ingest, assistant)
│   │   └── services/        # Business logic (PDF, chunking, embeddings, AI)
│   ├── data/
│   │   └── source_pdfs/     # Drop PDFs here
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   └── package.json
└── README_HACKATHON.md
```

## 🔌 API Endpoints

### POST `/api/ingest/run`
Trigger the ingestion pipeline:
- Extracts text from all PDFs/DOCX in `data/source_pdfs/`
- Chunks documents into semantic pieces
- Generates embeddings
- Stores in in-memory vector store

**Response:**
```json
{
  "success": true,
  "message": "Ingestion completed successfully",
  "stats": {
    "documentsProcessed": 5,
    "grants": 3,
    "rubrics": 2,
    "chunksCreated": 45
  }
}
```

### POST `/api/assistant/query`
Main RAG endpoint for asking questions.

**Request:**
```json
{
  "question": "How do I write effective Specific Aims for an NIH R01?",
  "agency": "NIH",
  "program": "R01",
  "section": "Specific Aims",
  "projectDescription": "My project is about..."
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Based on successful NIH R01 proposals...",
  "sources": [
    {
      "id": "grant_001_0",
      "filename": "successful_nih_r01.pdf",
      "agency": "NIH",
      "program": "R01",
      "section": "specific_aims",
      "documentType": "grant",
      "snippet": "The specific aims of this proposal...",
      "score": 0.92
    }
  ]
}
```

### POST `/api/proposals/upload`
Upload a grant proposal (PDF or DOCX) for analysis.

**Request:** multipart/form-data with `file`, optional `agency`, `program`

**Response:**
```json
{
  "success": true,
  "proposalId": "proposal_123...",
  "filename": "my_proposal.pdf",
  "agency": "NIH",
  "program": "R01",
  "sections": ["specific_aims", "significance", ...]
}
```

### POST `/api/proposals/:id/format`
Format a proposal according to agency requirements.

### POST `/api/proposals/:id/score`
Score a proposal (RAG similarity + rubric evaluation).

### POST `/api/proposals/:id/suggestions`
Get improvement suggestions (content, missing elements, structure).

### GET `/api/ingest/status`
Check current ingestion status (PDF count, etc.)

## 🎨 Features

### Grant Assistant
- Ask questions about grant writing
- Get answers based on successful proposals and rubrics
- Filter by agency, program, or section
- See which sources were used (transparency)

### Proposal Analyzer
- Upload your grant proposal (PDF or DOCX)
- Auto-format according to agency requirements
- Get scored on similarity to successful proposals and rubric alignment
- Receive actionable suggestions for improvement

### Data Admin
- View current document status
- Trigger ingestion pipeline
- Simple UI for managing indexed documents

## 🔧 Development

### Backend Scripts
```bash
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
npm run ingest   # Run ingestion CLI (if implemented)
```

### Frontend Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
```

## 📝 How It Works

1. **Data Ingestion:**
   - PDFs/DOCX are extracted using `pdf-parse` and `mammoth`
   - Text is chunked into ~1500 word pieces with metadata
   - Each chunk gets an embedding via OpenAI
   - Vectors are stored in memory with metadata filters

2. **RAG Query:**
   - User asks a question
   - Question is embedded
   - Cosine similarity search finds top-k similar chunks (filtered by agency/program if specified)
   - Retrieved context + question → OpenAI GPT-4
   - Response includes answer + source citations

3. **Proposal Analysis:**
   - User uploads proposal (PDF/DOCX)
   - Text is extracted and sections identified
   - Proposal is formatted according to agency requirements
   - Scored using RAG similarity (vs successful proposals) + rubric evaluation
   - GPT-4 generates actionable suggestions for improvement

## 🚨 Important Notes

- **No fine-tuning** - We only use hosted LLM APIs
- **RAG only** - All intelligence comes from indexed documents
- **In-memory storage** - Embeddings stored in memory (lost on server restart, re-index needed)
- **MVP scope** - Focused on core Q&A, proposal analysis, and drafting features
- **Local file storage** - PDFs stored locally (can migrate to S3 later)
- **OpenAI only** - Uses GPT-4 for generation and embeddings API for vectors

## 🐛 Troubleshooting

**"No PDFs found" error:**
- Make sure PDFs are in `backend/data/source_pdfs/grants/` or `rubrics/`
- Check file extensions are `.pdf` (lowercase)

**Pinecone errors:**
- Verify `PINECONE_API_KEY` is correct
- Check index name matches in Pinecone console
- Index will be auto-created on first ingestion

**API connection errors:**
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check CORS settings if accessing from different origin

## 📚 Next Steps

- Add more sophisticated section detection
- Support for DOCX files (not just PDF)
- User authentication and project management
- Export generated content to Word/PDF
- Real-time collaboration features

## 📄 License

MIT

