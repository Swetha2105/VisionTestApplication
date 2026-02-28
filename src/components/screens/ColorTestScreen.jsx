import { useState, useEffect, useMemo } from 'react';
import { C, ISHIHARA_PLATES, AGE_GROUPS, DR_BLINKY_MESSAGES } from '../../data/constants';
import { classifyColor } from '../../data/constants';
import { speak, playClick, fmtTime } from '../../utils/helpers';
import { useTimer } from '../../hooks/useTimer';
import { Btn, OutlineBtn } from '../ui/Btn';
import { ProgressBar } from '../ui/ProgressBar';
import { DrBlinky } from '../game/DrBlinky';
import { KidsHeader } from '../game/KidsHeader';
import { Stars } from '../ui/Stars';
import { Confetti, Balloons } from '../ui/Confetti';

// ── Fisher-Yates shuffle ──────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── KIDS GAME: Tap-to-Match colour bubbles ─────────────
function KidsGamePlate({ plate, onAnswer, feedback }) {
  const [pop, setPop] = useState(null);
  const [shake, setShake] = useState(false);

  const handlePick = (opt) => {
    if (feedback) return;
    setPop(opt);
    const correct = opt === plate.answer;
    if (!correct) { setShake(true); setTimeout(() => setShake(false), 500); }
    setTimeout(() => { setPop(null); onAnswer(opt); }, 300);
  };

  const BUBBLE_COLORS = [
    ['#FF6B9D','#FF8E9E'],
    ['#FFB347','#FFCC70'],
    ['#4FC3F7','#81D4FA'],
    ['#81C784','#A5D6A7'],
  ];

  return (
    <div style={{ textAlign:'center' }}>
      {/* Spinning rainbow ring around plate */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
        <div style={{
          borderRadius:'50%', padding:6,
          background: feedback==='correct'
            ? 'linear-gradient(135deg,#a8edea,#fed6e3)'
            : feedback==='wrong'
              ? 'linear-gradient(135deg,#f8cdda,#f04438)'
              : 'conic-gradient(#f093fb,#f5576c,#4facfe,#00f2fe,#43e97b,#f5576c,#f093fb)',
          animation: feedback ? 'none' : 'spin 3s linear infinite',
          boxShadow:'0 0 32px rgba(240,147,251,0.5)',
        }}>
          <img
            src={plate.image}
            alt="Ishihara plate"
            crossOrigin="anonymous"
            style={{
              width:210, height:210, borderRadius:'50%',
              display:'block', objectFit:'cover',
              border:'5px solid #fff',
              animation: shake ? 'shake 0.4s ease' : 'none',
            }}
          />
        </div>
      </div>

      {/* Fun question bubble */}
      <div style={{
        background:'linear-gradient(135deg,#667eea,#764ba2)',
        borderRadius:20, padding:'12px 20px', marginBottom:18,
        color:'#fff', fontFamily:"'Nunito',sans-serif",
        fontSize:15, fontWeight:800,
        boxShadow:'0 4px 16px rgba(102,126,234,0.35)',
      }}>
        {plate.kidsQuestion}
      </div>

      {/* Colourful bubble buttons — mixed letters & numbers, shuffled */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:300, margin:'0 auto' }}>
        {plate.shuffledOptions.map((opt, i) => {
          const [c1, c2] = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
          return (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              disabled={!!feedback}
              style={{
                padding:'18px 10px',
                borderRadius:20,
                border:'3px solid transparent',
                background: pop===opt ? '#fff' : `linear-gradient(135deg,${c1},${c2})`,
                color: pop===opt ? c1 : '#fff',
                fontSize:22, fontWeight:900,
                fontFamily:"'Nunito',sans-serif",
                cursor:'pointer',
                transform: pop===opt ? 'scale(1.12)' : 'scale(1)',
                transition:'all 0.2s ease',
                boxShadow: `0 4px 14px ${c1}66`,
                letterSpacing:1,
              }}
            >
              {opt === 'None' ? '🚫' : opt}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div style={{
          marginTop:16, fontSize:28, fontWeight:900,
          animation:'zoomIn 0.25s ease',
          color: feedback==='correct' ? '#12B76A' : '#F04438',
        }}>
          {feedback==='correct' ? '🎉 AMAZING!' : '😅 Good try!'}
        </div>
      )}
    </div>
  );
}

// ── STANDARD / ELDER PLATE ────────────────────────────
function StandardPlate({ plate, onAnswer, feedback, isElder }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom: isElder ? 24 : 18 }}>
        <img
          src={plate.image}
          alt="Ishihara colour plate"
          crossOrigin="anonymous"
          style={{
            width: isElder ? 280 : 250, height: isElder ? 280 : 250,
            borderRadius:'50%', objectFit:'cover',
            border: feedback==='correct' ? `4px solid ${C.green}`
                  : feedback==='wrong'   ? `4px solid ${C.red}`
                  : '3px solid #e0e0e0',
            boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
            transition:'border 0.3s',
          }}
        />
      </div>

      {feedback && (
        <div style={{
          fontSize: isElder ? 20 : 16, fontWeight:800,
          color: feedback==='correct' ? C.green : C.red,
          animation:'fadeIn 0.2s ease', marginBottom:12,
        }}>
          {feedback==='correct' ? '✅ Correct!' : '❌ Incorrect'}
        </div>
      )}

      <div style={{ fontSize: isElder ? 17 : 14, fontWeight:700, color:C.dark, marginBottom:14 }}>
        {isElder ? '👆 Press the option you can see:' : plate.question}
      </div>

      {/* Options grid — shuffled mix of letters & numbers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: isElder ? 10 : 8, maxWidth:340, margin:'0 auto' }}>
        {plate.shuffledOptions.map(opt => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            disabled={!!feedback}
            style={{
              padding: isElder ? '16px 0' : '13px 0',
              borderRadius:12, border:`2px solid ${C.border}`,
              background:'#fff', fontSize: isElder ? 20 : 17,
              fontWeight:800, color: opt==='None' ? C.muted : C.dark,
              cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
              transition:'background 0.15s',
            }}
          >
            {opt === 'None' ? (isElder ? "Can't\nsee" : '–') : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── MAIN COLOR TEST SCREEN ────────────────────────────
export function ColorTestScreen({ user, stars, onDone, onAddStars }) {
  const ageGroup = AGE_GROUPS.find(g => g.id === user?.ageGroup) || AGE_GROUPS[1];
  const isKids  = ageGroup.mode === 'game';
  const isElder = ageGroup.mode === 'elder';
  const timer   = useTimer();

  // ── Build shuffled plates ONCE per session ──────────
  // Options are shuffled so they appear in random order (not sequential)
  // The mix of letters and numbers from the dataset makes them naturally mixed
  const SHUFFLED_PLATES = useMemo(() => {
    return shuffle(ISHIHARA_PLATES).map(p => ({
      ...p,
      shuffledOptions: shuffle(p.options),
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [plateIdx, setPlateIdx]           = useState(0);
  const [answers, setAnswers]             = useState([]);
  const [errors, setErrors]               = useState(0);
  const [feedback, setFeedback]           = useState(null);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const [done, setDone]                   = useState(false);
  const [streakCount, setStreakCount]     = useState(0);
  const [showStreak, setShowStreak]       = useState(false);

  const plate      = SHUFFLED_PLATES[plateIdx];
  const themeColor = isKids ? '#f093fb' : isElder ? C.elderColor : '#9333EA';

  useEffect(() => {
    timer.start();
    if (!isKids) speak('colorStart', user?.lang || 'en');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (opt) => {
    if (feedback) return;
    const correct = opt === plate.answer;
    playClick(correct ? 'success' : 'colorClick');
    setFeedback(correct ? 'correct' : 'wrong');

    if (!correct) {
      setErrors(e => e + 1);
      setStreakCount(0);
    } else {
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      if (isKids && newStreak >= 3) {
        setShowStreak(true);
        setTimeout(() => setShowStreak(false), 1600);
      }
    }
    setAnswers(a => [...a, { id: plate.id, answer: opt, correct, plateAnswer: plate.answer }]);

    setTimeout(() => {
      setFeedback(null);
      if (plateIdx < SHUFFLED_PLATES.length - 1) {
        setPlateIdx(i => i + 1);
        if (isKids && correct) onAddStars?.(1);
      } else {
        timer.stop();
        if (isKids) {
          onAddStars?.(errors < 3 ? 5 : errors < 6 ? 3 : 1);
          setShowCelebrate(true);
          playClick('fanfare');
        }
        setDone(true);
      }
    }, isKids ? 1100 : 900);
  };

  // ── RESULTS SCREEN ─────────────────────────────────
  if (done) {
    const correct = SHUFFLED_PLATES.length - errors;
    const cls     = classifyColor(errors);

    return (
      <div style={{ padding: isElder ? '28px 20px' : '22px 16px', maxWidth:600, margin:'0 auto' }}>
        {showCelebrate && <Confetti count={80} />}
        {showCelebrate && <Balloons count={8} />}

        {isKids && (
          <>
            <KidsHeader stars={stars} />
            <DrBlinky message={DR_BLINKY_MESSAGES.complete} celebrate />
            <div style={{ display:'flex', justifyContent:'center', marginBottom:18 }}>
              <Stars count={errors < 3 ? 5 : errors < 6 ? 4 : 3} size={40} />
            </div>
          </>
        )}

        <div style={{
          background:'#fff', borderRadius:20, padding: isElder ? 28 : 24,
          boxShadow:'0 4px 20px rgba(0,0,0,0.09)', marginBottom:16,
          animation:'zoomIn 0.5s ease both',
        }}>
          <div style={{ fontSize: isElder ? 24 : 18, fontWeight:800, color:C.dark, marginBottom:20, textAlign:'center' }}>
            {isKids ? '🌈 Rainbow Challenge — Results!' : isElder ? '📋 Colour Vision Results' : 'Color Vision Results'}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
            {[
              { label:'Correct', val:correct, color:C.green },
              { label:'Errors',  val:errors,  color:C.red },
              { label:'Score',   val:`${Math.round((correct/SHUFFLED_PLATES.length)*100)}%`, color:cls.color },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center', padding:14, background:C.bg, borderRadius:12 }}>
                <div style={{ fontSize: isElder ? 28 : 22, fontWeight:900, color:s.color }}>{s.val}</div>
                <div style={{ fontSize: isElder ? 13 : 11, color:C.muted, fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <ProgressBar value={correct} max={SHUFFLED_PLATES.length} color={cls.color} label="Accuracy" />

          <div style={{
            marginTop:16, padding:'14px 16px',
            background:`${cls.color}0a`, border:`1.5px solid ${cls.color}28`,
            borderRadius:12, textAlign:'center',
          }}>
            <div style={{ fontWeight:700, fontSize: isElder ? 16 : 14, color:cls.color }}>{cls.type}</div>
            <div style={{ fontSize: isElder ? 13 : 12, color:C.muted, marginTop:4 }}>Severity: {cls.severity}</div>
          </div>

          {/* Per-plate answer dots */}
          <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap', marginTop:16 }}>
            {answers.map((a, i) => (
              <div
                key={i}
                title={`Plate ${i+1}: answered "${a.answer}" (correct: "${a.plateAnswer}")`}
                style={{
                  width:30, height:30, borderRadius:'50%',
                  background: a.correct ? C.green : C.red,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#fff', fontSize:10, fontWeight:700,
                }}
              >
                {a.answer}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gap:10 }}>
          <Btn full size={isElder ? 'lg' : 'md'} color={C.green}
            onClick={() => onDone({ colorErrors: errors, colorAnswers: answers, duration: timer.seconds })}>
            {isKids ? '🏆 See My Report!' : isElder ? '📊 View Full Results' : '→ View Complete Report'}
          </Btn>
          <OutlineBtn full onClick={() => {
            setDone(false); setPlateIdx(0); setErrors(0); setAnswers([]);
            setFeedback(null); setStreakCount(0); timer.reset(); timer.start();
          }}>
            🔄 Retake Color Test
          </OutlineBtn>
        </div>

        <style>{`
          @keyframes zoomIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        `}</style>
      </div>
    );
  }

  // ── KIDS GAME MODE ───────────────────────────────────
  if (isKids) {
    return (
      <div style={{
        padding:'16px', maxWidth:500, margin:'0 auto',
        fontFamily:"'Nunito',sans-serif",
        background:'linear-gradient(180deg,#f8f0ff 0%,#fff5fb 100%)',
        minHeight:'100vh',
      }}>
        <KidsHeader stars={stars} />
        <DrBlinky message={DR_BLINKY_MESSAGES.colorStart} />

        {/* XP progress header */}
        <div style={{
          background:'#fff', borderRadius:16, padding:'10px 16px', marginBottom:14,
          boxShadow:'0 2px 12px rgba(240,147,251,0.2)',
          border:'2px solid #f093fb33',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{ fontSize:22 }}>🌈</span>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:13, fontWeight:800, color:'#764ba2' }}>Rainbow Challenge</span>
              <span style={{ fontSize:13, fontWeight:700, color:C.muted }}>{plateIdx + 1} / {SHUFFLED_PLATES.length}</span>
            </div>
            <div style={{ height:10, background:'#f3e8ff', borderRadius:99, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:99,
                width:`${(plateIdx / SHUFFLED_PLATES.length) * 100}%`,
                background:'linear-gradient(90deg,#f093fb,#f5576c)',
                transition:'width 0.6s ease',
              }} />
            </div>
          </div>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:'#764ba2' }}>
            {fmtTime(timer.seconds)}
          </span>
        </div>

        {/* Streak banner */}
        {showStreak && (
          <div style={{
            background:'linear-gradient(135deg,#FFD700,#FF8C00)',
            borderRadius:16, padding:'10px 20px', marginBottom:12,
            textAlign:'center', fontSize:18, fontWeight:900, color:'#fff',
            animation:'zoomIn 0.3s ease', boxShadow:'0 4px 20px rgba(255,165,0,0.5)',
          }}>
            🔥 {streakCount} in a row! HOT STREAK! 🔥
          </div>
        )}

        {/* Game card */}
        <div style={{
          background:'#fff', borderRadius:24, padding:20,
          boxShadow:'0 8px 32px rgba(240,147,251,0.15)',
          border:'2px solid #f093fb22', marginBottom:14,
        }}>
          <KidsGamePlate plate={plate} onAnswer={handleAnswer} feedback={feedback} />
        </div>

        {/* Dot tracker */}
        <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap' }}>
          {SHUFFLED_PLATES.map((p, i) => (
            <div key={p.id} style={{
              width:12, height:12, borderRadius:'50%',
              background:
                i < plateIdx ? (answers[i]?.correct ? C.green : C.red)
                : i===plateIdx ? '#f093fb'
                : '#f3e8ff',
              transition:'all 0.3s',
              boxShadow: i===plateIdx ? '0 0 10px #f093fb88' : 'none',
            }} />
          ))}
        </div>

        <div style={{ textAlign:'center', marginTop:12, fontSize:14, color:'#764ba2', fontWeight:700 }}>
          {plateIdx < 4 ? "⭐ You're doing GREAT!" :
           plateIdx < 7 ? '💫 Halfway — you\'re amazing!' :
                          '🚀 Almost done! Finish strong!'}
        </div>

        <style>{`
          @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
          @keyframes zoomIn{from{transform:scale(0.6);opacity:0}to{transform:scale(1);opacity:1}}
          @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}
        `}</style>
      </div>
    );
  }

  // ── STANDARD / ELDER MODE ────────────────────────────
  return (
    <div style={{
      padding: isElder ? '28px 20px' : '22px 16px', maxWidth:580, margin:'0 auto',
      background: isElder ? 'linear-gradient(160deg,#fff8ee,#fff)' : undefined,
      minHeight: isElder ? '100vh' : undefined,
    }}>
      {/* Header */}
      <div style={{
        background:'#fff', borderRadius:16, padding:'14px 18px', marginBottom:18,
        boxShadow:'0 2px 12px rgba(0,0,0,0.07)', border:`1px solid ${C.border}`,
        display:'flex', alignItems:'center', gap:14,
      }}>
        <div style={{
          width:46, height:46, borderRadius:10, flexShrink:0,
          background:'linear-gradient(135deg,#f093fb,#f5576c)',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:26,
        }}>🌈</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize: isElder ? 18 : 15, fontWeight:700, color:C.dark }}>
            {isElder ? 'Colour Vision Test' : 'Color Blindness Test'}
          </div>
          <ProgressBar value={plateIdx} max={SHUFFLED_PLATES.length} color={themeColor} height={5} />
          <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>
            Plate {plateIdx + 1} of {SHUFFLED_PLATES.length}
          </div>
        </div>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:700, color:themeColor }}>
          {fmtTime(timer.seconds)}
        </div>
      </div>

      {isElder && (
        <div style={{
          background:'#FEF3C7', border:'2px solid #F59E0B30',
          borderRadius:14, padding:'14px 18px', marginBottom:16,
          fontSize:16, color:'#92400E', fontWeight:600, lineHeight:1.7,
        }}>
          🎨 Look at the colourful circle below. Can you see a <strong>number or letter</strong> hidden inside it?
          Press the option you see, or "Can't see".
        </div>
      )}

      {/* Plate card */}
      <div style={{
        background:'#fff', borderRadius:20, padding: isElder ? 28 : 22,
        boxShadow:'0 4px 20px rgba(0,0,0,0.09)', marginBottom:16,
        border: feedback==='correct' ? `3px solid ${C.green}`
              : feedback==='wrong'   ? `3px solid ${C.red}`
              : `1.5px solid ${C.border}`,
        transition:'border 0.3s',
      }}>
        <StandardPlate plate={plate} onAnswer={handleAnswer} feedback={feedback} isElder={isElder} />
      </div>

      {/* Dot progress */}
      <div style={{ display:'flex', gap:5, justifyContent:'center', flexWrap:'wrap' }}>
        {SHUFFLED_PLATES.map((p, i) => (
          <div key={p.id} style={{
            width:10, height:10, borderRadius:'50%',
            background:
              i < plateIdx ? (answers[i]?.correct ? C.green : C.red)
              : i===plateIdx ? themeColor
              : C.border,
            transition:'all 0.3s',
            boxShadow: i===plateIdx ? `0 0 8px ${themeColor}88` : 'none',
          }} />
        ))}
      </div>

      {!isElder && (
        <div style={{ textAlign:'center', marginTop:12, fontSize:12, color:C.muted }}>
          💡 {plate.hint}
        </div>
      )}

      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}
