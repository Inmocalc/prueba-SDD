## 1. Project Structure

- [x] 1.1 Create `backend/` and `frontend/` directories
- [x] 1.2 Create empty files: `backend/server.py`, `frontend/index.html`, `frontend/style.css`, `frontend/abacus.js`

## 2. Backend — HTTP Server

- [x] 2.1 Implement `server.py` using `http.server.BaseHTTPRequestHandler` listening on port 8000
- [x] 2.2 Add in-memory list to store history records (module-level variable)
- [x] 2.3 Implement `POST /history`: parse JSON body, validate `value` field, append `{value, timestamp}` record, respond 201
- [x] 2.4 Implement `GET /history`: respond 200 with JSON array of all records (oldest first)
- [x] 2.5 Implement `OPTIONS` preflight: respond 200 with CORS headers
- [x] 2.6 Add `Access-Control-Allow-Origin: *` and `Content-Type: application/json` headers to all responses
- [x] 2.7 Return HTTP 400 for malformed or non-JSON POST body

## 3. Frontend — HTML Structure

- [x] 3.1 Create `index.html` with page title, abacus container div, value display element, and buttons (Reset, Save)
- [x] 3.2 Link `style.css` and `abacus.js` in `index.html`

## 4. Frontend — Abacus Logic (`abacus.js`)

- [x] 4.1 Define state as an array of 9 rod values (integers 0–9), initialized to all zeros
- [x] 4.2 Implement `getRodValue(rodIndex)` → returns current integer value (0–9) for the rod
- [x] 4.3 Implement `getTotalValue()` → positional sum of all rod values (rod 0 = highest place)
- [x] 4.4 Implement `setRodValue(rodIndex, newValue)` → update state and re-render that rod
- [x] 4.5 Implement `renderRod(rodIndex)` → derive bead active states from integer value and update DOM classes
  - Earth beads: N earth beads active = beads 1..N active (closest to divider first)
  - Heaven bead: active if value ≥ 5
- [x] 4.6 Implement click handler for earth bead N on rod R:
  - If bead N is currently inactive → set rod value to (heaven_active ? 5 : 0) + N
  - If bead N is currently active → set rod value to (heaven_active ? 5 : 0) + (N - 1)
- [x] 4.7 Implement click handler for heaven bead on rod R:
  - Toggle: if active (value ≥ 5) → subtract 5; if inactive (value < 5) → add 5
- [x] 4.8 Implement `updateDisplay()` → write `getTotalValue()` to the value display element
- [x] 4.9 Wire all bead click handlers to call `updateDisplay()` after state change
- [x] 4.10 Implement reset button handler → set all rod values to 0, re-render all rods, update display
- [x] 4.11 Implement save button handler → POST `{value: getTotalValue()}` to `http://localhost:8000/history`, show brief confirmation text on success

## 5. Frontend — CSS Styling

- [x] 5.1 Style the abacus container: horizontal row of rods
- [x] 5.2 Style each rod: vertical flex column with divider bar separating heaven and earth sections
- [x] 5.3 Style beads: circular shape, distinct inactive vs active colors, pointer cursor
- [x] 5.4 Style the value display: large readable number
- [x] 5.5 Style Reset and Save buttons; style save confirmation message (hidden by default, visible briefly on save)

## 6. Integration Check

- [ ] 6.1 Open `frontend/index.html` in a browser and verify 9 rods render with correct bead layout
- [ ] 6.2 Click beads and confirm value display updates correctly (test a known value, e.g. all earth beads on rod 9 = 4)
- [ ] 6.3 Confirm reset returns all beads to inactive and display to 0
- [x] 6.4 Start `backend/server.py` and click Save — verify record appears in `GET /history` response
