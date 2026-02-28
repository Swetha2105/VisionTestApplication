import { C } from '../../data/constants';

export function Card({ children, style: ext = {}, hover = false, padding = 20, onClick }) {
  return (
    <div
      onClick={onClick}
      className={hover ? 'card-hover' : ''}
      style={{
        background: C.surface,
        borderRadius: 18,
        padding,
        border: `1.5px solid ${C.border}`,
        boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
        ...ext,
      }}
    >
      {children}
    </div>
  );
}
