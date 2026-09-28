# API Documentation

## Base URL
- Local Dev: `http://localhost:8000/api`
- Production: `https://api.yourdomain.com/api`

## Response Specification
All endpoints strictly adhere to the project API contract (`05-api.md`):

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Human readable description."
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | AUTHENTICATION_FAILED | PERMISSION_DENIED | NOT_FOUND | API_ERROR",
    "message": "Clear explanation of failure.",
    "details": {}
  }
}
```

---

## Endpoints

### 1. Health Probe
- **`GET /api/health/`**
  - **Permissions**: Public (`AllowAny`)
  - **Response**: `{ "success": true, "data": { "status": "healthy" } }`

### 2. Authentication
- **`POST /api/auth/register/`**
  - **Payload**: `{ "email": "user@example.com", "password": "...", "password_confirm": "...", "first_name": "...", "last_name": "..." }`
  - **Response**: `201 Created` with created user details.
- **`POST /api/auth/login/`**
  - **Payload**: `{ "email": "user@example.com", "password": "..." }`
  - **Response**: `200 OK` with `{ "access": "JWT...", "refresh": "JWT...", "user": { ... } }`
- **`POST /api/auth/refresh/`**
  - **Payload**: `{ "refresh": "JWT..." }`
  - **Response**: `200 OK` with `{ "access": "new_token" }`
- **`GET /api/auth/me/`**
  - **Headers**: `Authorization: Bearer <access_token>`
  - **Response**: User profile data.

### 3. Dashboard & RBAC
- **`GET /api/dashboard/stats/`**
  - **Permissions**: `IsAuthenticated`, `IsMemberOrAdmin`
  - **Response**: Returns metrics tailored dynamically to `role` (`MEMBER` or `ADMIN`).
- **`GET /api/dashboard/admin/users/`**
  - **Permissions**: `ADMIN` only
  - **Response**: List of all registered users.
- **`PATCH /api/dashboard/admin/users/<int:user_id>/`**
  - **Permissions**: `ADMIN` only
  - **Payload**: `{ "role": "ADMIN" | "MEMBER", "is_active": true | false }`
  - **Response**: Updated user model.
