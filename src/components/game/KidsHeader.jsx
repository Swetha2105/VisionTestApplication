import { C } from '../../data/constants';
import { GAME_LEVELS } from '../../data/constants';
import { Stars } from '../ui/Stars';

export function KidsHeader({ stars = 0, screen = '' }) {
  const level = GAME_LEVELS.reduce((acc, l) => (stars >= l.stars ? l : acc), GAME_LEVELS[0]);
  const nextLevel = GAME_LEVELS[GAME_LEVELS.indexOf(level) + 1];
  const progress = nextLevel
    ? Math.round(((stars - level.stars) / (nextLevel.stars - level.stars)) * 100)
    : 100;

  return (
    <div style={{
      background: 'linear-gradient(135deg,#5B21B6,#3730A3)',
      borderRadius: 16,
      padding: '14px 18px',
      marginBottom: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(91,33,182,0.4)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ fontSize:34, animation:'wiggle 2s ease-in-out infinite' }}>{level.badge}</div>
        <div>
          <div style={{ color:'rgba(255,255,255,0.6)', fontSize:10, fontFamily:"'Nunito',sans-serif", fontWeight:700, letterSpacing:1 }}>
            LEVEL UP!
          </div>
          <div style={{ color:'#fff', fontWeight:800, fontSize:15, fontFamily:"'Nunito',sans-serif" }}>
            {level.name}
          </div>
          {/* Level progress bar */}
          <div style={{ width:100, height:5, background:'rgba(255,255,255,0.15)', borderRadius:3, marginTop:4, overflow:'hidden' }}>
            <div style={{ width:`${progress}%`, height:'100%', background:'#FFD700', borderRadius:3, transition:'width 0.6s ease' }} />
          </div>
        </div>
      </div>

      <div style={{ textAlign:'right' }}>
        <Stars count={Math.min(stars, 5)} size={20} />
        <div style={{ color:'rgba(255,255,255,0.5)', fontSize:10, marginTop:3, fontFamily:"'Nunito',sans-serif" }}>
          {stars} ⭐ total
        </div>
      </div>
    </div>
  );
}
