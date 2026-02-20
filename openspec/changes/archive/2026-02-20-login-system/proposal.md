## Why

The abacus app currently allows anyone to save operation history with no identity or access control. Adding a login system lets the app gate the save-to-history action behind authentication, establishing a foundation for per-user features in the future.

## What Changes

- New login page / login form in the frontend: username + password fields, submit button
- New backend endpoint `POST /login` — verifies credentials, issues a session token
- New backend endpoint `POST /logout` — invalidates the session token
- In-memory user store (hardcoded or seeded at startup) — no registration flow needed
- Token stored in browser `localStorage`; sent as `Authorization: Bearer <token>` header on save requests
- `POST /history` now requires a valid token — returns 401 if missing or invalid
- Frontend hides the Save button (or disables it) when the user is not logged in
- Frontend shows current logged-in username and a logout button when authenticated

## Capabilities

### New Capabilities
- `user-auth`: Login/logout endpoints, in-memory user store, token issuance and validation

### Modified Capabilities
- `operation-history`: `POST /history` now requires a valid session token (401 if unauthenticated)

## Impact

- `backend/server.py`: add `/login`, `/logout` endpoints; add token validation to `POST /history`; add in-memory user and session stores
- `frontend/index.html`: add login form section, logged-in status bar
- `frontend/abacus.js`: add login/logout logic, token storage, conditional Save button, attach token to save request
- `frontend/style.css`: style login form and auth status bar
- No new dependencies — Python stdlib and vanilla JS only
