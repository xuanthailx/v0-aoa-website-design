step 1: npm install
step 2: create .evn :
OPENAI_API_KEY=sk-OPENAI_API_KEY
OPENAI_CHAT_URL=OPENAI_CHAT_URL
ALLOWED_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_PROXY_URL=http://localhost:8000
step3 : npm run dev

## Quick start (developer)

Prerequisites:
- Node.js (16+), npm or pnpm
- Python 3.10+ and virtualenv (recommended)

1. Clone the repository and install frontend dependencies

```bash
cd /path/to/v0-aoa-website-design
# using pnpm (recommended if you use pnpm)
pnpm install
# or with npm
npm install
```

2. Set up the Python environment for the backend

```bash
python -m venv .venv
source .venv/bin/activate
# Install minimal backend deps (if you don't have a requirements file)
pip install fastapi uvicorn python-dotenv httpx
```

3. Create a `.env` file at the repository root with at least the following keys:

```env
# OpenAI / upstream chat endpoint (must contain the full completions URL for OpenAI)
OPENAI_API_KEY=sk-...replace...
OPENAI_CHAT_URL=https://api.openai.com/v1/chat/completions

# Which origins are allowed to call the proxy (frontend default is http://localhost:3000)
ALLOWED_ORIGINS=http://localhost:3000

# Frontend will default to http://localhost:8000 if this is unset
NEXT_PUBLIC_API_PROXY_URL=http://localhost:8000
```

Important: Do NOT commit `.env` or secrets to source control.

4. Start the backend proxy

```bash
source .venv/bin/activate
.venv/bin/python -m uvicorn server.fastapi_openai_proxy:app --host 127.0.0.1 --port 8000 --reload
```

5. Start the frontend

```bash
pnpm dev
# or
npm run dev
```

Open the chat UI at: http://localhost:3000/chat

---

## API: Chat endpoint (proxy)

This repository exposes a small proxy endpoint that the frontend calls. Example endpoint (default):

- POST http://localhost:8000/chat

Request JSON (example):

```json
{
	"message": "Kho dữ liệu về chủ đề gì?",
	"conversation_id": "string",
	"max_tokens": 1000,
	"temperature": 0.7
}
```

Successful response (example):

```json
{
	"response": "Kho dữ liệu này về chủ đề \"Sổ tay nhân viên\" của **[COMPANY_NAME]**. ...",
	"conversation_id": "string",
	"sources": [
		{
			"file_path": "documents/EMPLOYEE_HANDBOOK.md",
			"file_name": "EMPLOYEE_HANDBOOK.md",
			"file_type": ".md",
			"relevance_score": 0.184,
			"content_preview": "---\n\n## 21. FAQ (Câu hỏi thường gặp)\n1. **Tôi quên mật khẩu..."
		}
	],
	"metadata": {
		"retrieved_documents": 5,
		"timestamp": "2025-11-06T16:50:12.487196",
		"model": "GPT-4o-mini",
		"temperature": 0.7,
		"max_tokens": 1000
	}
}
