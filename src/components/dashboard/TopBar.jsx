import { C, IMG, AGE_GROUPS } from '../../data/constants';
import { logout, playClick } from '../../utils/helpers';


export function TopBar({ user, screen, onHome, onBack, showBack }) {
  const ageGroup = AGE_GROUPS.find(g => g.id === user?.ageGroup);
  const isKids = ageGroup?.mode === 'game';
  const isElder = ageGroup?.mode === 'elder';

  const handleLogout = () => {
    playClick('normal');
    logout();
    window.location.reload();
  };

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      height: isElder ? 70 : 58,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: `0 ${isElder ? 20 : 14}px`,
      background: isKids
        ? 'linear-gradient(135deg,#5B21B6,#3730A3)'
        : 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${isKids ? 'rgba(255,255,255,0.1)' : C.border}`,
      boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
    }}>
      {/* Left: Logo + user */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {showBack && (
          <button onClick={onBack} className="btn" style={{
            background:'transparent',
            border:`1.5px solid ${isKids ? 'rgba(255,255,255,0.25)' : C.border}`,
            color: isKids ? '#fff' : C.muted,
            borderRadius:10, padding:'6px 14px', fontSize:13, fontWeight:600,
          }}>
            ← Back
          </button>
        )}

        <img
          src={IMG.eyeClose}
          alt=""
          style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', animation:'heartbeat 3s ease-in-out infinite' }}
        />
        <div>
          <div style={{
            fontFamily: isKids ? "'Nunito',sans-serif" : "'Playfair Display',serif",
            fontWeight:800, fontSize: isElder ? 20 : 17,
            color: isKids ? '#fff' : C.dark,
          }}>
            VisionAI
          </div>
          {user && (
            <div style={{ fontSize: isElder ? 13 : 11, color: isKids ? 'rgba(255,255,255,0.55)' : C.muted }}>
              {user.name}
            </div>
          )}
        </div>

        {ageGroup && (
          <div style={{
            padding:'3px 12px',
            background: isKids ? 'rgba(255,255,255,0.15)' : `${ageGroup.color}14`,
            borderRadius:20,
            border:`1px solid ${isKids ? 'rgba(255,255,255,0.2)' : `${ageGroup.color}30`}`,
            fontSize: isElder ? 13 : 11,
            color: isKids ? '#fff' : ageGroup.color,
            fontWeight:700,
          }}>
            {ageGroup.icon} {ageGroup.range}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {!['home'].includes(screen) && onHome && (
          <button onClick={() => { playClick('normal'); onHome(); }} className="btn" style={{
            background:'transparent',
            border:`1.5px solid ${isKids ? 'rgba(255,255,255,0.25)' : C.border}`,
            color: isKids ? 'rgba(255,255,255,0.7)' : C.muted,
            borderRadius:10, padding:'6px 14px', fontSize: isElder ? 14 : 12, fontWeight:600,
          }}>
            🏠 Home
          </button>
        )}
        <button onClick={handleLogout} className="btn" style={{
          background:'transparent',
          border:`1.5px solid ${isKids ? 'rgba(255,255,255,0.2)' : C.border}`,
          color: isKids ? 'rgba(255,255,255,0.5)' : C.muted,
          borderRadius:10, padding:'6px 14px', fontSize: isElder ? 14 : 12, fontWeight:600,
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}
