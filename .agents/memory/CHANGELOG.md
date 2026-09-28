# CHANGELOG

## Unreleased

### Added
- **Backend Core**: Django REST Framework API engine in `src/backend`.
- **Authentication**: JWT authentication with `djangorestframework-simplejwt`, token refresh rotation, and custom claims.
- **RBAC**: Custom User model supporting `ADMIN` and `MEMBER` roles with custom permission guards (`IsAdminUserRole`, `IsMemberOrAdmin`).
- **Standardized API Contract**: Enforced `{ success, data/error, message }` responses via custom exception handler adhering to `05-api.md`.
- **Database Seeder**: Added `python manage.py seed_data` command creating demo Administrator and Member accounts.
- **Backend Tests**: 8 unit and integration tests using `pytest-django` covering registration, authentication, RBAC boundaries, and stats.
- **Frontend App**: Next.js 14 App Router in `src/frontend` with TypeScript and Tailwind CSS.
- **Design System**: Dark mode SaaS interface with glassmorphism panels, gradient accents, and responsive layout.
- **Auth Context**: Client-side `AuthContext` with session hydration, login, register, and logout handling.
- **Dashboards**:
  - Member Dashboard (`/dashboard`) displaying personal metrics, service health, and API tokens.
  - Admin Dashboard (`/admin`) displaying revenue, uptime, total users, and interactive user role management.
- **DevOps**:
  - `docker-compose.yml` orchestrating PostgreSQL 16, Django API, and Next.js frontend with health checks.
  - Multi-stage Dockerfiles for backend and frontend.
  - GitHub Actions CI/CD workflow (`.github/workflows/ci.yml`).
- **Documentation**: Updated `docs/architecture.md`, `docs/api.md`, and `docs/deployment.md`.

### Security
- Passwords hashed using PBKDF2 with Django default validators.
- JWT access tokens set to 60-minute expiration with separate refresh tokens.
- CORS configured with credentials allowed.
- Environment variables separated from code via `.env` and `.gitignore`.
