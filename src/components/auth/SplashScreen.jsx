import { useEffect, useState } from 'react';
import { C, IMG, EYE_BACKGROUNDS } from '../../data/constants';

// Cycle through different eye macro shots in the background
const SPLASH_EYES = [
  'https://images.unsplash.com/photo-1559041881-74dd6c9fb9f4?w=1400&q=80',
  'https://images.unsplash.com/photo-1564148454067-ac4c6e8ad0e3?w=1400&q=80',
  'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?w=1400&q=80',
];

export function SplashScreen({ onDone }) {
  const [bgIdx, setBgIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    const cycle = setInterval(() => setBgIdx(i => (i + 1) % SPLASH_EYES.length), 1100);
    return () => { clearTimeout(t); clearInterval(cycle); };
  }, [onDone]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      background: '#050d1a',
    }}>
      {/* Cycling eye macro backgrounds with crossfade */}
      {SPLASH_EYES.map((src, i) => (
        <img
          key={src}
          src={src}
          crossOrigin="anonymous"
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.18) saturate(1.6)',
            opacity: i === bgIdx ? 1 : 0,
            transition: 'opacity 1s ease',
            zIndex: 0,
          }}
        />
      ))}

      {/* Deep overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(145deg,rgba(5,13,26,0.85) 0%,rgba(17,34,64,0.75) 100%)',
        zIndex: 1,
      }} />

      {/* Ambient pulse rings */}
      {[...Array(4)].map((_,i) => (
        <div key={i} style={{
          position: 'absolute', zIndex: 1,
          width: 280 + i * 130, height: 280 + i * 130,
          border: `1px solid rgba(44,123,229,${0.07 - i * 0.012})`,
          borderRadius: '50%',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          animation: `pulse ${3 + i}s ease-in-out infinite`,
        }} />
      ))}

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', animation: 'fadeUp 0.8s ease' }}>
        {/* Animated eye logo */}
        <div style={{
          width: 110, height: 110, borderRadius: '50%', overflow: 'hidden',
          margin: '0 auto 24px',
          border: '3px solid rgba(44,123,229,0.6)',
          boxShadow: '0 0 50px rgba(44,123,229,0.4), 0 0 100px rgba(44,123,229,0.15)',
          animation: 'heartbeat 2.5s ease-in-out infinite',
        }}>
          <img src={IMG.eyeClose} alt="VisionAI" crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 48, fontWeight: 700, color: '#fff',
          letterSpacing: 2, marginBottom: 8,
          textShadow: '0 0 40px rgba(44,123,229,0.5)',
        }}>
          VisionAI
        </div>

        <div style={{
          fontSize: 12, letterSpacing: 5,
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', marginBottom: 40,
        }}>
          Smart Eye Screening System
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 36 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: C.blue,
              animation: `blink 1.2s ease-in-out ${i * 0.3}s infinite`,
            }} />
          ))}
        </div>

        {/* Feature tags */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['AI-Powered', 'Multilingual', 'Offline Ready', 'HIPAA Compliant'].map(tag => (
            <div key={tag} style={{
              padding: '5px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, fontSize: 11,
              color: 'rgba(255,255,255,0.35)', fontWeight: 500,
            }}>
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 24, zIndex: 2,
        fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: 1,
      }}>
        Powered by AI Vision Technology
      </div>
    </div>
  );
}
