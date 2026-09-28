---
trigger: model_decision
description: Apply when authentication, authorization, secrets, payments, user data, external APIs, infrastructure, or security-sensitive code is involved.
---

# SECURITY

Never commit secrets.
Never print secrets.
Never expose credentials in logs.
Use environment variables or secret managers.
Validate all external input.
Escape or parameterize database queries.
Apply authentication and authorization separately.
Check object-level authorization.
Protect sensitive endpoints.
Use secure password hashing.
Use secure session/token handling.

For file uploads validate:
- file type
- file size
- filename
- storage path
- executable content risk

For payments:
- verify server-side
- validate webhook signatures
- make operations idempotent

Before declaring security-sensitive work complete, perform a security review of the changed code.
