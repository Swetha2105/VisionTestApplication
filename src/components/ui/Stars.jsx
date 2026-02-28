export function Stars({ count = 0, max = 5, size = 28 }) {
  return (
    <div style={{ display:'flex', gap:4 }}>
      {[...Array(max)].map((_,i) => (
        <div key={i} style={{
          fontSize: size,
          animation: i < count ? `starPop 0.5s ease ${i*0.12}s both` : 'none',
          filter: i < count ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
          opacity: i < count ? 1 : 0.2,
        }}>
          {i < count ? '⭐' : '☆'}
        </div>
      ))}
    </div>
  );
}
