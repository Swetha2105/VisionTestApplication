import { C } from '../../data/constants';

export function ProgressBar({ value, max = 100, color = C.blue, label, height = 8, animated = true }) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: 12, color, fontWeight: 700 }}>{pct}%</span>
        </div>
      )}
      <div style={{ height, background: '#E8EDF2', borderRadius: height / 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: height / 2,
          animation: animated ? 'progressFill 0.9s ease' : 'none',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}
