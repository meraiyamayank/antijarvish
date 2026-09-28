# Deployment Documentation

## 1. Quick Start (Local Development)

### Backend
```bash
# Activate virtual environment
.\src\backend\.venv\Scripts\Activate.ps1

# Run migrations and seed demo accounts
python src/backend/manage.py migrate
python src/backend/manage.py seed_data

# Start server
python src/backend/manage.py runserver 127.0.0.1:8000
```

### Frontend
```bash
cd src/frontend
npm run dev
# Accessible at http://localhost:3000
```

---

## 2. Docker Orchestration

Run all three services (PostgreSQL, Django API, Next.js frontend) with a single command:
```bash
docker compose up --build
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Database**: `localhost:5432`

---

## 3. Pre-Seeded Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@jarvis.local` | `AdminPassword123!` | System settings, User RBAC governance |
| **Member** | `member@jarvis.local` | `MemberPassword123!` | Personal project metrics, API usage |
