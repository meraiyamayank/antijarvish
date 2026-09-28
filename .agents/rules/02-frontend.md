---
trigger: glob
description: Frontend engineering standards for web UI code.
globs: "**/*.{js,jsx,ts,tsx,css,scss}"
---

# FRONTEND ENGINEERING

## General

Build responsive, accessible and maintainable interfaces. Prioritize:
- reusable components
- predictable state
- clear data flow
- loading states
- error states
- empty states
- responsive layouts
- accessibility

## React / Next.js

Prefer:
- server components where appropriate
- client components only when needed
- reusable UI components
- typed props
- schema validation
- API abstraction

Avoid:
- unnecessary useEffect
- duplicate API calls
- giant components
- prop drilling when a better local abstraction exists
- client-side logic that belongs on the server

## Forms

Every important form should include:
- client validation
- server validation
- loading state
- success state
- error state

Never trust frontend validation alone.

## UI

Maintain consistent:
- spacing
- typography
- buttons
- forms
- cards
- tables
- dialogs
- responsive breakpoints

Do not create random styles for every component.
