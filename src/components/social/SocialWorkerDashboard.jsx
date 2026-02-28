import { useState, useMemo } from 'react';
import { C, IMG, AGE_GROUPS, CAMP_LOCATIONS, EYE_BACKGROUNDS } from '../../data/constants';
import { addPatient, getPatients, getReports, playClick, fmtDate } from '../../utils/helpers';
import { Btn, OutlineBtn } from '../ui/Btn';
import { PhotoBanner } from '../ui/PhotoBanner';
import { ProgressBar } from '../ui/ProgressBar';
import { Modal } from '../ui/Modal';

const INP = (focused) => ({
  width:'100%', padding:'12px 16px', borderRadius:10,
  border:`2px solid ${focused ? C.blue : C.border}`,
  fontSize:14, color:C.dark, outline:'none',
  fontFamily:"'DM Sans',sans-serif",
  background:'#fff',
  boxSizing:'border-box',
});

// ── Derive a unique accent colour per worker (stable hash) ──
function workerColor(id = '') {
  const palette = [C.teal, C.blue, '#7C3AED', '#D97706', '#059669', '#DC2626', '#2563EB', '#9333EA'];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff;
  return palette[hash % palette.length];
}

// ── Pick an eye background image per worker (stable) ──
function workerBg(id = '') {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 17 + id.charCodeAt(i)) & 0xffff;
  return EYE_BACKGROUNDS[hash % EYE_BACKGROUNDS.length];
}

// ── Worker identity badge — unique per worker ────────
function WorkerIdentityBadge({ worker, color, bgImg }) {
  const initials = (worker.name || 'SW')
    .split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div style={{
      borderRadius:20, overflow:'hidden', marginBottom:16,
      boxShadow:`0 4px 24px ${color}33`,
      border:`2px solid ${color}44`,
      animation:'fadeUp 0.3s ease both',
    }}>
      {/* Eye image banner — unique bg per worker */}
      <div style={{ position:'relative', height:100, overflow:'hidden' }}>
        <img
          src={bgImg}
          alt=""
          style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.25) saturate(1.5)' }}
          crossOrigin="anonymous"
        />
        <div style={{
          position:'absolute', inset:0,
          background:`linear-gradient(135deg, ${color}cc, ${color}88)`,
        }} />
        <div style={{
          position:'absolute', inset:0,
          display:'flex', alignItems:'center', gap:16, padding:'0 20px',
        }}>
          {/* Avatar circle with initials */}
          <div style={{
            width:60, height:60, borderRadius:'50%', flexShrink:0,
            background:'rgba(255,255,255,0.15)',
            border:'3px solid rgba(255,255,255,0.5)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:22, fontWeight:900, color:'#fff',
            backdropFilter:'blur(6px)',
            boxShadow:`0 4px 14px ${color}66`,
          }}>
            {initials}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:19, fontWeight:800, color:'#fff' }}>{worker.name}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', marginTop:2 }}>
              🏥 Social Worker · ID: <span style={{ fontFamily:'monospace', opacity:0.9 }}>{worker.id?.slice(-8) || 'N/A'}</span>
            </div>
            {worker.location && (
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:1 }}>
                📍 {worker.location}
              </div>
            )}
          </div>
          {/* Isolated dashboard badge */}
          <div style={{
            padding:'5px 14px', borderRadius:99,
            fontSize:11, fontWeight:700,
            background:'rgba(255,255,255,0.18)',
            color:'#fff',
            border:'1.5px solid rgba(255,255,255,0.3)',
            whiteSpace:'nowrap',
            backdropFilter:'blur(6px)',
          }}>
            🔒 Private Dashboard
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add Patient Modal ────────────────────────────────
function AddPatientModal({ workerId, workerAccent, onClose, onSave }) {
  const [form, setForm]       = useState({ name:'', age:'', gender:'', contact:'', location:'', campLocation:'' });
  const [ageGroup, setAge]    = useState('');
  const [error, setError]     = useState('');
  const [focused, setFocused] = useState('');

  const up = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !ageGroup) { setError('Name and age group are required'); return; }
    const ag = AGE_GROUPS.find(g => g.id === ageGroup);
    // Pass workerId so the patient is stored under this worker's private key
    const patient = addPatient({ ...form, ageGroup, ageGroupLabel: ag?.range }, workerId);
    playClick('success');
    onSave(patient);
    onClose();
  };

  return (
    <Modal onClose={onClose} maxWidth={520}>
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 24px 64px rgba(0,0,0,0.2)' }}>
        {/* Eye image banner in modal */}
        <div style={{ position:'relative', height:90, overflow:'hidden' }}>
          <img
            src={IMG.eyeDoctor}
            alt=""
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.25)' }}
            crossOrigin="anonymous"
          />
          <div style={{ position:'absolute', inset:0, background:`${workerAccent}cc` }} />
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px' }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:'#fff' }}>Add New Patient</div>
              <div style={{ color:'rgba(255,255,255,0.55)', fontSize:12 }}>Saved to your private dashboard only</div>
            </div>
            <button onClick={onClose} style={{
              background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)',
              color:'#fff', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:14,
            }}>✕</button>
          </div>
        </div>

        <div style={{ padding:24 }}>
          {error && (
            <div style={{ background:'#FFF1F0', border:`1px solid ${C.red}30`, borderRadius:10, padding:'10px 14px', color:C.red, fontSize:13, marginBottom:14 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Age Group Grid */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.mid, marginBottom:8 }}>
              Age Group <span style={{ color:C.red }}>*</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {AGE_GROUPS.map(ag => (
                <div
                  key={ag.id}
                  onClick={() => { setAge(ag.id); playClick('normal'); }}
                  style={{
                    padding:'10px 14px', borderRadius:12,
                    border:`2px solid ${ageGroup===ag.id ? ag.color : C.border}`,
                    background: ageGroup===ag.id ? `${ag.color}12` : '#fff',
                    cursor:'pointer', transition:'all 0.18s',
                    display:'flex', alignItems:'center', gap:8,
                  }}
                >
                  <span style={{ fontSize:18 }}>{ag.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color: ageGroup===ag.id ? ag.color : C.dark }}>{ag.label}</div>
                    <div style={{ fontSize:10, color:C.muted }}>{ag.range}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fields */}
          {[
            { k:'name',    label:'Full Name',       placeholder:'Patient full name',    required:true },
            { k:'age',     label:'Age',              placeholder:'Age in years',         type:'number' },
            { k:'contact', label:'Contact Number',   placeholder:'+91 XXXXX XXXXX',     type:'tel' },
            { k:'location',label:'Patient Location', placeholder:'Village / Town / City' },
          ].map(f => (
            <div key={f.k} style={{ marginBottom:12 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.mid, marginBottom:5 }}>
                {f.label}{f.required && <span style={{ color:C.red }}> *</span>}
              </label>
              <input
                type={f.type||'text'}
                value={form[f.k]}
                onChange={e => up(f.k)(e.target.value)}
                placeholder={f.placeholder}
                onFocus={() => setFocused(f.k)}
                onBlur={() => setFocused('')}
                style={INP(focused===f.k)}
              />
            </div>
          ))}

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.mid, marginBottom:5 }}>Gender</label>
              <select value={form.gender} onChange={e => up('gender')(e.target.value)} style={{ ...INP(false), height:44 }}>
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:C.mid, marginBottom:5 }}>Camp Location</label>
              <select value={form.campLocation} onChange={e => up('campLocation')(e.target.value)} style={{ ...INP(false), height:44 }}>
                <option value="">Select</option>
                {CAMP_LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <OutlineBtn onClick={onClose} full>Cancel</OutlineBtn>
            <Btn color={workerAccent} full onClick={handleSave}>✅ Add Patient</Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Patient Card ─────────────────────────────────────
function PatientCard({ patient, accentColor, onStartTest }) {
  const ag = AGE_GROUPS.find(g => g.id === patient.ageGroup) || AGE_GROUPS[1];
  return (
    <div style={{
      background:'#fff', borderRadius:16, overflow:'hidden',
      border:`1.5px solid ${C.border}`,
      boxShadow:'0 2px 10px rgba(0,0,0,0.06)',
      animation:'slideIn 0.35s ease both',
      display:'flex',
    }}>
      {/* Eye image thumbnail */}
      <div style={{ width:72, flexShrink:0, position:'relative', overflow:'hidden' }}>
        <img
          src={ag.id==='kids' ? IMG.childEyes : ag.id==='elder' ? IMG.elderEyes : IMG.eyeMacro1}
          alt=""
          crossOrigin="anonymous"
          style={{ width:'100%', height:'100%', objectFit:'cover', filter:`brightness(0.5) saturate(1.3)` }}
        />
        <div style={{
          position:'absolute', inset:0,
          background:`${ag.color}99`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:28,
        }}>
          {ag.icon}
        </div>
      </div>

      <div style={{ flex:1, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.dark }}>{patient.name}</div>
          <div style={{ fontSize:12, color:C.muted }}>
            {patient.age} yrs · {patient.gender || 'N/A'} · {patient.ageGroupLabel}
          </div>
          <div style={{ fontSize:11, color:C.muted, fontFamily:'monospace' }}>
            {patient.patientId}
          </div>
          {patient.campLocation && (
            <div style={{ fontSize:11, color:C.teal, fontWeight:500, marginTop:1 }}>📍 {patient.campLocation}</div>
          )}
        </div>
        <Btn color={ag.color} size="sm" onClick={() => onStartTest(patient)}>
          Test →
        </Btn>
      </div>
    </div>
  );
}

// ── MAIN SOCIAL WORKER DASHBOARD ─────────────────────
export function SocialWorkerDashboard({ user, onStartPatientTest }) {
  const workerId = user?.id || 'global';
  const wColor   = workerColor(workerId);
  const wBgImg   = workerBg(workerId);

  const [showAdd, setShowAdd]     = useState(false);
  const [patients, setPatients]   = useState(() => getPatients(workerId));
  const [search, setSearch]       = useState('');
  const [filterAge, setFilterAge] = useState('all');
  const [tab, setTab]             = useState('patients');

  // Reports scoped to this worker only
  const reports = getReports(workerId);

  const reload = () => setPatients(getPatients(workerId));

  const filtered = patients
    .filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.patientId?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p => filterAge === 'all' || p.ageGroup === filterAge);

  const ageStats = AGE_GROUPS.map(ag => ({
    ...ag,
    count: patients.filter(p => p.ageGroup === ag.id).length,
  }));

  const todayCount = patients.filter(p =>
    new Date(p.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const referrals = reports.filter(r => r.vaLeft < 4 || r.vaRight < 4).length;

  return (
    <div style={{ padding:'20px 16px', maxWidth:760, margin:'0 auto' }}>
      {showAdd && (
        <AddPatientModal
          workerId={workerId}
          workerAccent={wColor}
          onClose={() => setShowAdd(false)}
          onSave={() => reload()}
        />
      )}

      {/* Per-worker identity banner with unique eye bg */}
      <WorkerIdentityBadge worker={user} color={wColor} bgImg={wBgImg} />

      {/* Main camp banner — eye themed */}
      <div style={{
        borderRadius:20, overflow:'hidden', marginBottom:16,
        boxShadow:'0 4px 20px rgba(0,0,0,0.1)',
        animation:'fadeUp 0.4s ease 0.05s both',
      }}>
        <div style={{ position:'relative', height:100, overflow:'hidden' }}>
          <img
            src={IMG.eyeScope}
            alt=""
            crossOrigin="anonymous"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.22)' }}
          />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg,${wColor}cc,rgba(0,0,0,0.6))` }} />
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', gap:16, padding:'0 20px' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700, color:'#fff' }}>
                My Health Camp
              </div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:2 }}>
                {patients.length} patient{patients.length !== 1 ? 's' : ''} registered under your account
              </div>
            </div>
            <Btn color="rgba(255,255,255,0.95)" style={{ color: wColor, fontWeight:700 }} onClick={() => setShowAdd(true)}>
              + Add Patient
            </Btn>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ background:'#fff', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {[
            { label:'My Patients', val:patients.length, color:wColor },
            { label:'Reports',     val:reports.length,  color:C.blue },
            { label:'Today',       val:todayCount,      color:C.green },
            { label:'Referrals',   val:referrals,       color:C.red },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding:'14px 0', textAlign:'center',
              borderRight: i < 3 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:10, color:C.muted, fontWeight:600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:8, marginBottom:14, animation:'fadeUp 0.4s ease 0.1s both' }}>
        {[
          { id:'patients', label:'👥 My Patients', count:patients.length },
          { id:'stats',    label:'📊 Distribution', count:null },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding:'10px 18px', borderRadius:12, border:'none', cursor:'pointer',
              background: tab===t.id ? wColor : '#fff',
              color: tab===t.id ? '#fff' : C.mid,
              fontSize:13, fontWeight:700,
              boxShadow: tab===t.id ? `0 4px 12px ${wColor}44` : '0 1px 4px rgba(0,0,0,0.08)',
              transition:'all 0.2s',
            }}
          >
            {t.label}
            {t.count !== null && (
              <span style={{
                marginLeft:6, background: tab===t.id ? 'rgba(255,255,255,0.25)' : `${wColor}18`,
                color: tab===t.id ? '#fff' : wColor,
                padding:'1px 7px', borderRadius:99, fontSize:11,
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats tab */}
      {tab === 'stats' && (
        <div style={{
          background:'#fff', borderRadius:18, overflow:'hidden',
          boxShadow:'0 2px 12px rgba(0,0,0,0.07)',
          animation:'fadeUp 0.35s ease both',
        }}>
          {/* Eye image header in stats */}
          <div style={{ position:'relative', height:80, overflow:'hidden' }}>
            <img src={IMG.iris1} alt="" crossOrigin="anonymous"
              style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.3)' }} />
            <div style={{ position:'absolute', inset:0, background:`${wColor}99` }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', padding:'0 20px' }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#fff' }}>
                Patient Distribution — {user?.name}'s Camp
              </div>
            </div>
          </div>
          <div style={{ padding:'18px 20px' }}>
            {patients.length === 0 ? (
              <div style={{ textAlign:'center', padding:'24px 0', color:C.muted, fontSize:13 }}>
                No patients yet — add your first patient to see stats
              </div>
            ) : (
              <div style={{ display:'grid', gap:10 }}>
                {ageStats.map(ag => (
                  <ProgressBar
                    key={ag.id}
                    value={ag.count}
                    max={Math.max(patients.length, 1)}
                    color={ag.color}
                    label={`${ag.icon} ${ag.label} (${ag.range}) — ${ag.count} patient${ag.count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Patients tab */}
      {tab === 'patients' && (
        <div style={{
          background:'#fff', borderRadius:18, overflow:'hidden',
          boxShadow:'0 2px 12px rgba(0,0,0,0.07)',
          animation:'fadeUp 0.4s ease 0.12s both',
        }}>
          <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.dark }}>
                Patient List ({filtered.length})
              </div>
              <Btn color={wColor} size="sm" onClick={() => setShowAdd(true)}>+ Add Patient</Btn>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <input
                placeholder="🔍 Search name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...INP(false), flex:1, padding:'9px 14px', fontSize:13 }}
              />
              <select
                value={filterAge}
                onChange={e => setFilterAge(e.target.value)}
                style={{ ...INP(false), width:130, height:40, padding:'8px 12px', fontSize:12 }}
              >
                <option value="all">All Ages</option>
                {AGE_GROUPS.map(ag => <option key={ag.id} value={ag.id}>{ag.icon} {ag.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ padding:'14px 16px', maxHeight:460, overflowY:'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:'44px 20px', color:C.muted }}>
                <img src={IMG.eyeMacro2} alt="" crossOrigin="anonymous"
                  style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', marginBottom:14, opacity:0.4 }} />
                <div style={{ fontSize:15, fontWeight:600 }}>
                  {patients.length === 0 ? 'No patients yet' : 'No matches found'}
                </div>
                <div style={{ fontSize:13, marginTop:4, color:C.muted }}>
                  {patients.length === 0
                    ? 'Click "+ Add Patient" to register your first patient'
                    : 'Try a different search term or filter'}
                </div>
                {patients.length === 0 && (
                  <Btn color={wColor} style={{ marginTop:16 }} onClick={() => setShowAdd(true)}>
                    + Add First Patient
                  </Btn>
                )}
              </div>
            ) : (
              <div style={{ display:'grid', gap:10 }}>
                {filtered.map(p => (
                  <PatientCard
                    key={p.patientId}
                    patient={p}
                    accentColor={wColor}
                    onStartTest={patient => onStartPatientTest(patient)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
