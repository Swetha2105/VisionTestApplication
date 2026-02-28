const COLS = ['#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EF4444','#06B6D4','#FBBF24'];

export function Confetti({ count = 50 }) {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999, overflow:'hidden' }}>
      {[...Array(count)].map((_,i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${Math.random()*100}%`,
          top: -18,
          width: 10,
          height: Math.random() > 0.5 ? 10 : 16,
          borderRadius: Math.random() > 0.5 ? '50%' : 2,
          background: COLS[i % COLS.length],
          animation: `confettiFall ${2 + Math.random()*2.5}s ease-in both`,
          animationDelay: `${Math.random()*1.8}s`,
          transform: `rotate(${Math.random()*360}deg)`,
        }} />
      ))}
    </div>
  );
}

export function Balloons({ count = 6 }) {
  const BCOLS = ['#FF6B9D','#FFD93D','#6BCB77','#4D96FF','#C77DFF','#FF6B6B'];
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9998, overflow:'hidden' }}>
      {[...Array(count)].map((_,i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${10 + i * 15}%`,
          bottom: -60,
          animation: `balloonRise ${3 + Math.random()}s ease-out both`,
          animationDelay: `${i * 0.35}s`,
        }}>
          <div style={{
            width: 44, height: 54,
            background: `radial-gradient(circle at 35% 35%, ${BCOLS[i % BCOLS.length]}cc, ${BCOLS[i % BCOLS.length]})`,
            borderRadius: '50% 50% 50% 50% / 50% 50% 60% 60%',
            position: 'relative',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          }}>
            <div style={{
              position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
              width: 1, height: 20, background: '#666',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
