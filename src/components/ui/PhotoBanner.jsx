export function PhotoBanner({ src, height = 130, brightness = 0.35, overlay = 'rgba(13,27,42,0.5)', children }) {
  return (
    <div style={{ position:'relative', height, overflow:'hidden', borderRadius:'inherit' }}>
      <img
        src={src}
        alt=""
        style={{ width:'100%', height:'100%', objectFit:'cover', filter:`brightness(${brightness})` }}
      />
      {overlay && (
        <div style={{ position:'absolute', inset:0, background: overlay }} />
      )}
      <div style={{ position:'absolute', inset:0, padding:'0 24px', display:'flex', alignItems:'center' }}>
        {children}
      </div>
    </div>
  );
}
