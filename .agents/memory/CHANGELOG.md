# CHANGELOG

## Unreleased

### Added
- **AWS Terraform Infrastructure (`infra/terraform/`)**:
  - `vpc.tf`: Multi-AZ VPC across 2 Availability Zones with public subnets, private subnets, Internet Gateway, Elastic IP, NAT Gateway, and segregated route tables.
  - `rds.tf`: Amazon RDS PostgreSQL 16 database instance (`db.t4g.micro`) with private DB subnet group and restricted security group allowing ingress only from ECS backend tasks.
  - `alb.tf`: Application Load Balancer with public security groups, dual target groups (Backend port 8000, Frontend port 3000), health checks, and path-based routing rules (`/api/*` and `/admin/*` routed to Django; default routed to Next.js).
  - `ecs.tf`: ECS Fargate cluster with Container Insights, IAM execution roles, CloudWatch log groups, task definitions, and dual auto-recovering services for backend and frontend.
  - `variables.tf` & `outputs.tf`: Clean parameters and export values for ALB DNS, RDS endpoint, cluster name, and service identifiers.
- **API Key Management App (`apps.apikeys`)**:
  - `APIKey` model featuring cryptographic raw key generation (`jrv_live_...`), prefix extraction for identification, SHA-256 hash storage, granular scopes, expiration timestamps, and usage tracking.
  - `APIKeyAuthentication` DRF authenticator supporting both `X-API-Key` and `Authorization: Api-Key` headers with user account validation and timestamp updating.
  - Full CRUD REST API endpoints (`/api/apikeys/`) for generating, listing, inspecting, updating, and revoking API keys.
- **Frontend Dashboard API Key Console**:
  - Added real-time API Key management panel to `/dashboard`.
  - Added key creation form, interactive secret display with copy-to-clipboard, revoke action, and copyable cURL sample snippet.
- **Pytest Test Suite Expansion**:
  - Added 10 tests in `tests/test_apikeys.py` covering key creation, secret masking, user isolation, header authentication, expiration, and revocation (totaling 18 tests passing).

### Security
- Passwords hashed using PBKDF2; API keys hashed using SHA-256 with constant-time verification.
- RDS PostgreSQL placed strictly inside private subnets without public IPs.
- Least-privilege IAM task execution roles and security groups for ECS.
- Strict multi-tenant isolation ensuring users cannot view, access, or modify keys belonging to other accounts.
