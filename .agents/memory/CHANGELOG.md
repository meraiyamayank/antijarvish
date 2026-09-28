# CHANGELOG

## Unreleased

### Added
- Initialized JARVIS v1 autonomous engineering framework for Antigravity.
- Established `AGENTS.md` permanent operating contract.
- Added modular behavioral rules in `.agents/rules/`:
  - `00-jarvis-core.md`: Always-on autonomous engineering loop.
  - `01-architecture.md`: Clean architecture and service boundaries.
  - `02-frontend.md`: Modern responsive UI, React/Next.js conventions.
  - `03-backend.md`: Layered architecture, Django & Express standards.
  - `04-database.md`: Migrations, relational integrity, and safe schema handling.
  - `05-api.md`: Standardized JSON API responses and status codes.
  - `06-testing.md`: Verification protocols, linting, and regression testing.
  - `07-security.md`: Secrets management, input validation, and security review.
  - `08-devops.md`: Docker, AWS, CI/CD, and infrastructure reproducibility.
- Created `/jarvis` orchestrator skill in `.agents/skills/jarvis/SKILL.md`.
- Configured persistent memory files (`PROJECT.md`, `DECISIONS.md`, `TASKS.md`, `CHANGELOG.md`).
- Added baseline `.agents/mcp_config.json`.
- Scaffolded project documentation templates under `docs/`.

### Changed

### Fixed

### Security
- Secret protection conventions enforced across rules and memory.

### Infrastructure
