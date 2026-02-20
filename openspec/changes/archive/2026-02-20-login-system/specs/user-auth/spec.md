## ADDED Requirements

### Requirement: In-memory user store

The server SHALL maintain a module-level dict of valid credentials seeded at startup. Each entry maps a username string to a plaintext password string. No registration endpoint is provided; the user set is fixed for the lifetime of the process.

#### Scenario: User store initialised at startup

- **WHEN** the server process starts
- **THEN** a predefined set of username/password pairs is loaded into memory
- **AND** the store is available for credential verification from the first request

---

### Requirement: Login endpoint

The backend SHALL expose a `POST /login` endpoint that accepts a JSON body with `username` and `password` fields, verifies them against the in-memory user store, and on success issues an opaque session token and records it in a server-side sessions dict.

#### Scenario: Successful login

- **WHEN** a client sends `POST /login` with a valid `{"username": "...", "password": "..."}` body
- **THEN** the server responds with HTTP 200 and `{"token": "<opaque-hex-string>", "username": "<username>"}`
- **AND** the token is stored server-side mapped to the username

#### Scenario: Invalid credentials

- **WHEN** a client sends `POST /login` with an unrecognised username or wrong password
- **THEN** the server responds with HTTP 401 and no token is issued

#### Scenario: Malformed login body

- **WHEN** a client sends `POST /login` with a missing or non-JSON body, or without both `username` and `password` fields
- **THEN** the server responds with HTTP 400

---

### Requirement: Logout endpoint

The backend SHALL expose a `POST /logout` endpoint that accepts a `Authorization: Bearer <token>` header and removes the corresponding session from the server-side sessions dict.

#### Scenario: Successful logout

- **WHEN** a client sends `POST /logout` with a valid `Authorization: Bearer <token>` header
- **THEN** the server removes the token from the sessions dict
- **AND** responds with HTTP 200

#### Scenario: Logout with unknown or missing token

- **WHEN** a client sends `POST /logout` without a token, or with a token not present in sessions
- **THEN** the server responds with HTTP 200 (idempotent — already logged out)

---

### Requirement: Session token validation

The server SHALL expose an internal mechanism to validate a Bearer token from the `Authorization` header and return the associated username, used by protected endpoints.

#### Scenario: Valid token resolves to username

- **WHEN** an incoming request carries `Authorization: Bearer <token>` and the token exists in sessions
- **THEN** the associated username is returned and the request is considered authenticated

#### Scenario: Missing or invalid token

- **WHEN** an incoming request has no `Authorization` header, or carries a token not present in sessions
- **THEN** the request is considered unauthenticated

---

### Requirement: Frontend login form

The frontend SHALL display a login form (username + password fields, submit button) when the user is not authenticated. The form SHALL be hidden once the user is logged in.

#### Scenario: Unauthenticated page load shows login form

- **WHEN** the page loads and no token is present in localStorage
- **THEN** the login form is visible and the abacus Save button is hidden or disabled

#### Scenario: Successful login hides form and shows status

- **WHEN** the user submits valid credentials via the login form
- **THEN** the returned token is stored in localStorage
- **AND** the login form is hidden
- **AND** an auth status bar shows the logged-in username and a logout button

#### Scenario: Failed login shows error message

- **WHEN** the user submits invalid credentials
- **THEN** an error message is displayed within the login form
- **AND** the form remains visible

---

### Requirement: Frontend logout

The frontend SHALL provide a logout button in the auth status bar that calls `POST /logout`, clears the token from localStorage, and returns the UI to the unauthenticated state.

#### Scenario: Logout clears session and shows login form

- **WHEN** the user clicks the logout button
- **THEN** the frontend calls `POST /logout` with the stored token
- **AND** removes the token from localStorage
- **AND** hides the auth status bar and shows the login form
- **AND** hides or disables the Save button
