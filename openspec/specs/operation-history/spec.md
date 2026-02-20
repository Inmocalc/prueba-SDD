## ADDED Requirements

### Requirement: Save operation endpoint

The backend SHALL expose a `POST /history` endpoint that accepts a JSON body containing a numeric value and stores it in-memory with a server-generated timestamp. The endpoint SHALL respond with `201 Created` and the saved record on success.

#### Scenario: Successful save

- **WHEN** a client sends `POST /history` with body `{"value": <number>}`
- **THEN** the server stores the record with the current server timestamp
- **AND** responds with HTTP 201 and `{"value": <number>, "timestamp": "<ISO8601>"}`

#### Scenario: Missing or malformed body

- **WHEN** a client sends `POST /history` with a missing or non-JSON body
- **THEN** the server responds with HTTP 400 and ignores the request

---

### Requirement: Retrieve history endpoint

The backend SHALL expose a `GET /history` endpoint that returns all saved operation records in chronological order (oldest first) as a JSON array.

#### Scenario: History with entries

- **WHEN** a client sends `GET /history` and records exist
- **THEN** the server responds with HTTP 200 and a JSON array of `{value, timestamp}` objects ordered oldest first

#### Scenario: Empty history

- **WHEN** a client sends `GET /history` and no records have been saved
- **THEN** the server responds with HTTP 200 and an empty array `[]`

---

### Requirement: CORS support

The backend SHALL include `Access-Control-Allow-Origin: *` in all responses so that the frontend page served from the filesystem (or a different port) can call the API without browser CORS errors.

#### Scenario: CORS header present on all responses

- **WHEN** a client makes any request to the backend
- **THEN** the response includes the header `Access-Control-Allow-Origin: *`

#### Scenario: Preflight OPTIONS request

- **WHEN** the browser sends an `OPTIONS` preflight request to any endpoint
- **THEN** the server responds with HTTP 200 and the appropriate CORS headers

---

### Requirement: In-memory storage lifetime

History SHALL be stored in the server process memory only. All records SHALL be lost when the server process is stopped or restarted. No file or database persistence is required.

#### Scenario: History resets on server restart

- **WHEN** the backend server process is restarted
- **THEN** `GET /history` returns an empty array
