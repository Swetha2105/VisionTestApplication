import { C } from '../../data/constants';

export function Modal({ children, onClose, maxWidth = 700 }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(13,27,42,0.72)',
        backdropFilter: 'blur(6px)',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div style={{ width: '100%', maxWidth, animation: 'zoomIn 0.35s ease both' }}>
        {children}
      </div>
    </div>
  );
}
