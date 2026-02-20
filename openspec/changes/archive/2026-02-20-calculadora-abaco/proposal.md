## Why

An abacus-style calculator provides an intuitive, visual way to perform arithmetic using a classic bead-and-rod interface. This project builds the full-stack app from scratch: an interactive frontend where users slide beads to compute values, backed by a minimal Python HTTP server that stores operation history in memory.

## What Changes

- New interactive abacus UI rendered in HTML/CSS/JS with clickable beads on rods
- Visual representation of a soroban abacus (rods with heaven and earth beads)
- Real-time value display derived from bead positions
- Minimal Python HTTP server (stdlib only) with endpoints to save and retrieve operation history
- In-memory history storage (no database, no external dependencies)

## Capabilities

### New Capabilities
- `abacus-ui`: Interactive bead-based calculator frontend — rods, beads, value display, and reset control
- `operation-history`: Backend API for saving completed calculations and retrieving history (in-memory)

### Modified Capabilities
<!-- none — greenfield project -->

## Impact

- New files: `backend/server.py`, `frontend/index.html`, `frontend/style.css`, `frontend/abacus.js`
- Dependencies: Python stdlib only (`http.server`, `json`); vanilla JS, no build tooling
