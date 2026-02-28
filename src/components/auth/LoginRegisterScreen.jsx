import { useState } from 'react';
import { C, IMG, AGE_GROUPS } from '../../data/constants';
import { registerUser, loginUser, playClick, speak } from '../../utils/helpers';

const EYE_BG = 'https://images.unsplash.com/photo-1588776814546-1ffbb042d2ce?w=1400&q=80';
import { Btn } from '../ui/Btn';

const INPUT_STYLE = (focused) => ({
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: `2px solid ${focused ? C.blue : C.border}`,
  fontSize: 14,
  color: C.dark,
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color 0.2s',
  background: '#fff',
});

function Field({ label, type = 'text', value, onChange, placeholder, required, large, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', marginBottom: 5,
        fontSize: large ? 15 : 13,
        fontWeight: 600, color: C.mid,
      }}>
        {label}{required && <span style={{ color: C.red }}> *</span>}
      </label>
      {children || (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={INPUT_STYLE(focused)}
        />
      )}
    </div>
  );
}

export function LoginRegisterScreen({ lang, onLogin }) {
  const [mode, setMode]       = useState('login'); // 'login' | 'register'
  const [role, setRole]       = useState('');      // 'new_user' | 'social_worker'
  const [ageGroup, setAgeGroup] = useState('');
  const [form, setForm]       = useState({ name:'', age:'', gender:'', email:'', password:'', contact:'', location:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);


  const update = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = () => {
    setError('');
    if (!form.name || !form.email || !form.password || !role) {
      setError('Please fill in all required fields'); return;
    }
    if (role === 'new_user' && !ageGroup) {
      setError('Please select your age group'); return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = registerUser({ ...form, role, ageGroup });
      setLoading(false);
      if (!res.ok) { setError(res.error); return; }
      playClick('success');
      speak('welcome', lang);
      onLogin(res.user);
    }, 600);
  };

  const handleLogin = () => {
    setError('');
    if (!form.email || !form.password) { setError('Please enter email and password'); return; }
    setLoading(true);
    setTimeout(() => {
      const res = loginUser(form.email, form.password);
      setLoading(false);
      if (!res.ok) { setError(res.error); return; }
      playClick('success');
      onLogin(res.user);
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <img src={EYE_BG} crossOrigin="anonymous" alt=""
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.15) saturate(1.4)', zIndex:0 }}
        onError={e => { e.target.style.display='none'; }}
      />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(145deg,rgba(5,13,26,0.9),rgba(17,34,64,0.85))', zIndex:1 }} />
      <div style={{ width:'100%', maxWidth:460, position:'relative', zIndex:2 }}>

        {/* Logo bar */}
        <div style={{ textAlign:'center', marginBottom:24, animation:'fadeDown 0.5s ease both' }}>
          <img src={IMG.eyeClose} alt="" style={{ width:56, height:56, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.blue}`, marginBottom:10 }} />
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:'#fff' }}>VisionAI</div>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 22, overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          animation: 'zoomIn 0.4s ease both',
        }}>
          {/* Tab switcher */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', background: C.bg }}>
            {['login','register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); playClick('normal'); }}
                style={{
                  padding: '16px',
                  background: mode === m ? '#fff' : 'transparent',
                  border: 'none',
                  fontWeight: 700, fontSize: 15,
                  color: mode === m ? C.primary : C.muted,
                  cursor: 'pointer',
                  borderBottom: mode === m ? `3px solid ${C.blue}` : '3px solid transparent',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {m === 'login' ? '🔐 Login' : '📝 Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ padding: 28 }}>
            {error && (
              <div style={{
                background: '#FFF1F0', border:`1px solid ${C.red}30`,
                borderRadius:10, padding:'10px 14px',
                color: C.red, fontSize:13, marginBottom:16,
                animation: 'shake 0.4s ease',
              }}>
                ⚠️ {error}
              </div>
            )}

            {mode === 'login' ? (
              <>
                <Field label="Email Address" type="email" value={form.email} onChange={update('email')} placeholder="your@email.com" required />
                <Field label="Password" type="password" value={form.password} onChange={update('password')} placeholder="Enter password" required />
                <Btn full color={C.primary} size="lg" onClick={handleLogin} disabled={loading}>
                  {loading ? '⏳ Logging in...' : '🔐 Login'}
                </Btn>
                <div style={{ textAlign:'center', marginTop:14, fontSize:13, color:C.muted }}>
                  No account?{' '}
                  <span
                    onClick={() => setMode('register')}
                    style={{ color:C.blue, fontWeight:600, cursor:'pointer' }}
                  >
                    Register now
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Role selection */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.mid, marginBottom:10 }}>
                    I am a <span style={{ color:C.red }}>*</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      { id:'new_user',      label:'New User',      icon:'👤', sub:'Personal screening', img: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=400&q=80' },
                      { id:'social_worker', label:'Social Worker', icon:'🏥', sub:'Manage patients & camp', img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80' },
                    ].map(r => (
                      <div
                        key={r.id}
                        onClick={() => { setRole(r.id); setAgeGroup(''); playClick('normal'); }}
                        className="card-hover"
                        style={{
                          border:`2px solid ${role === r.id ? C.blue : C.border}`,
                          borderRadius:14,
                          overflow:'hidden',
                          background: role === r.id ? '#EFF6FF' : '#fff',
                          transition:'all 0.2s',
                          cursor:'pointer',
                        }}
                      >
                        <img src={r.img} crossOrigin="anonymous" alt="" style={{ width:'100%', height:70, objectFit:'cover', filter:'brightness(0.85)' }} />
                        <div style={{ padding:'10px 12px' }}>
                          <div style={{ fontSize:14, fontWeight:700, color: role === r.id ? C.primary : C.dark }}>
                            {r.icon} {r.label}
                          </div>
                          <div style={{ fontSize:11, color:C.muted }}>{r.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age group (new user only) */}
                {role === 'new_user' && (
                  <div style={{ marginBottom:16, animation:'fadeUp 0.3s ease both' }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.mid, marginBottom:10 }}>
                      Age Group <span style={{ color:C.red }}>*</span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {AGE_GROUPS.map(ag => (
                        <div
                          key={ag.id}
                          onClick={() => { setAgeGroup(ag.id); playClick('normal'); }}
                          style={{
                            padding:'10px 12px',
                            borderRadius:12,
                            border:`2px solid ${ageGroup === ag.id ? ag.color : C.border}`,
                            background: ageGroup === ag.id ? `${ag.color}12` : '#fff',
                            cursor:'pointer',
                            transition:'all 0.2s',
                          }}
                        >
                          <div style={{ fontSize:18, marginBottom:2 }}>{ag.icon}</div>
                          <div style={{ fontSize:12, fontWeight:700, color: ageGroup === ag.id ? ag.color : C.dark }}>
                            {ag.label}
                          </div>
                          <div style={{ fontSize:10, color:C.muted }}>{ag.range}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal details */}
                <Field label="Full Name" value={form.name} onChange={update('name')} placeholder="Your full name" required />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <Field label="Age" type="number" value={form.age} onChange={update('age')} placeholder="Age" />
                  <Field label="Gender">
                    <select
                      value={form.gender}
                      onChange={e => update('gender')(e.target.value)}
                      style={{ ...INPUT_STYLE(false), height:44 }}
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </div>
                <Field label="Email" type="email" value={form.email} onChange={update('email')} placeholder="email@example.com" required />
                <Field label="Password" type="password" value={form.password} onChange={update('password')} placeholder="Min 6 characters" required />
                <Field label="Contact Number" type="tel" value={form.contact} onChange={update('contact')} placeholder="+91 XXXXX XXXXX" />
                <Field label="Location / City" value={form.location} onChange={update('location')} placeholder="City, State" />

                <Btn full color={C.green} size="lg" onClick={handleRegister} disabled={loading} style={{ marginTop:8 }}>
                  {loading ? '⏳ Creating Account...' : '✅ Create Account'}
                </Btn>
                <div style={{ textAlign:'center', marginTop:14, fontSize:13, color:C.muted }}>
                  Already have an account?{' '}
                  <span
                    onClick={() => setMode('login')}
                    style={{ color:C.blue, fontWeight:600, cursor:'pointer' }}
                  >
                    Login
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:16, fontSize:11, color:'rgba(255,255,255,0.2)' }}>
          🔒 Your data is encrypted and stored locally
        </div>
      </div>
    </div>
  );
}
