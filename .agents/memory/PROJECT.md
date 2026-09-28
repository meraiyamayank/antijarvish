# PROJECT MEMORY

## Project Name
Jarvish

## Purpose
Autonomous software engineering system and application workspace powered by Antigravity and JARVIS protocols.

## Stack

### Frontend
Preferred:
- Next.js
- TypeScript
- React
- Tailwind CSS
- React Native (for mobile applications)

### Backend
Preferred:
- Python
- Django
- Django REST Framework
- Node.js / Express (when specifically appropriate)

### Database
Preferred:
- PostgreSQL
- MySQL (where required for existing systems)

### Infrastructure
Preferred:
- AWS
- Docker
- GitHub Actions
- Terraform
- Kubernetes (when justified)

### Testing
- Pytest
- Jest / Vitest
- React Testing Library

### CI/CD
- GitHub Actions

## Architecture
Modular full-stack architecture with clear layer separation:
Route / Controller → Service Layer → Repository / ORM → Database

## Important Conventions
- Code Quality: TypeScript, Python type hints, ESLint, Prettier, Ruff, Pytest
- REST API standard: structured responses `{ success, data/error, message }`, status codes, centralized error handling, pagination, filtering, rate limiting
- Frontend Design: Modern SaaS aesthetic, responsive layouts, 8px spacing system, rounded cards, consistent typography, accessible forms, loading/empty/error states

## Environment Variables
Only document variable names. Never store actual secrets here.

## Important Integrations
- Antigravity agent & skill-based orchestration (`/jarvis`, `/goal`, `/learn`)
- MCP Tool Layer (devtools, filesystem, database, browser, documentation, cloud)
