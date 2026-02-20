## Context

The abacus app is a local full-stack app: a Python stdlib HTTP server (`backend/server.py`) and a static frontend (`frontend/`). Currently `POST /history` accepts any request without identity. This change adds the simplest possible authentication layer consistent with the no-external-dependencies constraint: token-based sessions backed by an in-memory user store.

Security is deliberately lightweight — this is a local demo app, not a production system. The design prioritises simplicity and staying within Python stdlib + vanilla JS.

## Goals / Non-Goals

**Goals:**
- `POST /login` endpoint: verify username + password, issue an opaque session token
- `POST /logout` endpoint: invalidate the token
- In-memory user store seeded at server startup (no registration flow)
- `POST /history` rejects requests without a valid token (HTTP 401)
- Frontend gates the Save button on login state; stores token in `localStorage`
- Login form and auth status bar in the UI

**Non-Goals:**
- Secure password storage (hashing, salting) — plaintext is acceptable for a demo
- Per-user history isolation — history remains shared
- Token expiry or refresh
- Registration / user management UI
- `GET /history` auth protection — read-only, left open
- HTTPS / TLS

## Decisions

### Decision 1: Opaque random token, validated server-side

The server generates a random hex token (`secrets.token_hex(16)`) on login and stores it in a `sessions` dict `{token: username}`. On each protected request, the server looks up the token.

Alternative (JWT): requires external library or complex manual implementation. Opaque tokens are simpler and sufficient for in-process validation.

### Decision 2: In-memory user store seeded at startup

Users are defined as a module-level dict `USERS = {"admin": "admin", "user1": "pass1"}`. No registration endpoint is needed.

Alternative (config file): adds file I/O and parsing complexity with no benefit at this scale.

### Decision 3: Token sent as `Authorization: Bearer <token>` header

Standard HTTP convention. Frontend attaches it to `POST /history` requests. The server reads `self.headers.get('Authorization')` and strips the `Bearer ` prefix.

Alternative (cookie): requires `Set-Cookie` handling, same-origin issues when frontend is served as a local file. Bearer header avoids these.

### Decision 4: Token stored in `localStorage`

Survives page refresh, easy to read/write with vanilla JS. Appropriate for a local demo with no XSS threat model.

Alternative (sessionStorage): lost on tab close, worse UX for a demo.

### Decision 5: Login UI as a panel in the same `index.html` page

Show login panel when unauthenticated, hide it when authenticated. No separate login page or SPA routing needed.

Alternative (separate login.html): extra file, redirect logic, no benefit for a single-user demo.

## Risks / Trade-offs

- **Plaintext passwords in source code** → Acceptable for a local demo; document clearly in README.
- **No token expiry** → Session persists until explicit logout or server restart. Acceptable given scope.
- **`localStorage` accessible to JS** → Low risk locally; not a concern without XSS vectors.
- **Shared history** → All authenticated users see the same history list. Noted as non-goal; not a bug.
- **Server restart clears all sessions** → User must log in again. Consistent with in-memory design.
