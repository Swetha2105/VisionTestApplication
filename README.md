# VisionAI 2.0 — Comprehensive Eye Screening System

## 🚀 Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 App Flow

```
Splash (3s) → Language Selection → Login / Register → Dashboard → Tests → Report
```

---

## 👥 Roles

### New User
Registers with personal details and selects age group. Gets age-appropriate testing interface.

### Social Worker / Health Worker
Manages a list of patients. Can add patients with full details and start tests on their behalf. Camp mode entry supported.

---

## 👶👦🧑👴 Age Groups & Dashboards

| Group | Range | UI Mode | Features |
|-------|-------|---------|----------|
| Kids | 1–15 yrs | 🎮 Gamified | Dr. Blinky guide, stars, confetti, balloons, Tumbling E, bouncy animations |
| Young Adult | 16–35 yrs | 📱 Modern | Full clinical cards, progress tracking |
| Adult | 36–60 yrs | 🏥 Clear | Guided clear layout, progress bar |
| Senior | 61+ yrs | 🤝 Elder | Large text 1.35×, voice-assisted, big buttons, simple language |

---

## 🔊 Sound Effects

| Action | Sound |
|--------|-------|
| Left eye button tap | Low tone (523 Hz) |
| Right eye button tap | Mid tone (659 Hz) |
| Color plate answered | Soft click (784 Hz) |
| Correct answer | Success chime (880 Hz) |
| Test complete | Fanfare arpeggio |
| Navigation | Normal click (440 Hz) |

---

## 🌐 Languages

- 🇺🇸 English
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Hindi (हिंदी)

Voice guidance via Web Speech API in all three languages.

---

## 🔬 Tests

### Visual Acuity
- **Snellen Chart** — 9-line standard letter chart
- **Tumbling E** — Direction arrows (especially for kids)
- **Camera eye detection** via WebRTC
- Separate left/right eye testing
- Distance calibration guidance

### Color Blindness
- **10 Ishihara-style plates** — Algorithmically generated using canvas
- Detect: Protanopia, Deuteranopia, Tritanopia
- Number pad input + "Cannot see" option
- Per-plate progress dots

---

## 📊 AI Report
- Visual Acuity: Snellen score, disorder classification, severity
- Color Vision: Score, accuracy bar, deficiency type
- AI health suggestions (5 tips)
- Specialist referral recommendation
- PDF save (requires jsPDF — see below)
- Report ID + date + patient details

---

## 🎮 Kids Mode Extras
- **Dr. Blinky** animated character guide
- **Stars system** — earn stars for correct answers
- **Level progression** — Explorer → Rookie → Super Looker → Eagle Eyes → Vision Champion
- **Confetti** explosion on completion
- **Balloons** rising animation
- **Nunito font** — round, child-friendly typography
- **Bouncy / floating animations** throughout
- **Positive-only feedback** — no negative messages for wrong answers

---

## 👷 Social Worker Dashboard
- Add patients with full details (name, age, gender, contact, location, camp location)
- Age-group selection per patient
- Auto-generated Patient ID (PAT-XXXXXXX)
- Patient list with search and age filter
- Distribution statistics per age group
- Start tests directly from patient card

---

## 📦 Project Structure

```
src/
├── App.jsx                            # Main router
├── index.js
├── styles.css                         # Global animations
├── assets/
│   └── snellenImages.js              # Base64 Snellen chart images
├── data/
│   └── constants.js                  # All config, data, classifications
├── hooks/
│   ├── useTimer.js
│   └── useOnline.js
├── utils/
│   └── helpers.js                    # Auth, storage, voice, sound
└── components/
    ├── auth/
    │   ├── SplashScreen.jsx
    │   ├── LanguageScreen.jsx
    │   └── LoginRegisterScreen.jsx
    ├── dashboard/
    │   └── TopBar.jsx
    ├── game/
    │   ├── DrBlinky.jsx
    │   └── KidsHeader.jsx
    ├── social/
    │   └── SocialWorkerDashboard.jsx
    ├── screens/
    │   ├── HomeDashboard.jsx         # Age-adaptive dashboard
    │   ├── VATestScreen.jsx          # Visual acuity test
    │   ├── ColorTestScreen.jsx       # Ishihara color test
    │   ├── ReportScreen.jsx          # AI report
    │   └── IshiharaCanvas.jsx        # Canvas-generated plates
    └── ui/
        ├── Btn.jsx
        ├── Card.jsx
        ├── Modal.jsx
        ├── Badge.jsx
        ├── ProgressBar.jsx
        ├── Spinner.jsx
        ├── Confetti.jsx              # Confetti + balloons
        ├── Stars.jsx
        └── PhotoBanner.jsx
```

---

## ➕ Add PDF Export

```bash
npm install jspdf jspdf-autotable
```

In `ReportScreen.jsx`:
```js
import jsPDF from 'jspdf';
const doc = new jsPDF();
doc.text('VisionAI Report', 14, 22);
doc.save(`VisionReport-${reportId}.pdf`);
```

---

## ➕ Use Your Own Ishihara Dataset

Place your images in `public/plates/` and update `src/data/constants.js`:

```js
export const ISHIHARA_PLATES = [
  { id: 1, number: '12', imageSrc: '/plates/plate1.png', type: 'normal' },
  ...
];
```

Then in `ColorTestScreen.jsx`, replace `<IshiharaCanvas>` with `<img src={plate.imageSrc} />`.

---

## 🔒 Security & Offline
- localStorage-based storage (encrypted in production)
- Session persists across refreshes
- Works fully offline after first load
- Automatic data sync when back online

---

## 🏥 Tech Stack
- React 18 · Web Speech API · MediaDevices API · Canvas API · Web Audio API
