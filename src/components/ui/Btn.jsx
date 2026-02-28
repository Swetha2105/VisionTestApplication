import { C } from '../../data/constants';

export function Btn({ children, onClick, color = C.primary, size = 'md', full = false, disabled = false, style: ext = {}, className = '' }) {
  const s = size === 'lg' ? { padding: '16px 36px', fontSize: 17, borderRadius: 16 }
          : size === 'sm' ? { padding: '8px 18px',  fontSize: 13, borderRadius: 10 }
          :                 { padding: '12px 26px', fontSize: 14, borderRadius: 12 };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${className}`}
      style={{
        ...s,
        background: disabled ? '#ccc' : color,
        color: '#fff',
        fontWeight: 700,
        width: full ? '100%' : 'auto',
        boxShadow: disabled ? 'none' : `0 4px 16px ${color}44`,
        letterSpacing: 0.3,
        ...ext,
      }}
    >
      {children}
    </button>
  );
}

export function OutlineBtn({ children, onClick, color = C.mid, style: ext = {}, full = false, size = 'md' }) {
  const s = size === 'lg' ? { padding: '14px 32px', fontSize: 16 }
          : size === 'sm' ? { padding: '7px 16px',  fontSize: 12 }
          :                 { padding: '10px 22px', fontSize: 14 };
  return (
    <button
      onClick={onClick}
      className="btn"
      style={{
        ...s,
        background: 'transparent',
        color,
        border: `2px solid ${color}55`,
        borderRadius: 12,
        fontWeight: 600,
        width: full ? '100%' : 'auto',
        ...ext,
      }}
    >
      {children}
    </button>
  );
}

export function GlassBtn({ children, onClick, style: ext = {} }) {
  return (
    <button
      onClick={onClick}
      className="btn"
      style={{
        padding: '10px 22px',
        background: 'rgba(255,255,255,0.14)',
        color: '#fff',
        border: '1.5px solid rgba(255,255,255,0.28)',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        backdropFilter: 'blur(8px)',
        ...ext,
      }}
    >
      {children}
    </button>
  );
}
