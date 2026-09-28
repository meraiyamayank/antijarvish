---
trigger: model_decision
description: Apply when working with Docker, AWS, CI/CD, Kubernetes, Terraform, deployment, infrastructure, or production configuration.
---

# DEVOPS

Infrastructure must be reproducible.

Prefer:
- Docker
- environment variables
- IaC
- CI/CD
- health checks
- structured logs
- monitoring

## Deployment Flow

Code ↓ Lint ↓ Type Check ↓ Unit Tests ↓ Integration Tests ↓ Build ↓ Docker Build ↓ Security Checks ↓ Deploy ↓ Health Check ↓ Smoke Test

## AWS

Before infrastructure changes:
- inspect existing resources
- identify dependencies
- verify region
- verify credentials
- estimate impact

Never destroy infrastructure automatically.

For Terraform:
- `terraform fmt`
- `terraform validate`
- `terraform plan`

Apply only when authorized.

## Kubernetes

Verify:
- manifests
- namespaces
- secrets
- config
- probes
- resource limits
- service
- ingress

Use rollout status after deployment.
