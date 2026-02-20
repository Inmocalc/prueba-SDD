// --- State ---
// Each rod is an integer 0-9.
// Heaven bead is active when value >= 5.
// Earth active count = value % 5 (beads 1..N active, 1 = closest to divider).
const NUM_RODS = 9;
const rods = new Array(NUM_RODS).fill(0);

// --- State accessors ---

function getRodValue(i) {
  return rods[i];
}

function getTotalValue() {
  let total = 0;
  for (let i = 0; i < NUM_RODS; i++) {
    const place = NUM_RODS - 1 - i; // rod 0 = highest place value
    total += rods[i] * Math.pow(10, place);
  }
  return total;
}

function setRodValue(i, v) {
  rods[i] = Math.max(0, Math.min(9, v));
  renderRod(i);
}

// --- Rendering ---

function renderRod(i) {
  const value = rods[i];
  const heavenActive = value >= 5;
  const earthCount = value % 5;

  const rodEl = document.querySelector(`.rod[data-rod="${i}"]`);

  const heavenBead = rodEl.querySelector('.bead.heaven');
  heavenBead.classList.toggle('active', heavenActive);

  // Earth beads: index 0 in DOM = bead 1 (closest to divider)
  const earthBeads = rodEl.querySelectorAll('.bead.earth');
  earthBeads.forEach((bead, idx) => {
    const n = idx + 1; // 1-indexed
    bead.classList.toggle('active', n <= earthCount);
  });
}

function updateDisplay() {
  document.getElementById('value-display').textContent =
    getTotalValue().toLocaleString();
}

// --- Click handlers ---

function handleEarthClick(rodIndex, n) {
  const value = rods[rodIndex];
  const heavenPart = value >= 5 ? 5 : 0;
  const earthCount = value % 5;

  // If bead N is active → deactivate N..4 (new earth count = N-1)
  // If bead N is inactive → activate 1..N (new earth count = N)
  const newEarthCount = n <= earthCount ? n - 1 : n;
  setRodValue(rodIndex, heavenPart + newEarthCount);
  updateDisplay();
}

function handleHeavenClick(rodIndex) {
  const value = rods[rodIndex];
  setRodValue(rodIndex, value >= 5 ? value - 5 : value + 5);
  updateDisplay();
}

// --- Auth helpers ---

function getToken() {
  return localStorage.getItem('abacus_token');
}

function setToken(token) {
  localStorage.setItem('abacus_token', token);
}

function clearToken() {
  localStorage.removeItem('abacus_token');
  localStorage.removeItem('abacus_user');
}

function updateAuthUI() {
  const token = getToken();
  const loginPanel = document.getElementById('login-panel');
  const authBar = document.getElementById('auth-bar');
  const saveBtn = document.getElementById('save-btn');
  const saveConfirm = document.getElementById('save-confirm');

  if (token) {
    loginPanel.style.display = 'none';
    authBar.style.display = 'flex';
    saveBtn.style.display = 'inline';
    saveConfirm.style.display = 'none';
    document.getElementById('auth-username').textContent =
      localStorage.getItem('abacus_user') || '';
  } else {
    loginPanel.style.display = 'flex';
    authBar.style.display = 'none';
    saveBtn.style.display = 'none';
    saveConfirm.style.display = 'none';
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  try {
    const res = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
      localStorage.setItem('abacus_user', data.username);
      updateAuthUI();
    } else if (res.status === 401) {
      errorEl.textContent = 'Invalid credentials';
    } else {
      errorEl.textContent = 'Login failed. Try again.';
    }
  } catch (e) {
    errorEl.textContent = 'Could not reach server.';
  }
}

async function handleLogout() {
  const token = getToken();
  try {
    await fetch('http://localhost:8000/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  } catch (e) {
    // Ignore network errors — clear session locally regardless
  }
  clearToken();
  updateAuthUI();
}

// --- Controls ---

function resetAll() {
  for (let i = 0; i < NUM_RODS; i++) {
    setRodValue(i, 0);
  }
  updateDisplay();
}

async function saveValue() {
  const value = getTotalValue();
  const token = getToken();
  try {
    const res = await fetch('http://localhost:8000/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ value }),
    });
    if (res.ok) {
      const msg = document.getElementById('save-confirm');
      msg.style.display = 'inline';
      setTimeout(() => { msg.style.display = 'none'; }, 1500);
    }
  } catch (e) {
    console.error('Failed to save:', e);
  }
}

// --- DOM construction ---

function buildAbacus() {
  const container = document.getElementById('abacus');
  for (let i = 0; i < NUM_RODS; i++) {
    const rod = document.createElement('div');
    rod.className = 'rod';
    rod.dataset.rod = i;

    // Heaven section
    const heavenSection = document.createElement('div');
    heavenSection.className = 'heaven-section';
    const heavenBead = document.createElement('div');
    heavenBead.className = 'bead heaven';
    heavenBead.addEventListener('click', () => handleHeavenClick(i));
    heavenSection.appendChild(heavenBead);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'divider';

    // Earth section (bead 1 = index 0 = closest to divider = top of section)
    const earthSection = document.createElement('div');
    earthSection.className = 'earth-section';
    for (let n = 1; n <= 4; n++) {
      const earthBead = document.createElement('div');
      earthBead.className = 'bead earth';
      earthBead.addEventListener('click', () => handleEarthClick(i, n));
      earthSection.appendChild(earthBead);
    }

    rod.appendChild(heavenSection);
    rod.appendChild(divider);
    rod.appendChild(earthSection);
    container.appendChild(rod);
  }
}

// --- Init ---

buildAbacus();
updateDisplay();
updateAuthUI();
document.getElementById('reset-btn').addEventListener('click', resetAll);
document.getElementById('save-btn').addEventListener('click', saveValue);
document.getElementById('login-btn').addEventListener('click', handleLogin);
document.getElementById('logout-btn').addEventListener('click', handleLogout);
