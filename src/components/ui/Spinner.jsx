import { C } from '../../data/constants';

export function Spinner({ size = 24, color = C.blue }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid ${color}30`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      display: 'inline-block',
    }} />
  );
}
