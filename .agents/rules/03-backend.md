---
trigger: glob
description: Backend engineering standards for API and server code.
globs: "**/*.{py,js,ts}"
---

# BACKEND ENGINEERING

## API

Every endpoint must consider:
- authentication
- authorization
- validation
- business rules
- error handling
- logging
- response consistency

## Validation

Validate:
- body
- query parameters
- path parameters
- uploaded files
- external API responses

Never trust client input.

## Error Handling

Use a centralized error handling strategy. Do not expose:
- stack traces
- database credentials
- internal secrets
- sensitive infrastructure information

## Business Logic

Keep business logic outside controllers/views where practical.

Prefer:
Controller ↓ Service ↓ Repository / ORM ↓ Database

## Django

Prefer:
- Django REST Framework
- serializers for validation
- service layer for complex business logic
- ORM
- migrations
- permissions
- transactions

Avoid putting complex business logic directly into views.

## Node / Express

Prefer:
Route ↓ Controller ↓ Service ↓ Repository

Use centralized error middleware.
Use schema validation.
Do not duplicate validation logic across controllers.
