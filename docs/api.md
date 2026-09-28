# API Documentation

## Overview
Standard specifications and endpoints for the application REST API.

## Response Format

### Success
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message",
    "details": {}
  }
}
```

## Standard Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Invalid payload or malformed request.
- `401 Unauthorized`: Authentication required or invalid token.
- `403 Forbidden`: Authenticated user lacks permission.
- `404 Not Found`: Requested resource does not exist.
- `409 Conflict`: Conflict with current state of resource.
- `422 Unprocessable Entity`: Request validation failure.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unhandled server error.

## Endpoints
*Document endpoints as features are implemented.*
