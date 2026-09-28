---
trigger: model_decision
description: Apply when designing architecture, modules, services, folders, integrations, or large features.
---

# ARCHITECTURE RULES

Prefer boring, explicit and maintainable architecture.

Before creating architecture:
1. inspect existing architecture
2. identify boundaries
3. identify data flow
4. identify dependencies
5. identify failure points

## Principles

Prefer:
- modular design
- single responsibility
- dependency inversion where useful
- explicit interfaces
- reusable components
- typed contracts
- centralized configuration
- testable business logic

Avoid:
- unnecessary abstraction
- premature microservices
- circular dependencies
- duplicated business logic
- giant modules
- magic constants
- hidden side effects

## New Services

Do not create a new service merely because it is technically possible. Use a separate service only when there is a clear operational or architectural reason.

## Documentation

For major architecture changes update:
- `docs/architecture.md`
- `.agents/memory/DECISIONS.md`
