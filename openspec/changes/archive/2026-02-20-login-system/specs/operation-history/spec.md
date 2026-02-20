## MODIFIED Requirements

### Requirement: Save operation endpoint

The backend SHALL expose a `POST /history` endpoint that accepts a JSON body containing a numeric value and stores it in-memory with a server-generated timestamp. The endpoint SHALL require a valid session token supplied as `Authorization: Bearer <token>`. The endpoint SHALL respond with `201 Created` and the saved record on success.

#### Scenario: Successful save

- **WHEN** a client sends `POST /history` with body `{"value": <number>}` and a valid `Authorization: Bearer <token>` header
- **THEN** the server stores the record with the current server timestamp
- **AND** responds with HTTP 201 and `{"value": <number>, "timestamp": "<ISO8601>"}`

#### Scenario: Missing or malformed body

- **WHEN** a client sends `POST /history` with a missing or non-JSON body
- **THEN** the server responds with HTTP 400 and ignores the request

#### Scenario: Missing or invalid token

- **WHEN** a client sends `POST /history` without an `Authorization` header, or with a token not present in server sessions
- **THEN** the server responds with HTTP 401 and does not record the value

---

### Requirement: Save button gated on authentication

The frontend Save button SHALL only be active and functional when the user is authenticated. When unauthenticated, the Save button SHALL be hidden or visually disabled and non-functional.

#### Scenario: Save button hidden when logged out

- **WHEN** the page loads with no token in localStorage
- **THEN** the Save button is not visible or is disabled

#### Scenario: Save button visible when logged in

- **WHEN** the user logs in successfully
- **THEN** the Save button becomes visible and active

#### Scenario: Save attaches token to request

- **WHEN** the authenticated user clicks Save
- **THEN** the frontend includes `Authorization: Bearer <token>` in the `POST /history` request
