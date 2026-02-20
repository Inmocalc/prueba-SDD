## ADDED Requirements

### Requirement: Soroban abacus layout

The UI SHALL render a soroban abacus with 9 rods arranged horizontally. Each rod SHALL display 1 heaven bead above a horizontal divider bar and 4 earth beads below it. The column order SHALL represent decimal place values from left (highest) to right (lowest).

#### Scenario: Page load renders 9 rods

- **WHEN** the user opens the page
- **THEN** 9 rods are visible, each with a divider, 1 heaven bead above it, and 4 earth beads below it
- **AND** all beads start in the inactive (away from divider) position

#### Scenario: Initial value is zero

- **WHEN** the page loads with all beads inactive
- **THEN** the displayed numeric value is 0

---

### Requirement: Bead activation rules

Earth beads SHALL activate by moving upward toward the divider. The heaven bead SHALL activate by moving downward toward the divider. Earth beads MUST activate in ascending order: bead 1 (closest to divider) must be active before bead 2 can activate, and so on. A rod's value SHALL equal the sum of active earth beads (1 each) plus 5 if the heaven bead is active, giving a range of 0–9 per rod.

#### Scenario: Clicking an inactive earth bead activates it and all below it

- **WHEN** the user clicks earth bead N (1-indexed from divider) on a rod
- **THEN** earth beads 1 through N on that rod become active (moved toward divider)

#### Scenario: Clicking an active earth bead deactivates it and all above it

- **WHEN** the user clicks an active earth bead N on a rod
- **THEN** earth beads N through 4 on that rod become inactive (moved away from divider)

#### Scenario: Heaven bead toggles independently

- **WHEN** the user clicks the inactive heaven bead on a rod
- **THEN** the heaven bead becomes active (moved toward divider) and the rod value increases by 5

#### Scenario: Clicking the active heaven bead deactivates it

- **WHEN** the user clicks the active heaven bead on a rod
- **THEN** the heaven bead becomes inactive and the rod value decreases by 5

---

### Requirement: Real-time value display

The UI SHALL display the current total numeric value of the abacus at all times. The value SHALL update immediately after any bead state change. The value SHALL be computed as the positional sum of all rod values (rod 1 from the right = ones, rod 2 = tens, etc.).

#### Scenario: Value updates on bead click

- **WHEN** the user activates or deactivates any bead
- **THEN** the displayed total value updates immediately to reflect the new bead configuration

#### Scenario: Maximum representable value

- **WHEN** all beads on all 9 rods are active
- **THEN** the displayed value is 999999999

---

### Requirement: Reset control

The UI SHALL provide a reset button that returns all beads to their inactive positions and resets the displayed value to 0.

#### Scenario: Reset clears all beads

- **WHEN** the user clicks the reset button
- **THEN** all beads on all rods return to inactive positions
- **AND** the displayed value becomes 0

---

### Requirement: Save to history

The UI SHALL provide a save button that sends the current abacus value to the backend and records it in operation history.

#### Scenario: Save records current value

- **WHEN** the user clicks the save button
- **THEN** the frontend sends a POST request to the backend with the current value
- **AND** the UI shows a brief confirmation that the value was saved

#### Scenario: Save with value zero

- **WHEN** the user clicks save while the abacus value is 0
- **THEN** the value 0 is still sent and recorded normally
