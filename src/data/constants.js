/* ═══════════════════════════════════════════════════
   VisionAI 2.0 — App Constants
═══════════════════════════════════════════════════ */

// ── DESIGN TOKENS ────────────────────────────────────
export const C = {
  primary:   '#1B4F8A',
  blue:      '#2C7BE5',
  teal:      '#0E7490',
  purple:    '#7C3AED',
  violet:    '#6D28D9',
  pink:      '#EC4899',
  green:     '#12B76A',
  amber:     '#F59E0B',
  orange:    '#F97316',
  red:       '#EF4444',
  dark:      '#0D1B2A',
  mid:       '#344054',
  muted:     '#667085',
  border:    '#D0D5DD',
  surface:   '#FFFFFF',
  bg:        '#F0F4F8',
  bgDeep:    '#E4EBF5',
  // Age-group colours
  kidsColor:   '#7C3AED',
  youngColor:  '#2C7BE5',
  adultColor:  '#0E7490',
  elderColor:  '#D97706',
};

// ── IMAGES (Unsplash CDN) ─────────────────────────────
export const IMG = {
  splash:       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',
  eyeClose:     'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80',
  hospital:     'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  eyeExam:      'https://images.unsplash.com/photo-1616694495058-6e46a7d54b27?w=600&q=80',
  colorVision:  'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=600&q=80',
  reportBg:     'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  dashBg:       'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80',
  kidsBg:       'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&q=80',
  kidsTest:     'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
  youngBg:      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  adultBg:      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
  elderBg:      'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=600&q=80',
  socialWorker: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
  doctor:       'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  nurse:        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  patient:      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80',
  camp:         'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&q=80',
  eyeTest:      'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=600&q=80',
  celebration:  'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80',

  // ── Eye-specific imagery library ──────────────────────
  eyeMacro1:    'https://images.unsplash.com/photo-1559041881-74dd6c9fb9f4?w=800&q=80',   // extreme close macro eye
  eyeMacro2:    'https://images.unsplash.com/photo-1564148454067-ac4c6e8ad0e3?w=800&q=80', // blue iris close-up
  eyeMacro3:    'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?w=800&q=80',   // brown iris
  eyeDoctor:    'https://images.unsplash.com/photo-1588776814546-1ffbb042d2ce?w=700&q=80', // doctor with ophthalmoscope
  eyeScope:     'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=700&q=80', // slit lamp / eye microscope
  eyeChart:     'https://images.unsplash.com/photo-1612776571049-95671f59f5e9?w=700&q=80', // optometrist eye chart board
  retina:       'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=700&q=80', // retina scan abstract
  colorblind:   'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=700&q=80', // colorful dots
  glasses:      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=700&q=80', // glasses on book
  eyeDrops:     'https://images.unsplash.com/photo-1626697556750-f281e0fb8a6e?w=700&q=80', // eye drops
  optometry:    'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=700&q=80', // phoropter
  childEyes:    'https://images.unsplash.com/photo-1591035897819-f4bdf739f446?w=700&q=80', // child beautiful eyes
  elderEyes:    'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=700&q=80',   // senior kind eyes
  iris1:        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=700&q=80', // green iris
  iris2:        'https://images.unsplash.com/photo-1498901728089-fd1e898cf4e2?w=700&q=80', // hazel iris
  fundus:       'https://images.unsplash.com/photo-1612776571049-95671f59f5e9?w=700&q=80', // fundus-like
  snellenWall:  'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=700&q=80', // wall eye chart

  // Languages
  flagIN: '🇮🇳', flagUS: '🇺🇸', flagFR: '🇫🇷',
};

// ── Eye background images used throughout the app ─────
export const EYE_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=75',
  'https://images.unsplash.com/photo-1559041881-74dd6c9fb9f4?w=1200&q=75',
  'https://images.unsplash.com/photo-1564148454067-ac4c6e8ad0e3?w=1200&q=75',
  'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?w=1200&q=75',
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=75',
  'https://images.unsplash.com/photo-1588776814546-1ffbb042d2ce?w=1200&q=75',
  'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=1200&q=75',
  'https://images.unsplash.com/photo-1612776571049-95671f59f5e9?w=1200&q=75',
];

// ── LANGUAGES ─────────────────────────────────────────
export const LANGUAGES = [
  { code: 'en', name: 'English',  nativeName: 'English',  flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'ta', name: 'Tamil',    nativeName: 'தமிழ்',    flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'hi', name: 'Hindi',    nativeName: 'हिंदी',    flag: '🇮🇳', speechCode: 'hi-IN' },
];

// ── AGE GROUPS ─────────────────────────────────────────
export const AGE_GROUPS = [
  {
    id: 'kids',
    label: 'Kids',
    range: '1 – 15 years',
    min: 1, max: 15,
    icon: '🎮',
    color: C.kidsColor,
    bg: 'linear-gradient(135deg,#6D28D9 0%,#4338CA 100%)',
    description: 'Fun gamified eye adventure!',
    img: IMG.kidsTest,
    mode: 'game',
  },
  {
    id: 'young',
    label: 'Young Adult',
    range: '16 – 35 years',
    min: 16, max: 35,
    icon: '👤',
    color: C.youngColor,
    bg: 'linear-gradient(135deg,#2C7BE5 0%,#1B4F8A 100%)',
    description: 'Modern clinical vision testing',
    img: IMG.youngBg,
    mode: 'standard',
  },
  {
    id: 'adult',
    label: 'Adult',
    range: '36 – 60 years',
    min: 36, max: 60,
    icon: '🏥',
    color: C.adultColor,
    bg: 'linear-gradient(135deg,#0E7490 0%,#065A82 100%)',
    description: 'Clear, guided screening',
    img: IMG.adultBg,
    mode: 'clear',
  },
  {
    id: 'elder',
    label: 'Senior',
    range: '61 and above',
    min: 61, max: 120,
    icon: '🤝',
    color: C.elderColor,
    bg: 'linear-gradient(135deg,#D97706 0%,#B45309 100%)',
    description: 'Large text, voice-assisted, easy to use',
    img: IMG.elderBg,
    mode: 'elder',
  },
];

// ── SNELLEN CHART ──────────────────────────────────────
export const SNELLEN_LINES = [
  { line: 1, acuity: '20/200', letters: ['E'],                              sizePx: 72, sizeRem: 4.5 },
  { line: 2, acuity: '20/100', letters: ['F', 'P'],                         sizePx: 60, sizeRem: 3.75 },
  { line: 3, acuity: '20/70',  letters: ['T', 'O', 'Z'],                    sizePx: 48, sizeRem: 3.0 },
  { line: 4, acuity: '20/50',  letters: ['L', 'P', 'E', 'D'],               sizePx: 38, sizeRem: 2.4 },
  { line: 5, acuity: '20/40',  letters: ['P', 'E', 'C', 'F', 'D'],          sizePx: 30, sizeRem: 1.9 },
  { line: 6, acuity: '20/30',  letters: ['E', 'D', 'F', 'C', 'Z', 'P'],     sizePx: 24, sizeRem: 1.5 },
  { line: 7, acuity: '20/25',  letters: ['F', 'E', 'L', 'O', 'P', 'Z', 'D'], sizePx: 20, sizeRem: 1.25 },
  { line: 8, acuity: '20/20',  letters: ['D','E','F','P','O','T','E','C'],   sizePx: 16, sizeRem: 1.0 },
  { line: 9, acuity: '20/15',  letters: ['L','E','F','O','D','P','C','T'],   sizePx: 13, sizeRem: 0.8 },
];

// ── ISHIHARA COLOUR PALETTES ───────────────────────────
export const ISHIHARA_PALETTES = {
  normal:   { bg: ['#C4722A','#D4823A','#B46020','#CC7830','#DC8C40'], fg: ['#7A6030','#8A7040','#6A5020','#9A8050','#AA9060'] },
  redGreen: { bg: ['#5A8C5A','#6A9C6A','#4A7C4A','#7AAC7A','#3A6C3A'], fg: ['#C85A30','#D86A40','#B84A20','#E87A50','#A83A10'] },
  protan:   { bg: ['#8C8C50','#9C9C60','#7C7C40','#ACAC70','#6C6C30'], fg: ['#A04040','#B05050','#903030','#C06060','#802020'] },
  deutan:   { bg: ['#506878','#607888','#405868','#708898','#304858'], fg: ['#C08840','#D09850','#B07830','#E0A860','#A06820'] },
  tritan:   { bg: ['#8C5090','#9C60A0','#7C4080','#AC70B0','#6C3070'], fg: ['#50A050','#60B060','#408040','#70C070','#309030'] },
};

// ── ISHIHARA PLATES DATA (from real dataset) ──────────
// answer = what normal vision sees | colorBlindAnswer = what color-blind may see
// options = multiple-choice answers | kidsQuestion = fun phrasing for kids game
export const ISHIHARA_PLATES = [
  { id:1,  image:'/ishihara/plate_01.png', answer:'1', colorBlindAnswer:null, type:'normal',   hint:'A digit formed by coloured dots',                question:'What number do you see hidden in the dots?', options:['1','7','4','None'], kidsEmoji:'1️⃣', kidsQuestion:'🔢 Find the secret number in the dots!' },
  { id:2,  image:'/ishihara/plate_02.png', answer:'2', colorBlindAnswer:null, type:'redGreen', hint:'A digit camouflaged in red-green dots',            question:'Which number is hidden inside the circle?',  options:['2','5','8','None'], kidsEmoji:'2️⃣', kidsQuestion:'🌈 Can you spot the number hiding in the colours?' },
  { id:3,  image:'/ishihara/plate_03.png', answer:'3', colorBlindAnswer:'8', type:'protan',   hint:'Normal: 3 · Red-blind may see: 8',                question:'What number do you see in the plate?',       options:['3','8','6','None'], kidsEmoji:'3️⃣', kidsQuestion:'👀 Look carefully — what number is it?' },
  { id:4,  image:'/ishihara/plate_04.png', answer:'4', colorBlindAnswer:null, type:'deutan',  hint:'Number formed by lighter-coloured dots',           question:'Which digit is hidden in the pattern?',      options:['4','1','7','None'], kidsEmoji:'4️⃣', kidsQuestion:'🎨 Match the secret number from the colours!' },
  { id:5,  image:'/ishihara/plate_05.png', answer:'5', colorBlindAnswer:'2', type:'redGreen', hint:'Normal: 5 · Green-blind may see: 2',               question:'What number do you see in the dots?',        options:['5','2','9','None'], kidsEmoji:'5️⃣', kidsQuestion:'🔎 Peek through the dots — find the number!' },
  { id:6,  image:'/ishihara/plate_06.png', answer:'6', colorBlindAnswer:null, type:'protan',  hint:'A single digit among tangled dots',                question:'Which number is camouflaged here?',           options:['6','8','3','None'], kidsEmoji:'6️⃣', kidsQuestion:'🌟 Superstar challenge — spot the number!' },
  { id:7,  image:'/ishihara/plate_07.jpg', answer:'N', colorBlindAnswer:null, type:'redGreen', hint:'An uppercase letter hidden in the dots',          question:'Which letter do you see in the circle?',     options:['N','M','H','None'], kidsEmoji:'🔤', kidsQuestion:'🔤 Find the hidden letter in the dots!' },
  { id:8,  image:'/ishihara/plate_08.jpg', answer:'H', colorBlindAnswer:null, type:'deutan',  hint:'A capital letter formed by coloured dots',         question:'What letter is hidden in the pattern?',      options:['H','N','A','None'], kidsEmoji:'🔠', kidsQuestion:'🅰️ What letter is hiding in the rainbow dots?' },
  { id:9,  image:'/ishihara/plate_09.jpg', answer:'6', colorBlindAnswer:null, type:'normal',  hint:'A classic Ishihara digit plate',                   question:'Which number is hidden in the coloured dots?',options:['6','8','5','None'], kidsEmoji:'6️⃣', kidsQuestion:'🎯 Aim your eyes — what number do you see?' },
  { id:10, image:'/ishihara/plate_10.jpg', answer:'C', colorBlindAnswer:null, type:'tritan',  hint:'A curved letter hides among the dots',              question:'What letter can you see inside the plate?',  options:['C','O','G','None'], kidsEmoji:'🔤', kidsQuestion:'🏆 Final challenge — find the secret letter!' },
];

// ── VISUAL ACUITY CLASSIFICATION ──────────────────────
export function classifyVA(line) {
  if (!line) return { label: 'Not Tested',     severity: 'none',   color: '#aaa',    disorder: 'N/A',                         recommendation: 'Schedule a test',          specialist: 'Eye Care Professional' };
  if (line >= 8) return { label: 'Normal',      severity: 'normal', color: '#12B76A', disorder: 'Normal Vision',               recommendation: 'Annual eye checkup',        specialist: 'Primary Eye Care' };
  if (line >= 6) return { label: 'Near-Normal', severity: 'mild',   color: '#84CC16', disorder: 'Mild Refractive Error',        recommendation: 'Glasses or contact lenses',specialist: 'Optometrist' };
  if (line >= 4) return { label: 'Mild',        severity: 'mild',   color: '#F79009', disorder: 'Myopia / Hyperopia',           recommendation: 'Corrective prescription',   specialist: 'Ophthalmologist' };
  if (line >= 2) return { label: 'Moderate',    severity: 'moderate',color: '#F04438', disorder: 'Moderate Myopia / Astigmatism',recommendation: 'Urgent correction needed', specialist: 'Ophthalmologist' };
  return               { label: 'Severe',       severity: 'severe', color: '#9C0F0F', disorder: 'Severe Vision Impairment',     recommendation: 'Immediate specialist referral',specialist: 'Retinal Specialist' };
}

// ── COLOUR BLINDNESS CLASSIFICATION ───────────────────
export function classifyColor(errors) {
  if (errors === 0) return { type: 'Normal Trichromacy',  severity: 'normal',   color: '#12B76A' };
  if (errors <= 2)  return { type: 'Mild Deficiency',     severity: 'mild',     color: '#F79009' };
  if (errors <= 5)  return { type: 'Deuteranopia/Protanopia', severity: 'moderate', color: '#F04438' };
  return                   { type: 'Severe Dichromacy',   severity: 'severe',   color: '#9C0F0F' };
}

// ── VOICE TRANSLATIONS ─────────────────────────────────
export const VOICE_TEXT = {
  en: {
    welcome: 'Welcome to VisionAI. Your personal eye screening assistant.',
    selectLanguage: 'Please select your language.',
    register: 'Please fill in your details to register.',
    startVA: "Let's begin the visual acuity test. Hold the device at arm's length.",
    coverLeft: 'Please cover your left eye and read with your right eye.',
    coverRight: 'Now cover your right eye and read with your left eye.',
    colorStart: "Now let's test your color vision. Look at the plate and tell me what number you see.",
    excellent: 'Excellent! Well done!',
    complete: 'The test is complete. Thank you!',
    tapLowest: 'Tap the lowest line you can read clearly.',
  },
  ta: {
    welcome: 'விஷன் ஏஐக்கு வரவேற்கிறோம். உங்கள் கண் பரிசோதனை உதவியாளர்.',
    selectLanguage: 'உங்கள் மொழியை தேர்ந்தெடுக்கவும்.',
    register: 'பதிவு செய்ய உங்கள் விவரங்களை நிரப்பவும்.',
    startVA: 'கண் பரிசோதனை தொடங்குவோம். சாதனத்தை கை நீளத்தில் வைக்கவும்.',
    coverLeft: 'இடது கண்ணை மூடி வலது கண்ணால் பாருங்கள்.',
    coverRight: 'இப்போது வலது கண்ணை மூடி இடது கண்ணால் பாருங்கள்.',
    colorStart: 'இப்போது வண்ண பார்வையை சோதிப்போம்.',
    excellent: 'மிகவும் நல்லது!',
    complete: 'பரிசோதனை முடிந்தது. நன்றி!',
    tapLowest: 'நீங்கள் தெளிவாக படிக்கக்கூடிய கீழ்மட்ட வரியை தட்டவும்.',
  },
  hi: {
    welcome: 'विजनAI में आपका स्वागत है। आपका व्यक्तिगत आँख जाँच सहायक।',
    selectLanguage: 'कृपया अपनी भाषा चुनें।',
    register: 'पंजीकरण के लिए अपना विवरण भरें।',
    startVA: 'दृश्य तीक्ष्णता परीक्षण शुरू करते हैं। डिवाइस को बाँह की दूरी पर रखें।',
    coverLeft: 'बाईं आँख ढकें और दाईं आँख से पढ़ें।',
    coverRight: 'अब दाईं आँख ढकें और बाईं आँख से पढ़ें।',
    colorStart: 'अब रंग दृष्टि परीक्षण करते हैं।',
    excellent: 'बहुत अच्छे! शाबाश!',
    complete: 'परीक्षण पूरा हो गया। धन्यवाद!',
    tapLowest: 'जो सबसे नीचली पंक्ति आप स्पष्ट पढ़ सकते हैं उसे टैप करें।',
  },
};

// ── GAME CONTENT (Kids) ────────────────────────────────
export const GAME_LEVELS = [
  { level: 1, name: 'Eye Explorer',     stars: 0,   badge: '🔭', color: '#EC4899' },
  { level: 2, name: 'Vision Rookie',    stars: 5,   badge: '⭐', color: '#F59E0B' },
  { level: 3, name: 'Super Looker',     stars: 10,  badge: '🌟', color: '#10B981' },
  { level: 4, name: 'Eagle Eyes',       stars: 20,  badge: '🦅', color: '#6366F1' },
  { level: 5, name: 'Vision Champion!', stars: 35,  badge: '🏆', color: '#F97316' },
];

export const DR_BLINKY_MESSAGES = {
  welcome:     "Hi there! I'm Dr. Blinky! 👋 I'll help check your amazing eyes today! Ready for a fun adventure? 🚀",
  calibrate:   "Hold the phone like you're reading a book! Not too close, not too far! About this far! 📏",
  leftEye:     "Cover your RIGHT eye! 🫣 Now look with your LEFT eye! What letters can you see? Tap the smallest you can read! 👈",
  rightEye:    "Awesome job! Now cover your LEFT eye! 🫣 Use your RIGHT eye! You're doing GREAT! 👉",
  colorStart:  "Now for the RAINBOW CHALLENGE! 🌈 Look at the colourful circle and tell me what number you see! Ready? LET'S GO!",
  correct:     "AMAZING! You got it! ⭐",
  almostDone:  "You're almost there! Just a few more! You're SO brave! 💪",
  complete:    "WOW! You're a TRUE Vision Champion! 🏆 Your eyes are SUPER POWERFUL! CONGRATULATIONS! 🎉",
};

// ── SOCIAL WORKER CAMP ENTRY ───────────────────────────
export const CAMP_LOCATIONS = [
  'Primary Health Centre',
  'Village School',
  'Community Hall',
  'Mobile Camp Unit',
  'District Hospital',
  'Other',
];

// ── STORAGE KEYS ───────────────────────────────────────
export const STORAGE = {
  users:     'visionai_users',
  patients:  'visionai_patients',
  reports:   'visionai_reports',
  session:   'visionai_session',
};
