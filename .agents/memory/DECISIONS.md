# ARCHITECTURAL DECISIONS

## Format
### YYYY-MM-DD — Decision Title
- **Decision**: ...
- **Reason**: ...
- **Alternatives**: ...
- **Consequences**: ...

---

# Decisions

### 2026-09-28 — Initial JARVIS System Architecture Setup
- **Decision**: Adopt the JARVIS autonomous software engineering system utilizing Antigravity workspace rules (`.agents/rules/*`), the `/jarvis` orchestrator skill (`.agents/skills/jarvis/`), structured persistent memory (`.agents/memory/*`), and isolated MCP configuration.
- **Reason**: Enables autonomous, reproducible, and verifiable engineering workflows across frontend, backend, database, testing, and DevOps domains.
- **Alternatives**: Single monolithic system prompt or unstructured prompting.
- **Consequences**: Consistent execution loop (Discover → Analyze → Plan → Implement → Verify → Repair → Test → Document → Finalize) with explicit verification gates and clear architectural standards.

### 2026-09-28 — AWS IaC Architecture (Terraform with ECS Fargate & ALB)
- **Decision**: Architect production cloud deployment using Terraform to provision AWS VPC across 2 AZs, private RDS PostgreSQL, and dual ECS Fargate tasks behind a single Application Load Balancer using path-based routing.
- **Reason**: Serverless container management removes EC2 maintenance overhead, multi-AZ provides high availability, and single ALB routing eliminates CORS and domain complexity.
- **Alternatives**: Raw EC2 instances, Kubernetes (EKS), or Elastic Beanstalk.
- **Consequences**: Cost-effective, autoscaling, containerized deployment with zero server patching required.

### 2026-09-28 — API Key Hashing and Multi-Tenancy Architecture
- **Decision**: Implement machine credentials using SHA-256 hashed API keys with public prefix identification (`jrv_live_...`) and store only the hash in the database, returning the secret only at creation time.
- **Reason**: Follows industry standards (GitHub/Stripe key patterns) ensuring even a full database compromise cannot leak usable credentials.
- **Alternatives**: Storing plaintext keys or symmetric reversible encryption.
- **Consequences**: Secret keys cannot be retrieved if forgotten (must be rotated), ensuring zero leakage risk.
