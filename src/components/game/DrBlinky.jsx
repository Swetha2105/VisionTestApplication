import { C, IMG } from '../../data/constants';

export function DrBlinky({ message, celebrate = false, typing = false }) {
  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:12,
      background:'linear-gradient(135deg,#F5F3FF,#EDE9FE)',
      borderRadius:18,
      padding:16,
      marginBottom:18,
      border:'2px solid #DDD6FE',
      animation:'slideIn 0.4s ease both',
    }}>
      <img
        src={celebrate ? IMG.celebration : IMG.kidsTest}
        alt="Dr. Blinky"
        style={{
          width:58, height:58,
          borderRadius:'50%',
          objectFit:'cover',
          border:`3px solid ${C.kidsColor}`,
          flexShrink:0,
          animation: celebrate ? 'bounce 0.8s ease-in-out infinite' : 'float 3s ease-in-out infinite',
        }}
      />
      <div style={{
        background:'#fff',
        borderRadius:14,
        borderTopLeftRadius:2,
        padding:'12px 16px',
        flex:1,
        fontSize:14,
        color:'#4C1D95',
        fontWeight:600,
        lineHeight:1.65,
        boxShadow:'0 2px 10px rgba(0,0,0,0.08)',
        fontFamily:"'Nunito', sans-serif",
        position:'relative',
      }}>
        {/* Speech bubble tail */}
        <div style={{
          position:'absolute', left:-8, top:14,
          width:0, height:0,
          borderTop:'8px solid transparent',
          borderBottom:'8px solid transparent',
          borderRight:'10px solid #fff',
        }} />
        {message}
        {typing && <span style={{ animation:'blink 0.8s ease infinite' }}>|</span>}
      </div>
    </div>
  );
}
