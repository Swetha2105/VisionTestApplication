import { C, LANGUAGES, IMG } from '../../data/constants';

// Eye-themed background images for language screen
const EYE_IMAGES = [
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1400&q=80', // close-up eye
  'https://images.unsplash.com/photo-1559041881-74dd6c9fb9f4?w=1400&q=80',  // eye lashes
  'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=1400&q=80', // eye exam
];

export function LanguageScreen({ onSelect }) {
  // No speak() call — voice removed for language selection screen
  const handleSelect = (lang) => {
    onSelect(lang);
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
      overflow: 'hidden',
    }}>
      {/* Full-screen eye background */}
      <img
        src={EYE_IMAGES[0]}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.18) saturate(1.4)',
          zIndex: 0,
        }}
      />
      {/* Deep gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(145deg, rgba(13,27,42,0.92), rgba(17,34,64,0.88))',
        zIndex: 1,
      }} />

      <div style={{ maxWidth: 420, width: '100%', animation: 'fadeUp 0.5s ease both', position: 'relative', zIndex: 2 }}>
        {/* Logo & heading */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%', overflow: 'hidden',
            margin: '0 auto 18px', border: `3px solid ${C.blue}`,
            boxShadow: `0 0 32px ${C.blue}55`,
            animation: 'heartbeat 2.5s ease-in-out infinite',
          }}>
            <img src={IMG.eyeClose} alt="VisionAI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 30, fontWeight: 700, color: '#fff', marginBottom: 8,
            textShadow: `0 0 24px ${C.blue}66`,
          }}>
            Choose Language
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>
            மொழி தேர்ந்தெடுக்கவும் · भाषा चुनें
          </div>
        </div>

        {/* Language cards */}
        <div style={{ display: 'grid', gap: 12 }}>
          {LANGUAGES.map((lang, i) => (
            <div
              key={lang.code}
              className="card-hover"
              onClick={() => handleSelect(lang)}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.13)',
                borderRadius: 18,
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', gap: 18,
                animation: 'slideIn 0.4s ease both',
                animationDelay: `${i * 0.12}s`,
                backdropFilter: 'blur(14px)',
                cursor: 'pointer',
                transition: 'background 0.2s, border 0.2s, transform 0.2s',
              }}
            >
              <span style={{ fontSize: 38, lineHeight: 1 }}>{lang.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{lang.name}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{lang.nativeName}</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)', fontSize: 16,
                background: 'rgba(255,255,255,0.05)',
              }}>
                →
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          🔒 Secure · Offline Ready · AI Powered
        </div>
      </div>
    </div>
  );
}
