# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Set Up Environment Variables

**Backend** - Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/grant_assistant
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=grant-assistant-index
PINECONE_ENVIRONMENT=us-east-1
DATA_DIR=./data
```

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Add Some PDFs

Place grant proposal PDFs in: `backend/data/source_pdfs/grants/`
Place rubric PDFs in: `backend/data/source_pdfs/rubrics/`

> **Tip:** Start with 2-3 PDFs to test, then add more later.

### 4. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Index Your Documents

1. Open http://localhost:3000
2. Click "Data Admin" tab
3. Click "Run Ingestion"
4. Wait for processing to complete (~30 seconds per PDF)

### 6. Start Using the Assistant!

1. Click "Grant Assistant" tab
2. Ask a question like: "How do I write effective Specific Aims for an NIH R01?"
3. See the AI answer with source citations!

## 🎯 Example Questions to Try

- "What makes a strong Significance section for NIH proposals?"
- "How should I structure my Broader Impacts for NSF?"
- "What are common mistakes to avoid in grant proposals?"
- "Show me examples of good Specific Aims"

## 🐛 Troubleshooting

**Backend won't start:**
- Check all API keys are set in `.env`
- Make sure port 3001 is available

**Frontend can't connect:**
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` matches backend URL

**Ingestion fails:**
- Verify PDFs are in correct directories
- Check Pinecone API key is valid
- Ensure PDFs are not corrupted

**No results from assistant:**
- Make sure ingestion completed successfully
- Try a more general question first
- Check that PDFs contain relevant content

## 📚 Next Steps

- Add more grant proposals and rubrics
- Try different agencies (NIH, NSF, DOE, etc.)
- Experiment with section-specific questions
- Customize the prompts in `backend/src/services/aiService.ts`

Happy grant writing! 🎓

