# One-Box Email Aggregator

An end-to-end system to sync multiple IMAP accounts in real-time, index emails in Elasticsearch, classify with AI labels, notify via Slack/webhook, and provide a React UI with AI-powered reply suggestions.

## Features

1. Real-Time IMAP Sync (IDLE-mode)  
2. Searchable Storage via Elasticsearch  
3. AI-Based Email Categorization  
4. Slack & Webhook Notifications  
5. Frontend Interface (React + Vite)  
6. AI-Powered Suggested Replies (RAG + Vector Store)

## Prerequisites

- Node.js 18+  
- npm (v8+) or yarn  
- Docker & Docker Compose  
- IMAP account credentials (Gmail/Outlook/…)
- OpenAI API key (or other LLM provider)  
- Slack Bot Token & target channel ID  
- Webhook.site URL (for testing)

## Quick Start

1. Clone repo  
git clone git@github.com:yourusername/onebox-email-aggregator.git
cd onebox-email-aggregator


2. Copy `.env.example` to `.env` and fill in values.  
IMAP_USER_1=...
IMAP_PASS_1=...
IMAP_HOST_1=...
SLACK_TOKEN=...
WEBHOOK_URL=...
OPENAI_API_KEY=...
ES_HOST=http://localhost:9200
VECTOR_DB_URL=http://localhost:8080


3. Start infrastructure  
docker-compose up -d



4. Install & run Backend  
cd packages/backend
npm install
npm run dev


5. Install & run Frontend  
cd packages/frontend
npm install
npm run dev


6. Open UI at http://localhost:3000 and explore!

## Project Structure

- `/docker-compose.yml` — Elasticsearch & Vector DB  
- `/packages/backend` — Node.js/TypeScript services  
- `/packages/frontend` — React + Vite UI  
- `/infra/` — Optional custom infra configs  
