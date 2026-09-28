---
trigger: model_decision
description: Apply when designing, implementing, changing, or integrating APIs.
---

# API CONTRACT

Use consistent responses.

Recommended format:

Success:
```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

Error:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": {}
  }
}
```

## Status Codes

Use appropriate HTTP status codes.
- 400: Bad request
- 401: Authentication required
- 403: Permission denied
- 404: Resource not found
- 409: Conflict
- 422: Validation failure when appropriate
- 429: Rate limit
- 500: Unexpected server error

## API Changes

When changing an API:
1. update backend
2. update API documentation
3. update frontend/client
4. update tests
5. run integration tests

Never silently break consumers.
