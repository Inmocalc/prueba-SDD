## 1. Backend — User Store & Session Infrastructure

- [x] 1.1 Add `import secrets` to `backend/server.py`
- [x] 1.2 Add module-level `USERS` dict with at least two hardcoded username/password pairs (e.g. `admin`/`admin`, `user1`/`pass1`)
- [x] 1.3 Add module-level `sessions` dict (maps token string → username)
- [x] 1.4 Add `_get_token(self)` helper method: reads `Authorization` header, strips `Bearer ` prefix, returns token string or `None`
- [x] 1.5 Add `_authenticated_user(self)` helper method: calls `_get_token`, looks up in `sessions`, returns username or `None`
- [x] 1.6 Update `_cors_headers()` to add `Authorization` to `Access-Control-Allow-Headers`

## 2. Backend — Login & Logout Endpoints

- [x] 2.1 Add `POST /login` branch in `do_POST`: parse JSON body, validate `username` and `password` fields present (400 if missing/malformed)
- [x] 2.2 Check credentials against `USERS`; if invalid respond 401; if valid generate token with `secrets.token_hex(16)`, store in `sessions`, respond 200 with `{"token": ..., "username": ...}`
- [x] 2.3 Add `POST /logout` branch in `do_POST`: call `_get_token()`, remove from `sessions` if present, respond 200 (idempotent)

## 3. Backend — Protect POST /history

- [x] 3.1 At the start of the `POST /history` handler, call `_authenticated_user()`; if it returns `None`, respond 401 with CORS headers and return early

## 4. Frontend HTML — Login UI

- [x] 4.1 Add a `<div id="login-panel">` section in `index.html` before the abacus, containing: username input, password input, login submit button, and an error `<span id="login-error">`
- [x] 4.2 Add a `<div id="auth-bar">` section showing `<span id="auth-username"></span>` and a logout button `<button id="logout-btn">`
- [x] 4.3 Move `<button id="save-btn">` and `<span id="save-confirm">` inside a wrapper or leave in `#controls` — ensure they can be hidden via JS

## 5. Frontend JS — Auth Helpers

- [x] 5.1 Add `getToken()` → `localStorage.getItem('abacus_token')`
- [x] 5.2 Add `setToken(token)` → `localStorage.setItem('abacus_token', token)`
- [x] 5.3 Add `clearToken()` → `localStorage.removeItem('abacus_token')`
- [x] 5.4 Add `updateAuthUI()`: if token present → hide `#login-panel`, show `#auth-bar` and `#save-btn`; if no token → show `#login-panel`, hide `#auth-bar` and `#save-btn`
- [x] 5.5 Update `updateAuthUI()` to also set `#auth-username` text to stored username (`localStorage.getItem('abacus_user')`)

## 6. Frontend JS — Login & Logout Handlers

- [x] 6.1 Add `handleLogin(event)`: prevent default form submit, read username/password from inputs, POST to `http://localhost:8000/login`; on 200 → store token and username in localStorage, clear error, call `updateAuthUI()`; on 401 → show `#login-error` "Invalid credentials"; on other error → show generic error
- [x] 6.2 Add `handleLogout()`: call `POST /logout` with Bearer token, then `clearToken()`, remove stored username, call `updateAuthUI()`
- [x] 6.3 Wire login form `submit` event to `handleLogin`
- [x] 6.4 Wire `#logout-btn` click event to `handleLogout`

## 7. Frontend JS — Update saveValue

- [x] 7.1 Update `saveValue()` to include `Authorization: Bearer <token>` header in the `POST /history` fetch (read token with `getToken()`)

## 8. Frontend JS — Init

- [x] 8.1 Call `updateAuthUI()` at page init (after `buildAbacus()`) so the correct UI state is shown on load/refresh

## 9. Frontend CSS — Login UI Styling

- [x] 9.1 Style `#login-panel`: centered card with padding, border-radius, background, gap between fields
- [x] 9.2 Style `#login-panel` inputs and submit button to match app theme
- [x] 9.3 Style `#login-error`: red text, hidden by default (`display: none`), shown when non-empty
- [x] 9.4 Style `#auth-bar`: horizontal flex row with username text and logout button, matching app palette
- [x] 9.5 Ensure `#save-btn` hidden state works correctly (JS sets `display: none` / `display: inline`)

## 10. Integration Check

- [ ] 10.1 Start `backend/server.py`, open `frontend/index.html` — confirm login form is shown and Save button is hidden
- [ ] 10.2 Submit invalid credentials — confirm error message appears
- [ ] 10.3 Submit valid credentials — confirm login form hides, auth bar shows username, Save becomes visible
- [ ] 10.4 Click Save with a bead value set — confirm 201 response and history is recorded
- [ ] 10.5 Refresh page — confirm user remains logged in (token persists in localStorage)
- [ ] 10.6 Click Logout — confirm form returns, Save hides, token is cleared
- [x] 10.7 Attempt `POST /history` without token (e.g. via curl) — confirm 401 response
