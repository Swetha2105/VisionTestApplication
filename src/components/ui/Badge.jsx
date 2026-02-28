// Badge.jsx
import { C } from '../../data/constants';

export function Badge({ label, color = C.blue, style: ext = {} }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 12px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: `${color}18`,
      color,
      letterSpacing: 0.3,
      ...ext,
    }}>
      {label}
    </span>
  );
}
