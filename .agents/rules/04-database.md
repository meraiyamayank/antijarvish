---
trigger: model_decision
description: Apply when creating or modifying database schemas, queries, migrations, indexes, or data access.
---

# DATABASE ENGINEERING

Before database changes:
1. inspect existing schema
2. inspect relationships
3. inspect indexes
4. inspect migrations
5. understand existing data

## Rules

- Use migrations. Do not manually mutate production schema.
- Use foreign keys where appropriate.
- Use unique constraints where appropriate.
- Index frequently queried fields.
- Avoid N+1 queries.
- Use pagination for large datasets.
- Use transactions for multi-step writes where atomicity matters.
- Avoid fetching unnecessary columns.
- Do not delete production data unless explicitly authorized.

For destructive migrations:
- explain impact
- provide rollback strategy
- require explicit approval before executing against production
