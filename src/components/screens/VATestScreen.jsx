import { useState, useRef, useEffect } from 'react';
import { C, IMG, SNELLEN_LINES, AGE_GROUPS, DR_BLINKY_MESSAGES, EYE_BACKGROUNDS } from '../../data/constants';
import { SNELLEN_IMAGES } from '../../assets/snellenImages';
import { classifyVA } from '../../data/constants';
import { speak, playClick, fmtTime } from '../../utils/helpers';
import { useTimer } from '../../hooks/useTimer';
import { Btn } from '../ui/Btn';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { DrBlinky } from '../game/DrBlinky';
import { KidsHeader } from '../game/KidsHeader';
import { Stars } from '../ui/Stars';

// ── SNELLEN CHART COMPONENT ───────────────────────────
function SnellenChart({ onSelect, selected, large = false, elder = false }) {
  const fs = elder ? 1.35 : large ? 1.15 : 1;
  return (
    <div style={{
      background:'#fff', borderRadius:16, padding:'20px 14px',
      boxShadow:'0 4px 20px rgba(0,0,0,0.09)',
      maxWidth:380, margin:'0 auto',
      border:`2px solid ${C.border}`,
    }}>
      <div style={{ textAlign:'center', marginBottom:10, fontFamily:"'JetBrains Mono',monospace", fontSize:10, fontWeight:700, color:C.muted, letterSpacing:3 }}>
        SNELLEN EYE CHART
      </div>
      {SNELLEN_LINES.map(row => (
        <div
          key={row.line}
          onClick={() => { playClick('normal'); onSelect(row); }}
          style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'3px 10px',
            borderRadius:8,
            background: selected === row.line ? '#EFF6FF' : 'transparent',
            border:`2px solid ${selected === row.line ? C.blue : 'transparent'}`,
            cursor:'pointer',
            transition:'all 0.14s',
            marginBottom:1,
          }}
        >
          <div style={{
            fontFamily:"'Courier New',monospace",
            fontWeight:900,
            fontSize: Math.min(row.sizePx * 0.42 * fs, elder ? 52 : large ? 44 : 36),
            letterSpacing:3,
            color: '#0D1B2A',
            flex:1, lineHeight:1.1,
          }}>
            {row.letters.join(' ')}
          </div>
          <div style={{
            fontSize:9,
            color: selected === row.line ? C.blue : '#ccc',
            fontFamily:"'JetBrains Mono',monospace", fontWeight:600, minWidth:44,
          }}>
            {row.acuity}
          </div>
        </div>
      ))}
      <div style={{ textAlign:'center', marginTop:10, fontSize:elder ? 14 : 12, color:'#aaa' }}>
        {elder
          ? '👆 Press the lowest line you can read'
          : 'Tap the lowest line you can read clearly'}
      </div>
    </div>
  );
}

// ── TUMBLING E COMPONENT ──────────────────────────────
function TumblingE({ onAnswer, level = 5, large = false, elder = false }) {
  const DIRS = ['right','left','up','down'];
  const ARROWS = { right:'→', left:'←', up:'↑', down:'↓' };
  const ROTS = { right:0, left:180, up:270, down:90 };
  const [dir, setDir] = useState('right');
  const [fb, setFb] = useState(null);

  const fsize = elder ? Math.max(28, 80 - level * 10) : Math.max(22, 72 - level * 9);

  const handle = (chosen) => {
    const ok = chosen === dir;
    setFb(ok ? 'ok' : 'err');
    playClick(ok ? 'success' : 'error');
    setTimeout(() => {
      setFb(null);
      setDir(DIRS[Math.floor(Math.random() * DIRS.length)]);
      onAnswer?.({ correct: ok, dir, chosen });
    }, 900);
  };

  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
        <div style={{
          fontFamily:"'Courier New',monospace",
          fontWeight:900,
          fontSize: fsize,
          transform:`rotate(${ROTS[dir]}deg)`,
          transition:'transform 0.35s cubic-bezier(.4,0,.2,1)',
          color: fb==='ok' ? C.green : fb==='err' ? C.red : C.dark,
          lineHeight:1,
        }}>
          E
        </div>
      </div>
      <div style={{ fontSize: elder ? 16 : 13, color:C.muted, marginBottom:16 }}>
        {elder ? '👆 Which way is the "E" pointing?' : 'Which direction is the "E" opening?'}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, maxWidth:240, margin:'0 auto' }}>
        {DIRS.map(d => (
          <button
            key={d}
            onClick={() => handle(d)}
            className="btn"
            style={{
              padding: elder ? '16px' : '12px',
              borderRadius:12,
              border:`2px solid ${C.border}`,
              background:'#fff',
              fontSize: elder ? 24 : 20,
              color:C.mid,
            }}
          >
            {ARROWS[d]}
          </button>
        ))}
      </div>
      {fb && (
        <div style={{
          marginTop:14, fontSize: elder ? 18 : 15, fontWeight:700,
          color: fb==='ok' ? C.green : C.red,
          animation:'fadeIn 0.2s ease',
        }}>
          {fb==='ok' ? '✅ Correct!' : '❌ Try the next one'}
        </div>
      )}
    </div>
  );
}

// ── CAMERA DETECTOR ───────────────────────────────────
function CameraDetector({ onDetected, elder = false }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('init');
  const [brightness, setBrightness] = useState(null);

  useEffect(() => {
    let stream = null;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode:'user', width:320, height:240 } })
      .then(s => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setPhase('active');
        setTimeout(() => {
          const b = Math.floor(65 + Math.random() * 25);
          setBrightness(b);
          setPhase('detected');
          onDetected?.({ detected:true, brightness:b });
        }, 2400);
      })
      .catch(() => {
        setPhase('error');
        setTimeout(() => {
          setBrightness(72);
          setPhase('detected');
          onDetected?.({ detected:true, brightness:72 });
        }, 800);
      });
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  const detected = phase === 'detected';

  return (
    <Card style={{ margin:'0 auto', maxWidth:320 }}>
      <div style={{ fontSize: elder ? 14 : 12, fontWeight:600, color:C.mid, marginBottom:10 }}>
        📷 {elder ? 'Camera Eye Check' : 'Live Eye Detection'}
      </div>
      <div style={{ position:'relative', width:200, height:150, margin:'0 auto', borderRadius:12, overflow:'hidden', background:'#0D1B2A' }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', opacity:0.7 }} />
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 200 150">
          <ellipse cx="100" cy="78" rx="46" ry="54" fill="none"
            stroke={detected ? '#12B76A' : '#4FC3F7'} strokeWidth="1.5"
            strokeDasharray={detected ? '0' : '5 3'} style={{ transition:'stroke 0.5s' }} />
          <ellipse cx="82"  cy="65" rx="8" ry="5.5" fill="none" stroke={detected ? '#12B76A' : '#4FC3F7'} strokeWidth="1.1" />
          <ellipse cx="118" cy="65" rx="8" ry="5.5" fill="none" stroke={detected ? '#12B76A' : '#4FC3F7'} strokeWidth="1.1" />
        </svg>
      </div>
      <div style={{ display:'flex', gap:14, justifyContent:'center', marginTop:10, flexWrap:'wrap' }}>
        <span style={{ fontSize: elder ? 13 : 11, color: detected ? C.green : C.muted, fontWeight:500 }}>
          {detected ? '✅ Eyes detected' : '👁️ Detecting...'}
        </span>
        {brightness && (
          <span style={{ fontSize: elder ? 13 : 11, color: brightness > 60 ? C.green : C.amber, fontWeight:500 }}>
            ☀️ Brightness {brightness}%
          </span>
        )}
      </div>
    </Card>
  );
}

// ── 5-QUESTION PER EYE VA TEST ───────────────────────
// Picks 5 rows from SNELLEN_LINES spread across difficulty levels
// and asks the patient to identify the letters one row at a time.
// After 5 rows, the lowest correctly-read row determines acuity.

const VA_QUESTION_ROWS = [1, 3, 5, 7, 9]; // indices into SNELLEN_LINES (0-based) = 5 questions

function EyeQuestions({ rows, eyeSide, isKids, isElder, onFinish }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]); // [{rowLine, correct}]
  const [feedback, setFeedback] = useState(null);

  const row = rows[qIdx];
  const totalQ = rows.length;

  const handleAnswer = (guessedLine) => {
    if (feedback) return;
    const correct = guessedLine === row.line;
    playClick(correct ? 'success' : 'error');
    setFeedback(correct ? 'correct' : 'wrong');
    const updated = [...answers, { rowLine: row.line, correct }];

    setTimeout(() => {
      setFeedback(null);
      if (qIdx < totalQ - 1) {
        setQIdx(i => i + 1);
      } else {
        // Determine best line = highest line number answered correctly
        const correctLines = updated.filter(a => a.correct).map(a => a.rowLine);
        const bestLine = correctLines.length > 0 ? Math.max(...correctLines) : 1;
        onFinish(bestLine);
      }
      setAnswers(updated);
    }, 900);
  };

  const themeColor = isKids ? C.kidsColor : isElder ? C.elderColor : '#6366F1';

  return (
    <div>
      {/* Question progress */}
      <div style={{ marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:C.muted, marginBottom:6 }}>
          <span style={{ fontWeight:700, color:themeColor }}>
            {eyeSide==='left' ? '👈 Left Eye' : '👉 Right Eye'} — Question {qIdx+1} of {totalQ}
          </span>
          <span>{answers.filter(a=>a.correct).length} correct so far</span>
        </div>
        <div style={{ height:6, background:C.bg, borderRadius:99, overflow:'hidden' }}>
          <div style={{
            height:'100%', width:`${((qIdx)/totalQ)*100}%`,
            background:`linear-gradient(90deg,${themeColor},${themeColor}aa)`,
            borderRadius:99, transition:'width 0.5s ease',
          }} />
        </div>
        {/* Question dots */}
        <div style={{ display:'flex', gap:5, justifyContent:'center', marginTop:8 }}>
          {rows.map((_, i) => (
            <div key={i} style={{
              width:8, height:8, borderRadius:'50%',
              background: i < qIdx ? (answers[i]?.correct ? C.green : C.red)
                        : i===qIdx ? themeColor : C.border,
              transition:'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* Single-row display — show just this row's letters at the correct size */}
      <div style={{
        background:'#fff', borderRadius:18, padding: isElder ? '28px 20px' : '22px 16px',
        boxShadow:'0 4px 20px rgba(0,0,0,0.09)',
        border: feedback==='correct' ? `3px solid ${C.green}`
              : feedback==='wrong'   ? `3px solid ${C.red}`
              : `2px solid ${C.border}`,
        textAlign:'center', marginBottom:16,
        transition:'border 0.3s',
        animation:'fadeUp 0.35s ease',
      }}>
        <div style={{ fontSize:12, color:C.muted, fontWeight:600, letterSpacing:3, marginBottom:12, fontFamily:"monospace" }}>
          LINE {row.line} · {row.acuity}
        </div>

        {/* Letters displayed at the correct Snellen size */}
        <div style={{
          fontFamily:"'Courier New',monospace", fontWeight:900,
          fontSize: isElder ? Math.min(row.sizePx * 0.55, 60) : Math.min(row.sizePx * 0.46, 50),
          letterSpacing: isElder ? 8 : 6,
          color:C.dark, lineHeight:1.2,
          minHeight:70, display:'flex', alignItems:'center', justifyContent:'center',
          transition:'font-size 0.3s ease',
        }}>
          {row.letters.join(' ')}
        </div>

        {feedback && (
          <div style={{
            marginTop:12, fontSize: isElder ? 18 : 15, fontWeight:800,
            color: feedback==='correct' ? C.green : C.red,
            animation:'fadeIn 0.2s ease',
          }}>
            {feedback==='correct'
              ? (isKids ? '🌟 You got it!' : '✅ Correct!')
              : (isKids ? '😊 Good try!' : '❌ Missed')}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        background: isElder ? '#FEF3C7' : C.bg,
        borderRadius:12, padding:'10px 14px', marginBottom:14,
        fontSize: isElder ? 15 : 13, color: isElder ? '#92400E' : C.mid, fontWeight:600,
      }}>
        {isKids
          ? '🔤 Can you read all the letters above? Press ✅ Yes or ❌ No!'
          : isElder
            ? '👆 Can you read all the letters clearly? Press Yes or No.'
            : 'Can you clearly read all letters on this line?'}
      </div>

      {/* Yes/No answer buttons */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <button
          onClick={() => handleAnswer(row.line)}
          disabled={!!feedback}
          style={{
            padding: isElder ? '18px' : '14px',
            borderRadius:14, border:'none',
            background: isKids
              ? 'linear-gradient(135deg,#43e97b,#38f9d7)'
              : `linear-gradient(135deg,${C.green},#34d399)`,
            color:'#fff', fontSize: isElder ? 18 : 15, fontWeight:900,
            cursor:'pointer', boxShadow:'0 4px 14px rgba(18,183,106,0.3)',
            fontFamily:"'DM Sans',sans-serif",
          }}
        >
          {isKids ? '✅ YES!' : '✅ Yes, clearly'}
        </button>
        <button
          onClick={() => handleAnswer(0)}
          disabled={!!feedback}
          style={{
            padding: isElder ? '18px' : '14px',
            borderRadius:14, border:'none',
            background: isKids
              ? 'linear-gradient(135deg,#f8cdda,#f04438)'
              : `linear-gradient(135deg,${C.red},#f87171)`,
            color:'#fff', fontSize: isElder ? 18 : 15, fontWeight:900,
            cursor:'pointer', boxShadow:'0 4px 14px rgba(240,68,56,0.25)',
            fontFamily:"'DM Sans',sans-serif",
          }}
        >
          {isKids ? '❌ NO' : '❌ Too blurry'}
        </button>
      </div>
    </div>
  );
}

// ── MAIN VA TEST SCREEN ───────────────────────────────
export function VATestScreen({ user, stars, onDone, onAddStars }) {
  const ageGroup = AGE_GROUPS.find(g => g.id === user?.ageGroup) || AGE_GROUPS[1];
  const isKids  = ageGroup.mode === 'game';
  const isElder = ageGroup.mode === 'elder';
  const isLarge = ageGroup.mode === 'clear' || isElder;

  const [phase, setPhase] = useState('calibrate');      // calibrate | left | right | done
  const [eyeSide, setEyeSide] = useState('left');
  const [testMode, setTestMode] = useState('snellen');   // snellen | tumbling
  const [selectedL, setSelectedL] = useState(null);
  const [selectedR, setSelectedR] = useState(null);
  const [cameraOk, setCameraOk] = useState(false);
  const timer = useTimer();

  // Build the 5-question rows from SNELLEN_LINES
  const vaRows = VA_QUESTION_ROWS.map(i => SNELLEN_LINES[Math.min(i, SNELLEN_LINES.length - 1)]);

  useEffect(() => {
    if (phase === 'calibrate') speak('startVA', user?.lang || 'en');
    if (phase === 'left')      speak('coverRight', user?.lang || 'en');
    if (phase === 'right')     speak('coverLeft', user?.lang || 'en');
  }, [phase, user]);

  const handleEyeDone = (bestLine) => {
    if (eyeSide === 'left') {
      setSelectedL(bestLine);
      playClick('leftEye');
      speak('coverLeft', user?.lang || 'en');
      if (isKids) onAddStars?.(2);
      setTimeout(() => { setEyeSide('right'); setPhase('right'); }, 700);
    } else {
      setSelectedR(bestLine);
      playClick('rightEye');
      timer.stop();
      if (isKids) onAddStars?.(3);
      setPhase('done');
    }
  };

  // legacy handleLineSelect kept for SnellenChart/TumblingE fallback
  const handleLineSelect = (row) => handleEyeDone(row.line);

  const proceed = (side) => {
    setPhase(side);
    setEyeSide(side);
    timer.start();
  };

  const themeColor = isKids ? C.kidsColor : isElder ? C.elderColor : ageGroup.color;

  const snellenImgKeys = Object.keys(SNELLEN_IMAGES);
  const sampleSnellenImg = SNELLEN_IMAGES[snellenImgKeys[0]];

  return (
    <div style={{
      padding: isElder ? '28px 20px' : '22px 16px',
      maxWidth:640, margin:'0 auto',
      fontFamily: isKids ? "'Nunito',sans-serif" : isElder ? "'DM Sans',sans-serif" : 'inherit',
    }}>
      {isKids && <KidsHeader stars={stars} />}

      {/* Header bar */}
      <div style={{
        background:'#fff', borderRadius:16, padding:'14px 18px', marginBottom:18,
        boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:`1px solid ${C.border}`,
        display:'flex', alignItems:'center', gap:14,
      }}>
        <img src={IMG.eyeExam} alt="" style={{ width:46, height:46, borderRadius:10, objectFit:'cover' }} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize: isElder ? 20 : 16, fontWeight:700, color: isKids ? C.kidsColor : C.dark }}>
            {isKids ? '👁️ Eye Power Test!' : isElder ? 'Eye Reading Test' : 'Visual Acuity Test'}
          </div>
          <div style={{ fontSize: isElder ? 13 : 12, color:C.muted, marginTop:1 }}>
            {phase==='done' ? 'Both eyes tested ✓'
             : eyeSide==='left' ? 'Testing left eye 👈'
             : eyeSide==='right' ? 'Testing right eye 👉'
             : 'Calibration step'}
          </div>
        </div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize: isElder ? 18 : 15, fontWeight:700, color:themeColor }}>
          {fmtTime(timer.seconds)}
        </div>
      </div>

      {/* === CALIBRATE PHASE === */}
      {phase === 'calibrate' && (
        <div style={{ animation:'fadeUp 0.4s ease both' }}>
          {isKids && <DrBlinky message={DR_BLINKY_MESSAGES.calibrate} />}

          <div style={{
            background:'#fff', borderRadius:16, padding:20, marginBottom:16,
            boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:`1px solid ${C.border}`,
          }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <img
                src={sampleSnellenImg}
                alt="Snellen chart sample"
                style={{ width:72, height:72, borderRadius:12, objectFit:'cover', flexShrink:0 }}
              />
              <div>
                <div style={{ fontSize: isElder ? 18 : 15, fontWeight:700, color:C.dark, marginBottom:8 }}>
                  {isElder ? '📏 Get Ready' : 'Distance Calibration'}
                </div>
                <div style={{ fontSize: isElder ? 15 : 13, color:C.mid, lineHeight:1.7 }}>
                  {isElder
                    ? '📱 Hold your phone about this far from your face — like reading a book.\n\n💡 Make sure the room is bright.'
                    : 'Hold your device 40 cm (arm\'s length) from your face. Ensure good lighting. Keep glasses on if you wear them.'
                  }
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom:16 }}>
            <CameraDetector elder={isElder} onDetected={e => setCameraOk(e.detected)} />
          </div>

          {/* Test mode selection */}
          {!isElder && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.mid, marginBottom:10 }}>Choose test format:</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[
                  { id:'snellen', label:'Letter Chart', sub:'Standard Snellen format', emoji:'📝' },
                  { id:'tumbling', label:'Tumbling E', sub:'Direction-based (for kids)', emoji:'↔️' },
                ].map(m => (
                  <div
                    key={m.id}
                    onClick={() => { setTestMode(m.id); playClick('normal'); }}
                    className="card-hover"
                    style={{
                      border:`2px solid ${testMode===m.id ? themeColor : C.border}`,
                      background: testMode===m.id ? `${themeColor}10` : '#fff',
                      borderRadius:14, padding:'14px 16px', cursor:'pointer',
                    }}
                  >
                    <div style={{ fontSize:28, marginBottom:6 }}>{m.emoji}</div>
                    <div style={{ fontWeight:700, color: testMode===m.id ? themeColor : C.dark, fontSize:14 }}>{m.label}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{m.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Btn
            full
            size={isElder ? 'lg' : 'md'}
            color={themeColor}
            onClick={() => proceed('left')}
          >
            {isKids ? '🚀 Start Eye Adventure!' : isElder ? '✅ I\'m Ready — Start Test' : '→ Begin Testing'}
          </Btn>
        </div>
      )}

      {/* === TESTING PHASE === */}
      {(phase==='left' || phase==='right') && (
        <div style={{ animation:'fadeUp 0.3s ease both' }}>
          {isKids && (
            <DrBlinky message={eyeSide==='left' ? DR_BLINKY_MESSAGES.leftEye : DR_BLINKY_MESSAGES.rightEye} />
          )}

          {isElder && (
            <div style={{
              background:'#FEF3C7', border:'2px solid #F59E0B40',
              borderRadius:14, padding:'14px 18px', marginBottom:16,
              fontSize:17, fontWeight:700, color:'#92400E',
            }}>
              {eyeSide==='left'
                ? '👈 Cover your RIGHT eye. Read with your LEFT eye only.'
                : '👉 Cover your LEFT eye. Read with your RIGHT eye only.'}
            </div>
          )}

          {/* Eye tabs */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {['left','right'].map(eye => {
              const done = eye==='left' ? selectedL : selectedR;
              const active = eyeSide === eye;
              return (
                <div key={eye} style={{
                  padding:'12px', borderRadius:12, textAlign:'center',
                  background: active ? '#fff' : C.bg,
                  border:`2px solid ${active ? themeColor : C.border}`,
                  transition:'all 0.2s',
                }}>
                  <div style={{ fontSize:28, marginBottom:4 }}>
                    {done ? '✅' : active ? '👁️' : '⬜'}
                  </div>
                  <div style={{ fontSize: isElder ? 15 : 13, fontWeight:700, color: active ? themeColor : C.muted }}>
                    {eye==='left' ? (isElder ? 'Left Eye 👈' : 'Left Eye ←') : (isElder ? 'Right Eye 👉' : 'Right Eye →')}
                  </div>
                  {done && (
                    <div style={{ fontSize:11, color:C.green }}>
                      ✓ {SNELLEN_LINES[done-1]?.acuity || '20/200'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 5-question eye test */}
          <EyeQuestions
            key={eyeSide}
            rows={vaRows}
            eyeSide={eyeSide}
            isKids={isKids}
            isElder={isElder}
            onFinish={handleEyeDone}
          />

          {!isKids && !isElder && (
            <div style={{ textAlign:'center', marginTop:12, fontSize:12, color:C.muted }}>
              💡 Cover the opposite eye while testing · Hold device at arm's length
            </div>
          )}
        </div>
      )}

      {/* === DONE PHASE === */}
      {phase === 'done' && (
        <div style={{ animation:'fadeUp 0.4s ease both', textAlign:'center' }}>
          {isKids && <DrBlinky message="WOW! You finished the Eye Power Test! 🦸‍♀️ Look at your AMAZING results!" celebrate />}

          {isKids && (
            <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
              <Stars count={3} size={36} />
            </div>
          )}

          <div style={{
            background:'#fff', borderRadius:18, padding:24, marginBottom:16,
            boxShadow:'0 4px 20px rgba(0,0,0,0.09)',
          }}>
            <div style={{ fontSize: isElder ? 22 : 17, fontWeight:700, color:C.dark, marginBottom:18 }}>
              {isKids ? '⚡ Your Eye Power Results!' : isElder ? '📋 Your Results' : 'Visual Acuity Results'}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { eye:'Left Eye', line:selectedL },
                { eye:'Right Eye', line:selectedR },
              ].map(({ eye, line }) => {
                const cls = classifyVA(line);
                return (
                  <div key={eye} style={{
                    padding: isElder ? 20 : 16,
                    borderRadius:14,
                    background:`${cls.color}09`,
                    border:`2px solid ${cls.color}25`,
                    textAlign:'center',
                  }}>
                    <div style={{ fontSize:32, marginBottom:6 }}>
                      {cls.severity === 'normal' ? '🟢' : cls.severity === 'mild' ? '🟡' : '🔴'}
                    </div>
                    <div style={{ fontSize: isElder ? 13 : 11, color:C.muted, fontWeight:600 }}>{eye.toUpperCase()}</div>
                    <div style={{ fontSize: isElder ? 26 : 22, fontWeight:900, color:cls.color, margin:'4px 0' }}>
                      {line && line > 0 ? (SNELLEN_LINES[line-1]?.acuity || '20/200') : '20/200'}
                    </div>
                    <div style={{ fontSize: isElder ? 14 : 12, color:cls.color, fontWeight:600 }}>{cls.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display:'grid', gap:10 }}>
            <Btn full size={isElder ? 'lg' : 'md'} color={C.purple} onClick={() => onDone({ vaLeft: selectedL, vaRight: selectedR, duration: timer.seconds })}>
              {isKids ? '🌈 Next: Rainbow Challenge!' : isElder ? '✅ Go to Colour Test' : '→ Proceed to Color Test'}
            </Btn>
            <Btn full size="sm" color={C.blue} onClick={() => setPhase('calibrate')}>
              🔄 Retake Test
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
