# IKIGAI — Local Development Guide

This guide details how to run the IKIGAI platform locally. The project uses a modern Turborepo monorepo structure with a mix of Next.js frontend applications and Python FastApi backend services.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

1. **Node.js**: v22.x LTS
2. **Package Manager**: `pnpm` (v9+)
   ```bash
   npm install -g pnpm
   ```
3. **Python**: v3.12+ (for ML and Orchestrator services)
4. **Docker**: Docker Desktop (required for local databases and message brokers)
5. **Git**: For version control

---

## 1. Initial Setup

### Clone and Enter Repository
```bash
git clone https://github.com/steph1902/ikigai.git
cd ikigai
```

### Environment Variables
Copy the example environment variables file and fill in required API keys (Anthropic, Cohere, etc.):
```bash
cp .env.example .env
```
*(Note: If you run without API keys, services like Embedding will automatically fall back to deterministic mock generators.)*

---

## 2. Start Infrastructure Services

The IKIGAI platform relies on several backing services (PostgreSQL, Redis, Meilisearch, Redpanda/Kafka).

Start them in the background using Docker Compose:
```bash
cd docker
docker compose up -d
cd ..
```

Wait 30 seconds for the databases to fully initialize before proceeding.

---

## 3. Install Dependencies

Install Node.js dependencies across the entire monorepo using pnpm:
```bash
pnpm install
```

Set up the Python virtual environments for the backend services:
```bash
# Example for the Orchestrator service
cd services/orchestrator
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ../..
```
*(Repeat for `pricing-model`, `vr-engine`, `document-ocr`, and `embedding` as needed.)*

---

## 4. Database Migrations & Seeding

Push the Drizzle ORM schema to the local PostgreSQL database:
```bash
pnpm --filter db db:push
```

*(Optional)* Seed the database with synthetic real estate listings and test users:
```bash
pnpm --filter seed run seed
```

---

## 5. Running the Application

You can start the entire stack simultaneously using Turborepo.

### Start Everything (Recommended)
```bash
pnpm dev
```
This single command will:
- Start the Next.js Web App on `http://localhost:3000`
- Start the Admin Dashboard on `http://localhost:3001`
- Start the Agent Dashboard on `http://localhost:3002`
- Start all 5 Python FastAPI microservices on ports `8000`-`8004`

### Start Specific Services
If you only want to run a specific app (e.g., the buyer web app):
```bash
pnpm --filter web dev
```

---

## 6. Running Tests

### TypeScript (Frontend/Packages)
Run Vitest across all applicable packages:
```bash
pnpm test
```

### Python (Backend Services)
Run pytest in each service directory:
```bash
cd services/document-ocr
python3 -m pytest tests/ -v
```

---

## Troubleshooting

- **Database Connection Errors**: Ensure Docker is running and you executed `docker compose up -d` in the `docker/` directory.
- **Port Conflicts**: Ensure ports 3000-3002 and 8000-8004 are free.
- **TypeScript Errors**: Run `pnpm typecheck` to verify strict typing across the monorepo.
