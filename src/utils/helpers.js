import { STORAGE, VOICE_TEXT, AGE_GROUPS as _AGE_GROUPS } from '../data/constants';

// ── VOICE / SPEECH ─────────────────────────────────────
let currentUtterance = null;

export function speak(textKey, lang = 'en', custom = null) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const text = custom || VOICE_TEXT[lang]?.[textKey] || VOICE_TEXT.en[textKey] || '';
  if (!text) return;
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
  utt.rate = 0.86;
  utt.pitch = 1.0;
  currentUtterance = utt;
  window.speechSynthesis.speak(utt);
}

export function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// ── SOUND EFFECTS ──────────────────────────────────────
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return audioCtx;
}

export function playClick(type = 'normal') {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const configs = {
      normal:     { freq: 440,  type: 'sine',     duration: 0.08, vol: 0.12 },
      success:    { freq: 880,  type: 'sine',     duration: 0.22, vol: 0.15 },
      error:      { freq: 220,  type: 'sawtooth', duration: 0.18, vol: 0.1  },
      leftEye:    { freq: 523,  type: 'sine',     duration: 0.15, vol: 0.14 },
      rightEye:   { freq: 659,  type: 'sine',     duration: 0.15, vol: 0.14 },
      colorClick: { freq: 784,  type: 'sine',     duration: 0.12, vol: 0.12 },
      star:       { freq: 1047, type: 'sine',     duration: 0.3,  vol: 0.18 },
      fanfare:    { freq: 1047, type: 'sine',     duration: 0.6,  vol: 0.2  },
      kids:       { freq: 698,  type: 'sine',     duration: 0.18, vol: 0.16 },
    };

    const cfg = configs[type] || configs.normal;
    osc.frequency.value = cfg.freq;
    osc.type = cfg.type;
    gain.gain.setValueAtTime(cfg.vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.duration);

    if (type === 'fanfare') {
      // Play a quick ascending arpeggio
      const freqs = [523, 659, 784, 1047];
      freqs.forEach((f, i) => {
        setTimeout(() => {
          try {
            const o2 = ctx.createOscillator();
            const g2 = ctx.createGain();
            o2.connect(g2); g2.connect(ctx.destination);
            o2.frequency.value = f;
            o2.type = 'sine';
            g2.gain.setValueAtTime(0.18, ctx.currentTime);
            g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            o2.start(); o2.stop(ctx.currentTime + 0.3);
          } catch {}
        }, i * 100);
      });
      return;
    }

    osc.start();
    osc.stop(ctx.currentTime + cfg.duration);
  } catch {}
}

// ── LOCAL STORAGE ──────────────────────────────────────
export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch { return false; }
}

export function loadData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

// ── AUTH ────────────────────────────────────────────────
export function getUsers() {
  return loadData(STORAGE.users, []);
}

export function registerUser(user) {
  const users = getUsers();
  const existing = users.find(u => u.email === user.email);
  if (existing) return { ok: false, error: 'Email already registered' };
  const newUser = {
    ...user,
    id: 'USR-' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  saveData(STORAGE.users, [...users, newUser]);
  return { ok: true, user: newUser };
}

export function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password' };
  saveData(STORAGE.session, user);
  return { ok: true, user };
}

export function getSession() {
  return loadData(STORAGE.session, null);
}

export function logout() {
  localStorage.removeItem(STORAGE.session);
}

// ── PATIENTS (per Social Worker) ──────────────────────
// Each worker gets their own isolated patient list keyed by their userId.
function workerPatientsKey(workerId) {
  return `${STORAGE.patients}_${workerId}`;
}
function workerReportsKey(workerId) {
  return `${STORAGE.reports}_${workerId}`;
}

export function getPatients(workerId = 'global') {
  return loadData(workerPatientsKey(workerId), []);
}

export function addPatient(patient, workerId = 'global') {
  const patients = getPatients(workerId);
  const newPatient = {
    ...patient,
    workerId,
    patientId: 'PAT-' + Math.random().toString(36).slice(2, 9).toUpperCase(),
    createdAt: new Date().toISOString(),
    reports: [],
  };
  saveData(workerPatientsKey(workerId), [...patients, newPatient]);
  return newPatient;
}

// ── REPORTS (per Social Worker) ───────────────────────
export function saveReport(report, workerId = 'global') {
  const key = workerReportsKey(workerId);
  const reports = loadData(key, []);
  const newReport = {
    ...report,
    workerId,
    reportId: 'RPT-' + Math.random().toString(36).slice(2, 9).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  saveData(key, [...reports, newReport]);
  return newReport;
}

export function getReports(workerId = 'global') {
  return loadData(workerReportsKey(workerId), []);
}

// ── UTILS ───────────────────────────────────────────────
export function fmtTime(sec) {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}

export function fmtDate(iso = new Date().toISOString()) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function getAgeGroup(age) {
  return _AGE_GROUPS.find(g => age >= g.min && age <= g.max) || _AGE_GROUPS[1];
}

export function generatePatientId() {
  return 'PAT-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ── lighten hex ──────────────────────────────────────────
export function lightenHex(hex, amount = 20) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (n >> 16) + amount);
  const g = Math.min(255, ((n >> 8) & 0xff) + amount);
  const b = Math.min(255, (n & 0xff) + amount);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}
