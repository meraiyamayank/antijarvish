---
trigger: model_decision
description: Apply when creating, modifying, debugging, or validating code.
---

# TESTING

Testing is part of implementation, not an optional final step.

## Required Verification

Run applicable:
- formatter
- linter
- type checker
- unit tests
- integration tests
- build

## Test Priorities

Test:
1. business logic
2. API behavior
3. authentication/authorization
4. validation
5. database behavior
6. important UI flows

## Bug Fix

For a reproducible bug:
1. reproduce
2. identify root cause
3. add regression test
4. fix
5. run regression test
6. run relevant broader tests

Do not modify tests merely to make them pass unless the test itself is demonstrably incorrect.
