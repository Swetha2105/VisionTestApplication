import { C, IMG, AGE_GROUPS } from '../../data/constants';
import { playClick, speak } from '../../utils/helpers';
import { Btn } from '../ui/Btn';
import { KidsHeader } from '../game/KidsHeader';
import { DrBlinky } from '../game/DrBlinky';
import { ProgressBar } from '../ui/ProgressBar';

// ── Reusable: eye image card banner ──────────────────
function EyeImageBanner({ src, height = 120, title, subtitle, overlay = 'rgba(13,27,42,0.6)', color }) {
  return (
    <div style={{ position:'relative', height, overflow:'hidden', borderRadius:'inherit' }}>
      <img
        src={src} alt=""
        crossOrigin="anonymous"
        style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.35) saturate(1.3)' }}
        onError={e => { e.target.style.display='none'; }}
      />
      <div style={{ position:'absolute', inset:0, background: color ? `${color}cc` : overlay }} />
      <div style={{ position:'absolute', inset:0, padding:'0 20px', display:'flex', alignItems:'center' }}>
        <div>
          {subtitle && <div style={{ color:'rgba(255,255,255,0.55)', fontSize:11, fontWeight:700, letterSpacing:2, marginBottom:4 }}>{subtitle}</div>}
          {title && <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:'#fff', fontWeight:700 }}>{title}</div>}
        </div>
      </div>
    </div>
  );
}

// ── Test card with real eye image bg ─────────────────
function EyeTestCard({ title, sub, imgSrc, color, gradient, done, onClick, animDelay = 0 }) {
  return (
    <div
      onClick={onClick}
      className="card-hover"
      style={{
        borderRadius:18, overflow:'hidden', background:'#fff',
        boxShadow:'0 4px 18px rgba(0,0,0,0.1)',
        animation:`fadeUp 0.4s ease ${animDelay}s both`,
        cursor:'pointer',
      }}
    >
      <div style={{ height:150, position:'relative' }}>
        <img
          src={imgSrc} alt=""
          crossOrigin="anonymous"
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => { e.target.style.background = color; }}
        />
        <div style={{ position:'absolute', inset:0, background: gradient || `${color}dd` }} />
        <div style={{ position:'absolute', bottom:0, left:0, padding:'16px 20px', right:0 }}>
          <div style={{ fontSize:19, fontWeight:800, color:'#fff', fontFamily:"'Playfair Display',serif" }}>{title}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:3 }}>{sub}</div>
        </div>
        {done && (
          <div style={{
            position:'absolute', top:12, right:12,
            background:'rgba(18,183,106,0.92)', color:'#fff',
            borderRadius:20, padding:'3px 12px', fontSize:11, fontWeight:700,
          }}>
            ✓ Done
          </div>
        )}
      </div>
      <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:13, color: done ? C.green : C.muted, fontWeight:500 }}>
          {done ? 'Completed — retake?' : 'Not started'}
        </span>
        <Btn color={color} size="sm" onClick={() => {}}>
          {done ? 'Retake →' : 'Begin →'}
        </Btn>
      </div>
    </div>
  );
}

// ── KIDS DASHBOARD ────────────────────────────────────
function KidsDashboard({ user, stars, testsCompleted, onStartVA, onStartColor, onViewReport }) {
  return (
    <div style={{ padding:'16px', maxWidth:600, margin:'0 auto' }}>
      <KidsHeader stars={stars} />
      <DrBlinky message="Hi! I'm Dr. Blinky 👋 Let's check how SUPER your eyes are! Pick a test and start your adventure! 🚀✨" />

      <div style={{ display:'grid', gap:14 }}>
        {/* VA — kids card with real eye image */}
        <div
          onClick={() => { playClick('kids'); onStartVA(); }}
          className="card-hover"
          style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 8px 24px rgba(124,58,237,0.4)', animation:'fadeUp 0.4s ease 0.1s both', cursor:'pointer' }}
        >
          <div style={{ position:'relative', height:120 }}>
            <img src={IMG.childEyes} alt="" crossOrigin="anonymous"
              style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.3)' }}
              onError={e => { e.target.style.display='none'; }}
            />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(124,58,237,0.95),rgba(109,40,217,0.9))' }} />
            <div style={{ position:'absolute', inset:0, padding:'18px 20px', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ fontSize:48, animation:'bounce 2s ease-in-out infinite' }}>👁️</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:20, fontWeight:900, color:'#fff' }}>Eye Power Test! ⚡</div>
                <div style={{ color:'rgba(255,255,255,0.75)', fontSize:13, marginTop:3 }}>Read letters · Answer directions · Win stars!</div>
                {testsCompleted.va && <div style={{ color:'#FFD700', fontSize:12, fontWeight:700, marginTop:6 }}>✅ Completed! Play again?</div>}
              </div>
              <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'50%', width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>→</div>
            </div>
          </div>
        </div>

        {/* Color test card */}
        <div
          onClick={() => { playClick('kids'); onStartColor(); }}
          className="card-hover"
          style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 8px 24px rgba(236,72,153,0.4)', animation:'fadeUp 0.4s ease 0.18s both', cursor:'pointer' }}
        >
          <div style={{ position:'relative', height:120 }}>
            <img src={IMG.colorblind} alt="" crossOrigin="anonymous"
              style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.3)' }}
              onError={e => { e.target.style.display='none'; }}
            />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(236,72,153,0.95),rgba(190,24,93,0.9))' }} />
            <div style={{ position:'absolute', inset:0, padding:'18px 20px', display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ fontSize:48, animation:'float 3s ease-in-out infinite' }}>🌈</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:20, fontWeight:900, color:'#fff' }}>Rainbow Challenge! 🎨</div>
                <div style={{ color:'rgba(255,255,255,0.75)', fontSize:13, marginTop:3 }}>Find hidden numbers in colourful circles!</div>
                {testsCompleted.color && <div style={{ color:'#FFD700', fontSize:12, fontWeight:700, marginTop:6 }}>✅ Completed! Try again?</div>}
              </div>
              <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'50%', width:44, height:44, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>→</div>
            </div>
          </div>
        </div>

        {(testsCompleted.va || testsCompleted.color) && (
          <div
            onClick={() => { playClick('success'); onViewReport(); }}
            className="card-hover"
            style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 8px 24px rgba(245,158,11,0.35)', animation:'fadeUp 0.4s ease 0.26s both', cursor:'pointer' }}
          >
            <div style={{ position:'relative', height:90 }}>
              <img src={IMG.celebration} alt="" crossOrigin="anonymous"
                style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.3)' }}
                onError={e => { e.target.style.display='none'; }}
              />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(245,158,11,0.95),rgba(217,119,6,0.9))' }} />
              <div style={{ position:'absolute', inset:0, padding:'0 20px', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ fontSize:36 }}>🏆</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:18, fontWeight:900, color:'#fff' }}>See Your Results!</div>
                  <div style={{ color:'rgba(255,255,255,0.75)', fontSize:13 }}>Check your eye power score</div>
                </div>
                <div style={{ fontSize:22, color:'rgba(255,255,255,0.7)' }}>→</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{
        marginTop:18, padding:'12px 16px',
        background:'rgba(124,58,237,0.06)', border:'1.5px solid rgba(124,58,237,0.15)',
        borderRadius:14, textAlign:'center',
        fontFamily:"'Nunito',sans-serif", fontSize:13, color:C.violet, fontWeight:700,
      }}>
        💡 Fun Fact: Your eyes can see over 10 million different colours! 🌈
      </div>
    </div>
  );
}

// ── YOUNG ADULT DASHBOARD ────────────────────────────
function YoungDashboard({ user, testsCompleted, onStartVA, onStartColor, onViewReport }) {
  return (
    <div style={{ padding:'24px 16px', maxWidth:660, margin:'0 auto' }}>
      {/* Welcome card with eye image */}
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.09)', marginBottom:20, animation:'fadeUp 0.4s ease both' }}>
        <div style={{ position:'relative', height:110 }}>
          <img src={IMG.eyeMacro1} alt="" crossOrigin="anonymous"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.28) saturate(1.4)' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(27,79,138,0.88),rgba(44,123,229,0.6))' }} />
          <div style={{ position:'absolute', inset:0, padding:'0 20px', display:'flex', alignItems:'center' }}>
            <div>
              <div style={{ color:'rgba(255,255,255,0.55)', fontSize:11, fontWeight:700, letterSpacing:2 }}>WELCOME BACK</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#fff', fontWeight:700 }}>{user?.name || 'User'}</div>
            </div>
          </div>
        </div>
        <div style={{ padding:'16px 20px', display:'flex', gap:16 }}>
          {[
            { label:'Tests Done', val: Object.values(testsCompleted).filter(Boolean).length + '/2' },
            { label:'Gender', val: user?.gender || '—' },
            { label:'Age', val: user?.age ? user.age + ' yrs' : '—' },
          ].map(s => (
            <div key={s.label} style={{ flex:1, textAlign:'center' }}>
              <div style={{ fontSize:20, fontWeight:800, color:C.blue }}>{s.val}</div>
              <div style={{ fontSize:11, color:C.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Test cards with real eye images */}
      <div style={{ display:'grid', gap:14 }}>
        <EyeTestCard
          title="👁️ Visual Acuity Test"
          sub="Snellen Chart & Tumbling E · Left & Right Eye"
          imgSrc={IMG.eyeChart}
          color={C.blue}
          gradient="linear-gradient(to right,rgba(27,79,138,0.9),rgba(44,123,229,0.5))"
          done={testsCompleted.va}
          onClick={() => { playClick('normal'); onStartVA(); }}
          animDelay={0.05}
        />
        <EyeTestCard
          title="🎨 Color Blindness Test"
          sub="Ishihara Plates · AI Classification · 10 Plates"
          imgSrc={IMG.iris1}
          color="#9333EA"
          gradient="linear-gradient(to right,rgba(109,40,217,0.9),rgba(147,51,234,0.5))"
          done={testsCompleted.color}
          onClick={() => { playClick('normal'); onStartColor(); }}
          animDelay={0.12}
        />

        {(testsCompleted.va || testsCompleted.color) && (
          <div
            onClick={() => { playClick('success'); onViewReport(); }}
            className="card-hover"
            style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:`1.5px solid ${C.green}30`, display:'flex', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', animation:'fadeUp 0.4s ease 0.2s both', cursor:'pointer' }}
          >
            <div style={{ width:70, flexShrink:0, position:'relative' }}>
              <img src={IMG.glasses} alt="" crossOrigin="anonymous"
                style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.5)' }}
                onError={e => { e.target.style.display='none'; }}
              />
              <div style={{ position:'absolute', inset:0, background:C.green+'99', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>📊</div>
            </div>
            <div style={{ flex:1, padding:'14px 16px' }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.dark }}>View AI Report</div>
              <div style={{ fontSize:12, color:C.muted }}>Clinical analysis · Download PDF</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', padding:'0 16px' }}>
              <Btn color={C.green} size="sm" onClick={() => {}}>View</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ADULT DASHBOARD (36-60) ──────────────────────────
function AdultDashboard({ user, testsCompleted, onStartVA, onStartColor, onViewReport }) {
  return (
    <div style={{ padding:'24px 16px', maxWidth:640, margin:'0 auto' }}>
      {/* Welcome with eye image */}
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', marginBottom:22, boxShadow:'0 4px 20px rgba(0,0,0,0.08)', animation:'fadeUp 0.4s ease both' }}>
        <div style={{ position:'relative', height:120 }}>
          <img src={IMG.eyeScope} alt="" crossOrigin="anonymous"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.25) saturate(1.2)' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(14,116,144,0.9),rgba(6,90,130,0.7))' }} />
          <div style={{ position:'absolute', inset:0, padding:'0 24px', display:'flex', alignItems:'center' }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:'#fff', fontWeight:700 }}>
                Welcome, {user?.name?.split(' ')[0] || 'Patient'}
              </div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginTop:2 }}>Complete your vision screening today</div>
            </div>
          </div>
        </div>
        <div style={{ padding:'14px 20px' }}>
          <ProgressBar
            value={Object.values(testsCompleted).filter(Boolean).length}
            max={2}
            color={C.adultColor}
            label="Tests completed"
          />
        </div>
      </div>

      {/* Instructions */}
      <div style={{ background:`${C.adultColor}08`, border:`1.5px solid ${C.adultColor}22`, borderRadius:14, padding:'14px 18px', marginBottom:18, animation:'fadeUp 0.4s ease 0.08s both' }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.adultColor, marginBottom:6 }}>📋 Instructions</div>
        <div style={{ fontSize:13, color:C.mid, lineHeight:1.7 }}>
          This screening includes two tests. Start with the visual acuity test, then the color vision test.
          Sit in a well-lit area and hold the device at arm's length (about 40 cm).
        </div>
      </div>

      {/* Test tiles with eye images */}
      <div style={{ display:'grid', gap:12 }}>
        {[
          { title:'Visual Acuity Test', sub:'Letter reading test for both eyes', imgSrc:IMG.snellenWall, color:C.adultColor, done:testsCompleted.va, onClick:onStartVA },
          { title:'Color Blindness Test', sub:'Identify numbers in colourful patterns', imgSrc:IMG.iris2, color:'#7C3AED', done:testsCompleted.color, onClick:onStartColor },
        ].map((t, i) => (
          <div
            key={t.title}
            onClick={() => { playClick('normal'); t.onClick(); }}
            className="card-hover"
            style={{ borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.07)', animation:`fadeUp 0.4s ease ${i*0.1}s both`, cursor:'pointer' }}
          >
            <div style={{ position:'relative', height:90 }}>
              <img src={t.imgSrc} alt="" crossOrigin="anonymous"
                style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.3)' }}
                onError={e => { e.target.style.display='none'; }}
              />
              <div style={{ position:'absolute', inset:0, background:`${t.color}cc` }} />
              <div style={{ position:'absolute', inset:0, padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>{t.title}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{t.sub}</div>
                </div>
                <div>
                  {t.done
                    ? <span style={{ background:'rgba(18,183,106,0.9)', color:'#fff', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700 }}>✓ Done</span>
                    : <Btn color="rgba(255,255,255,0.95)" size="sm" style={{ color:t.color }} onClick={() => {}}>Start</Btn>
                  }
                </div>
              </div>
            </div>
          </div>
        ))}

        {(testsCompleted.va || testsCompleted.color) && (
          <Btn full color={C.green} size="lg" onClick={onViewReport} style={{ marginTop:4 }}>
            📊 View Complete Report
          </Btn>
        )}
      </div>
    </div>
  );
}

// ── ELDER DASHBOARD ──────────────────────────────────
function ElderDashboard({ user, testsCompleted, onStartVA, onStartColor, onViewReport }) {
  return (
    <div style={{ padding:'28px 20px', maxWidth:600, margin:'0 auto' }}>
      {/* Welcome with elder eye image */}
      <div style={{ borderRadius:20, overflow:'hidden', marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.1)', animation:'fadeUp 0.4s ease both' }}>
        <div style={{ position:'relative', height:130 }}>
          <img src={IMG.elderEyes} alt="" crossOrigin="anonymous"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.25)' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(217,119,6,0.9),rgba(180,83,9,0.8))' }} />
          <div style={{ position:'absolute', inset:0, padding:'20px 24px', display:'flex', alignItems:'flex-end' }}>
            <div>
              <div style={{ fontSize:28, fontWeight:900, color:'#fff', fontFamily:"'Playfair Display',serif" }}>
                👋 Welcome, {user?.name?.split(' ')[0] || 'Friend'}!
              </div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:15, marginTop:4 }}>
                Today we will check your eyesight. It is very simple.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice guidance */}
      <div style={{ background:'#EFF6FF', border:'2px solid #BFDBFE', borderRadius:16, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:12, animation:'fadeUp 0.4s ease 0.1s both' }}>
        <div style={{ fontSize:32 }}>🔊</div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:C.blue }}>Voice Guide is ON</div>
          <div style={{ fontSize:14, color:C.mid }}>The app will speak each instruction to you.</div>
        </div>
      </div>

      {/* Big test buttons with eye images */}
      <div style={{ display:'grid', gap:16 }}>
        <div
          onClick={() => { playClick('normal'); speak('startVA', user?.lang || 'en'); onStartVA(); }}
          className="card-hover"
          style={{ borderRadius:20, overflow:'hidden', boxShadow: testsCompleted.va ? 'none' : '0 8px 24px rgba(217,119,6,0.4)', animation:'fadeUp 0.4s ease 0.2s both', cursor:'pointer', border: testsCompleted.va ? `3px solid ${C.green}` : 'none' }}
        >
          <div style={{ position:'relative', height:130 }}>
            <img src={IMG.optometry} alt="" crossOrigin="anonymous"
              style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.3)' }}
              onError={e => { e.target.style.display='none'; }}
            />
            <div style={{ position:'absolute', inset:0, background: testsCompleted.va ? 'rgba(18,183,106,0.85)' : 'linear-gradient(135deg,rgba(217,119,6,0.95),rgba(180,83,9,0.9))' }} />
            <div style={{ position:'absolute', inset:0, padding:'0 24px', display:'flex', alignItems:'center', gap:18 }}>
              <div style={{ fontSize:52 }}>👁️</div>
              <div>
                <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>
                  {testsCompleted.va ? '✅ Eye Test — Done!' : 'Test 1: Eye Reading Test'}
                </div>
                <div style={{ fontSize:16, color:'rgba(255,255,255,0.8)' }}>
                  {testsCompleted.va ? 'Tap to do it again' : 'Read letters from a chart'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => { playClick('normal'); speak('colorStart', user?.lang || 'en'); onStartColor(); }}
          className="card-hover"
          style={{ borderRadius:20, overflow:'hidden', boxShadow: testsCompleted.color ? 'none' : '0 8px 24px rgba(124,58,237,0.4)', animation:'fadeUp 0.4s ease 0.28s both', cursor:'pointer', border: testsCompleted.color ? `3px solid ${C.green}` : 'none' }}
        >
          <div style={{ position:'relative', height:130 }}>
            <img src={IMG.colorblind} alt="" crossOrigin="anonymous"
              style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.3)' }}
              onError={e => { e.target.style.display='none'; }}
            />
            <div style={{ position:'absolute', inset:0, background: testsCompleted.color ? 'rgba(18,183,106,0.85)' : 'linear-gradient(135deg,rgba(124,58,237,0.95),rgba(91,33,182,0.9))' }} />
            <div style={{ position:'absolute', inset:0, padding:'0 24px', display:'flex', alignItems:'center', gap:18 }}>
              <div style={{ fontSize:52 }}>🌈</div>
              <div>
                <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:4 }}>
                  {testsCompleted.color ? '✅ Colour Test — Done!' : 'Test 2: Colour Vision Test'}
                </div>
                <div style={{ fontSize:16, color:'rgba(255,255,255,0.8)' }}>
                  {testsCompleted.color ? 'Tap to do it again' : 'Find numbers in colourful pictures'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {(testsCompleted.va || testsCompleted.color) && (
          <div
            onClick={() => { playClick('success'); onViewReport(); }}
            className="card-hover"
            style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 8px 24px rgba(5,150,105,0.4)', animation:'fadeUp 0.4s ease 0.36s both', cursor:'pointer' }}
          >
            <div style={{ position:'relative', height:100 }}>
              <img src={IMG.reportBg} alt="" crossOrigin="anonymous"
                style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.3)' }}
                onError={e => { e.target.style.display='none'; }}
              />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(5,150,105,0.95),rgba(4,120,87,0.9))' }} />
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', gap:16, color:'#fff' }}>
                <span style={{ fontSize:40 }}>📋</span>
                <span style={{ fontSize:24, fontWeight:900 }}>See My Results</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────
export function HomeDashboard({ user, stars = 0, testsCompleted = {}, onStartVA, onStartColor, onViewReport }) {
  const ageGroup = AGE_GROUPS.find(g => g.id === user?.ageGroup) || AGE_GROUPS[1];

  switch (ageGroup.mode) {
    case 'game':  return <KidsDashboard user={user} stars={stars} testsCompleted={testsCompleted} onStartVA={onStartVA} onStartColor={onStartColor} onViewReport={onViewReport} />;
    case 'elder': return <ElderDashboard user={user} testsCompleted={testsCompleted} onStartVA={onStartVA} onStartColor={onStartColor} onViewReport={onViewReport} />;
    case 'clear': return <AdultDashboard user={user} testsCompleted={testsCompleted} onStartVA={onStartVA} onStartColor={onStartColor} onViewReport={onViewReport} />;
    default:      return <YoungDashboard user={user} testsCompleted={testsCompleted} onStartVA={onStartVA} onStartColor={onStartColor} onViewReport={onViewReport} />;
  }
}
