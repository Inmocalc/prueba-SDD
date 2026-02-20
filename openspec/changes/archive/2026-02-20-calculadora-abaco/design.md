## Context

Greenfield full-stack project with no existing codebase. The goal is a soroban (Japanese abacus) calculator:
- Frontend: static HTML/CSS/JS served directly (no bundler, no framework)
- Backend: Python stdlib HTTP server (`http.server`) running locally
- No external dependencies on either side

The soroban has a fixed structure: multiple rods (columns), each with 1 heaven bead (worth 5) above a divider and 4 earth beads (worth 1 each) below. The value of a rod is the sum of active beads. Total displayed value is the positional sum across all rods.

## Goals / Non-Goals

**Goals:**
- Clickable bead UI that reflects soroban rules (beads slide toward the divider to activate)
- Real-time value computation from bead positions
- Reset button to clear the abacus
- Backend endpoint to record a "save" event (current value + timestamp) and retrieve history
- Frontend calls backend to save history; backend holds it in-memory (lost on restart)

**Non-Goals:**
- Drag-and-drop bead interaction (click-to-toggle is sufficient)
- Arithmetic operations (add, subtract) — the abacus IS the calculator; value comes from bead positions
- Persistent storage across server restarts
- Authentication, multi-user support
- Responsive/mobile layout
- More than a single-page UI

## Decisions

### Decision 1: Soroban column count — 9 rods

A 9-rod soroban supports values 0–999,999,999. This is the standard compact size for demos.
Alternative (13-rod full soroban) is larger than needed for a demo app.

### Decision 2: Click-to-toggle bead activation

Each bead click toggles its active state, subject to soroban constraints:
- Earth beads activate by moving **up** toward the divider
- Heaven bead activates by moving **down** toward the divider
- Earth beads activate in sequence (lowest first); can't activate bead 3 without 1 and 2 active

Alternative (free-form toggle) ignores soroban rules and produces invalid states. Enforcing constraints keeps the UI faithful to a real abacus.

### Decision 3: Backend as a simple HTTP server on `http.server.BaseHTTPRequestHandler`

Python stdlib `http.server` requires no installation and is sufficient for two endpoints:
- `POST /history` — append `{value, timestamp}` to an in-memory list
- `GET /history` — return the full list as JSON

Alternative (Flask/FastAPI) adds external dependencies for no benefit at this scale.

### Decision 4: Frontend fetches backend at hardcoded `localhost:8000`

Simple and sufficient for local development. No config file or env-var needed given the scope.
CORS is handled by the server returning `Access-Control-Allow-Origin: *`.

### Decision 5: No build step — plain JS module

The abacus logic lives in `abacus.js` as a plain script included via `<script src>`.
Alternative (ES modules, Webpack, etc.) introduces tooling complexity not warranted here.

## Risks / Trade-offs

- **In-memory history is lost on restart** → Accepted trade-off per proposal; not a bug, by design.
- **No input validation on POST /history** → Low risk (local-only, no auth); server ignores malformed payloads.
- **Soroban constraint enforcement in JS can get complex** → Mitigation: represent each rod as an integer 0–9 and derive bead states from the value rather than tracking individual bead states.
- **`http.server` is not production-grade** → Fine for local use; document in README.
