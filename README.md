# ClientCore CRM

Premium enterprise SaaS CRM platform scaffold with:

- **Backend:** Java, Spring Boot, JWT security, WebSocket, REST API
- **Frontend:** React, TailwindCSS, Recharts, Framer Motion
- **Data:** PostgreSQL, Redis, Kafka
- **Infra:** Docker Compose + Kubernetes manifests

## Monorepo Layout

- `backend/` Spring Boot API
- `frontend/` React dashboard
- `infra/k8s/` Kubernetes manifests
- `docker-compose.yml` local full stack

## Run Locally

1. Start infra and apps:
   ```bash
   docker compose up --build
   ```
2. Frontend: `http://localhost:5173`
3. Backend: `http://localhost:8080`
4. API sample: `http://localhost:8080/api/dashboard/overview`

## Key Features Included

- Premium dark glassmorphism SaaS UI
- Sidebar with all requested modules + upgrade card
- Dashboard with charts, KPIs, AI insights, activity, tasks, meetings, notifications
- Clients, Deals (kanban), Contacts, Companies, Calendar, Reports, Analytics, Team, Settings pages
- AI assistant chat panel
- Real-time WebSocket endpoint (`/ws`)
- JWT-ready security configuration with RBAC-ready structure
- Realistic CRM demo dataset
