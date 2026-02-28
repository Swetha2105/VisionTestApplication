import { useRef } from 'react';
import { C, IMG, AGE_GROUPS, SNELLEN_LINES } from '../../data/constants';
import { classifyVA, classifyColor } from '../../data/constants';
import { fmtDate, saveReport } from '../../utils/helpers';
import { Btn, OutlineBtn } from '../ui/Btn';
import { ProgressBar } from '../ui/ProgressBar';
import { Stars } from '../ui/Stars';
import { Confetti, Balloons } from '../ui/Confetti';

// ── Load jsPDF dynamically via CDN ────────────────────
async function loadJsPDF() {
  if (window.jspdf) return window.jspdf.jsPDF;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function ReportScreen({ user, testData, onRetakeVA, onRetakeColor, onHome }) {
  const ageGroup = AGE_GROUPS.find(g => g.id === user?.ageGroup) || AGE_GROUPS[1];
  const isKids  = ageGroup.mode === 'game';
  const isElder = ageGroup.mode === 'elder';

  const vaL = classifyVA(testData?.vaLeft);
  const vaR = classifyVA(testData?.vaRight);
  const col = classifyColor(testData?.colorErrors || 0);
  const correct = 10 - (testData?.colorErrors || 0);
  const score   = Math.round((correct / 10) * 100);
  const reportId = useRef('RPT-' + Math.random().toString(36).slice(2, 9).toUpperCase()).current;

  // ── PDF Generation ─────────────────────────────────
  const handleDownloadPDF = async () => {
    try {
      const JsPDF = await loadJsPDF();
      const doc = new JsPDF({ unit: 'mm', format: 'a4' });
      const W = 210; // A4 width mm
      const MARGIN = 16;
      let y = 0;

      // ── Header bar ──────────────────────────────────
      doc.setFillColor(27, 79, 138);
      doc.rect(0, 0, W, 38, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('VisionAI', MARGIN, 16);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Smart Eye Screening System', MARGIN, 23);
      doc.setFontSize(9);
      doc.text(`Report ID: ${reportId}`, MARGIN, 30);
      doc.text(`Date: ${fmtDate()}`, W - MARGIN - 40, 30);
      y = 48;

      // ── Patient info box ─────────────────────────────
      doc.setFillColor(240, 244, 248);
      doc.roundedRect(MARGIN, y, W - MARGIN * 2, 28, 3, 3, 'F');
      doc.setTextColor(52, 64, 84);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('PATIENT INFORMATION', MARGIN + 4, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Name: ${user?.name || '—'}`, MARGIN + 4, y + 16);
      doc.text(`Age: ${user?.age || '—'} years`, MARGIN + 60, y + 16);
      doc.text(`Gender: ${user?.gender || '—'}`, MARGIN + 100, y + 16);
      doc.text(`Contact: ${user?.contact || '—'}`, MARGIN + 4, y + 23);
      doc.text(`Age Group: ${ageGroup.label} (${ageGroup.range})`, MARGIN + 60, y + 23);
      y += 38;

      // ── Visual Acuity Section ────────────────────────
      doc.setFillColor(44, 123, 229);
      doc.rect(MARGIN, y, 4, 10, 'F');
      doc.setTextColor(13, 27, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('VISUAL ACUITY ASSESSMENT', MARGIN + 8, y + 7);
      y += 16;

      // Eye result boxes
      const eyeData = [
        { label: 'LEFT EYE', cls: vaL, line: testData?.vaLeft },
        { label: 'RIGHT EYE', cls: vaR, line: testData?.vaRight },
      ];
      eyeData.forEach((e, i) => {
        const x = MARGIN + i * 88;
        const boxW = 82;
        // Colour strip
        const rgb = hexToRgb(e.cls.color);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.roundedRect(x, y, boxW, 5, 1, 1, 'F');
        doc.setFillColor(252, 252, 254);
        doc.roundedRect(x, y + 5, boxW, 40, 2, 2, 'F');
        doc.setDrawColor(...hexToArr(e.cls.color));
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, boxW, 45, 2, 2, 'S');

        doc.setTextColor(...hexToArr(C.muted));
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(e.label, x + 4, y + 13);

        doc.setTextColor(...hexToArr(e.cls.color));
        doc.setFontSize(20);
        doc.text(e.line ? (SNELLEN_LINES[e.line - 1]?.acuity || 'N/A') : 'N/A', x + 4, y + 26);

        doc.setFontSize(9);
        doc.text(e.cls.label, x + 4, y + 34);

        doc.setTextColor(...hexToArr(C.muted));
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(e.cls.disorder, x + 4, y + 41);
      });
      y += 54;

      // Recommendation box
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(MARGIN, y, W - MARGIN * 2, 22, 3, 3, 'F');
      doc.setTextColor(27, 79, 138);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('RECOMMENDATION:', MARGIN + 4, y + 7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(52, 64, 84);
      doc.text(vaL.recommendation || 'No specific recommendation', MARGIN + 4, y + 14);
      doc.text(`Consult: ${vaL.specialist || vaR.specialist}`, MARGIN + 100, y + 14);
      y += 30;

      // ── Color Vision Section ─────────────────────────
      doc.setFillColor(147, 51, 234);
      doc.rect(MARGIN, y, 4, 10, 'F');
      doc.setTextColor(13, 27, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('COLOUR VISION ASSESSMENT', MARGIN + 8, y + 7);
      y += 16;

      // 3 stat boxes
      const stats = [
        { label: 'Correct', val: correct.toString(), color: C.green },
        { label: 'Errors',  val: (testData?.colorErrors || 0).toString(), color: C.red },
        { label: 'Score',   val: `${score}%`, color: col.color },
      ];
      stats.forEach((s, i) => {
        const x = MARGIN + i * 58;
        doc.setFillColor(240, 244, 248);
        doc.roundedRect(x, y, 54, 22, 3, 3, 'F');
        doc.setTextColor(...hexToArr(s.color));
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(s.val, x + 4, y + 14);
        doc.setTextColor(...hexToArr(C.muted));
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(s.label, x + 4, y + 20);
      });
      y += 30;

      // Color progress bar
      doc.setFillColor(232, 237, 242);
      doc.roundedRect(MARGIN, y, W - MARGIN * 2, 5, 2, 2, 'F');
      const barW = (correct / 10) * (W - MARGIN * 2);
      const colRgb = hexToRgb(col.color);
      doc.setFillColor(colRgb.r, colRgb.g, colRgb.b);
      doc.roundedRect(MARGIN, y, barW, 5, 2, 2, 'F');
      y += 12;

      doc.setFillColor(...hexToArr(col.color, 12));
      doc.roundedRect(MARGIN, y, W - MARGIN * 2, 14, 3, 3, 'F');
      doc.setTextColor(...hexToArr(col.color));
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(col.type, MARGIN + 4, y + 9);
      doc.setTextColor(...hexToArr(C.muted));
      doc.setFont('helvetica', 'normal');
      doc.text(`Severity: ${col.severity}`, MARGIN + 80, y + 9);
      y += 24;

      // ── AI Suggestions ───────────────────────────────
      doc.setFillColor(18, 183, 106);
      doc.rect(MARGIN, y, 4, 10, 'F');
      doc.setTextColor(13, 27, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('AI HEALTH SUGGESTIONS', MARGIN + 8, y + 7);
      y += 16;

      const tips = [
        vaL.severity !== 'normal' || vaR.severity !== 'normal'
          ? 'Corrective glasses or contact lenses are recommended. Visit an optometrist soon.'
          : 'Your vision is within normal limits. Maintain annual eye checkups.',
        'Follow the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds.',
        'Eat foods rich in Vitamin A — carrots, leafy greens, and fish support eye health.',
        'Get 7-8 hours of sleep nightly. Rest is essential for eye recovery.',
        'Wear UV-protective sunglasses outdoors to prevent long-term damage.',
      ];
      tips.forEach(tip => {
        doc.setFillColor(240, 244, 248);
        doc.roundedRect(MARGIN, y, W - MARGIN * 2, 10, 2, 2, 'F');
        doc.setTextColor(52, 64, 84);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.text(`• ${tip}`, MARGIN + 4, y + 7, { maxWidth: W - MARGIN * 2 - 8 });
        y += 13;
      });

      // ── Answer dots ──────────────────────────────────
      if (testData?.colorAnswers?.length) {
        y += 4;
        doc.setTextColor(...hexToArr(C.muted));
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Plate-by-plate responses:', MARGIN, y);
        y += 7;
        testData.colorAnswers.forEach((a, i) => {
          const x = MARGIN + (i % 10) * 18;
          if (i === 10) y += 12;
          const rgb2 = hexToRgb(a.correct ? C.green : C.red);
          doc.setFillColor(rgb2.r, rgb2.g, rgb2.b);
          doc.circle(x + 4, y + 3, 4, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text(a.answer, x + 2, y + 5);
        });
        y += 16;
      }

      // ── Footer ───────────────────────────────────────
      doc.setFillColor(27, 79, 138);
      doc.rect(0, 287, W, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'Disclaimer: This AI-generated report is for preliminary screening only. Consult a licensed ophthalmologist for clinical diagnosis.',
        MARGIN, 293
      );
      doc.text(`VisionAI · ${reportId} · ${fmtDate()}`, W - MARGIN - 60, 293);

      // ── Save ─────────────────────────────────────────
      saveReport({ ...testData, userId: user?.id, name: user?.name, reportId }, user?.id || 'global');
      doc.save(`VisionAI_Report_${reportId}.pdf`);

    } catch (err) {
      console.error('PDF error:', err);
      alert('PDF generation failed. Make sure you are online for the first download.\n\nError: ' + err.message);
    }
  };

  // ── Helpers ─────────────────────────────────────────
  function hexToRgb(hex = '#888') {
    const n = parseInt(hex.replace('#',''), 16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  }
  function hexToArr(hex = '#888', alpha) {
    const { r, g, b } = hexToRgb(hex);
    return [r, g, b];
  }

  const SevBadge = ({ cls }) => (
    <span style={{ padding:'3px 12px', borderRadius:20, fontSize:11, fontWeight:700, background:`${cls.color}18`, color:cls.color }}>
      {cls.severity || cls.label}
    </span>
  );

  return (
    <div style={{ padding: isElder ? '28px 20px' : '22px 16px', maxWidth:700, margin:'0 auto' }}>
      {isKids && <Confetti count={40} />}
      {isKids && <Balloons count={6} />}

      {/* ── Report Banner with eye image ─────────────── */}
      <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,0.14)', marginBottom:20, animation:'fadeUp 0.4s ease both' }}>
        <div style={{ position:'relative', height: isElder ? 140 : 115 }}>
          <img
            src={IMG.retina} alt=""
            crossOrigin="anonymous"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.22) saturate(1.5)' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(13,27,42,0.9),rgba(44,123,229,0.55))' }} />
          <div style={{ position:'absolute', inset:0, padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize: isElder ? 26 : 22, fontWeight:700, color:'#fff' }}>
                {isKids ? '🏆 Your Eye Report!' : isElder ? '📋 Vision Test Results' : 'Vision Screening Report'}
              </div>
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize: isElder ? 14 : 12, marginTop:4 }}>
                {user?.name} · {fmtDate()} · {reportId}
              </div>
            </div>
            <img
              src={IMG.eyeClose} alt=""
              crossOrigin="anonymous"
              style={{ width:54, height:54, borderRadius:'50%', objectFit:'cover', opacity:0.7, border:'2px solid rgba(255,255,255,0.3)' }}
              onError={e => { e.target.style.display='none'; }}
            />
          </div>
        </div>
        <div style={{ background:'#fff', padding:'16px 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {[
              { k:'Name',   v: user?.name || '—' },
              { k:'Age',    v: user?.age ? `${user.age} years` : '—' },
              { k:'Gender', v: user?.gender || '—' },
            ].map(item => (
              <div key={item.k}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, letterSpacing:0.5 }}>{item.k.toUpperCase()}</div>
                <div style={{ fontSize: isElder ? 15 : 13, color:C.dark, fontWeight:600, marginTop:2 }}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── VA Results ───────────────────────────────── */}
      <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 14px rgba(0,0,0,0.08)', marginBottom:14, animation:'fadeUp 0.4s ease 0.08s both' }}>
        {/* Section header with eye image */}
        <div style={{ position:'relative', height:56, overflow:'hidden' }}>
          <img src={IMG.eyeChart} alt="" crossOrigin="anonymous"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.2)' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div style={{ position:'absolute', inset:0, background:`${C.blue}cc` }} />
          <div style={{ position:'absolute', inset:0, padding:'0 20px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:4, height:20, background:'#fff', borderRadius:2 }} />
            <div style={{ fontSize: isElder ? 16 : 14, fontWeight:700, color:'#fff' }}>
              {isKids ? '👁️ Eye Power Results' : isElder ? 'Eye Reading Test Results' : 'Visual Acuity Assessment'}
            </div>
          </div>
        </div>
        <div style={{ padding:'16px 20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            {[{ eye:'Left Eye', cls:vaL, line:testData?.vaLeft }, { eye:'Right Eye', cls:vaR, line:testData?.vaRight }].map(({ eye, cls, line }) => (
              <div key={eye} style={{ padding: isElder ? 18 : 14, borderRadius:14, background:`${cls.color}08`, border:`2px solid ${cls.color}22`, textAlign:'center' }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.muted, letterSpacing:0.5 }}>{eye.toUpperCase()}</div>
                <div style={{ fontSize: isElder ? 28 : 22, fontWeight:900, color:cls.color, margin:'6px 0' }}>
                  {line ? SNELLEN_LINES[line - 1]?.acuity : 'N/A'}
                </div>
                <SevBadge cls={cls} />
                <div style={{ fontSize: isElder ? 13 : 11, color:C.muted, marginTop:6 }}>{cls.disorder}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:'14px 16px', background:`${C.blue}08`, border:`1px solid ${C.blue}20`, borderRadius:12, fontSize: isElder ? 14 : 13, color:C.mid, lineHeight:1.7 }}>
            <div style={{ fontWeight:700, color:C.blue, marginBottom:6 }}>
              {isElder ? '💬 What this means for you:' : '💡 AI Recommendation:'}
            </div>
            <div>• {vaL.recommendation || 'No specific recommendation'}</div>
            <div>• Consult: <strong>{vaL.specialist || vaR.specialist}</strong></div>
            <div>• {isElder ? '📅 Next check in: ' : 'Follow-up: '}{vaL.severity === 'normal' ? '12 months' : '4–6 weeks'}</div>
          </div>
        </div>
      </div>

      {/* ── Color Vision Results ─────────────────────── */}
      <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 14px rgba(0,0,0,0.08)', marginBottom:14, animation:'fadeUp 0.4s ease 0.14s both' }}>
        <div style={{ position:'relative', height:56, overflow:'hidden' }}>
          <img src={IMG.iris1} alt="" crossOrigin="anonymous"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.2)' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div style={{ position:'absolute', inset:0, background:'#9333EAcc' }} />
          <div style={{ position:'absolute', inset:0, padding:'0 20px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:4, height:20, background:'#fff', borderRadius:2 }} />
            <div style={{ fontSize: isElder ? 16 : 14, fontWeight:700, color:'#fff' }}>
              {isKids ? '🌈 Rainbow Challenge Results' : isElder ? 'Colour Vision Results' : 'Color Vision Assessment'}
            </div>
          </div>
        </div>
        <div style={{ padding:'16px 20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
            {[
              { label:'Correct', val:correct, color:C.green },
              { label:'Errors',  val:testData?.colorErrors||0, color:C.red },
              { label:'Score',   val:`${score}%`, color:col.color },
            ].map(s => (
              <div key={s.label} style={{ textAlign:'center', padding: isElder ? 14 : 12, background:C.bg, borderRadius:12 }}>
                <div style={{ fontSize: isElder ? 26 : 22, fontWeight:900, color:s.color }}>{s.val}</div>
                <div style={{ fontSize: isElder ? 12 : 10, color:C.muted, fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <ProgressBar value={correct} max={10} color={col.color} label="Color Accuracy" />
          <div style={{ marginTop:12, padding:'12px 14px', background:`${col.color}0a`, border:`1px solid ${col.color}22`, borderRadius:10, textAlign:'center' }}>
            <div style={{ fontWeight:700, fontSize: isElder ? 15 : 13, color:col.color }}>{col.type}</div>
          </div>
        </div>
      </div>

      {/* ── AI Suggestions ───────────────────────────── */}
      <div style={{ background:'#fff', borderRadius:18, overflow:'hidden', boxShadow:'0 2px 14px rgba(0,0,0,0.08)', marginBottom:14, animation:'fadeUp 0.4s ease 0.2s both' }}>
        <div style={{ position:'relative', height:56, overflow:'hidden' }}>
          <img src={IMG.eyeDrops} alt="" crossOrigin="anonymous"
            style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(0.2)' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div style={{ position:'absolute', inset:0, background:`${C.green}cc` }} />
          <div style={{ position:'absolute', inset:0, padding:'0 20px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:4, height:20, background:'#fff', borderRadius:2 }} />
            <div style={{ fontSize: isElder ? 16 : 14, fontWeight:700, color:'#fff' }}>
              {isElder ? '✅ Tips for Your Eyes' : '🤖 AI Health Suggestions'}
            </div>
          </div>
        </div>
        <div style={{ padding:'16px 20px' }}>
          <div style={{ display:'grid', gap:10 }}>
            {[
              { icon:'👓', tip: vaL.severity !== 'normal' || vaR.severity !== 'normal' ? 'Corrective glasses or lenses are recommended. Visit an optometrist soon.' : 'Your vision is within normal limits. Keep up the good work!' },
              { icon:'📺', tip: 'Follow the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds to reduce eye strain.' },
              { icon:'🥕', tip: 'Eat foods rich in Vitamin A and antioxidants — carrots, leafy greens, and fish support eye health.' },
              { icon:'😴', tip: 'Get 7-8 hours of sleep daily. Rest is essential for eye recovery and overall health.' },
              { icon:'☀️', tip: 'Wear UV-protective sunglasses when outdoors to prevent long-term UV damage.' },
            ].map((s, i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'12px 14px', background:C.bg, borderRadius:10, fontSize: isElder ? 14 : 13, color:C.mid, lineHeight:1.65 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{s.icon}</span>
                <span>{s.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kids champion box */}
      {isKids && (
        <div style={{ background:'linear-gradient(135deg,#F5F3FF,#EDE9FE)', border:'2px solid #DDD6FE', borderRadius:18, padding:20, marginBottom:14, textAlign:'center', animation:'fadeUp 0.4s ease 0.28s both' }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🏆</div>
          <div style={{ fontSize:22, fontWeight:800, color:C.violet, fontFamily:"'Nunito',sans-serif" }}>You're a Vision Champion!</div>
          <div style={{ fontSize:14, color:C.purple, marginTop:6, fontFamily:"'Nunito',sans-serif" }}>Your eyes are amazing! Show this report to your parents.</div>
          <div style={{ display:'flex', justifyContent:'center', marginTop:12 }}>
            <Stars count={5} size={32} />
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ padding:'12px 16px', background:C.bg, borderRadius:12, fontSize: isElder ? 13 : 11, color:C.muted, textAlign:'center', lineHeight:1.7, marginBottom:16, animation:'fadeIn 0.5s ease 0.3s both' }}>
        <strong>Disclaimer:</strong> This AI-generated report is for preliminary screening only and does not replace a comprehensive clinical examination by a licensed ophthalmologist.
        <br />Report ID: <strong>{reportId}</strong> · 🔒 Stored locally
      </div>

      {/* ── Action buttons ───────────────────────────── */}
      <div style={{ display:'grid', gap:10, animation:'fadeUp 0.4s ease 0.3s both' }}>
        {/* PDF download button — prominent */}
        <Btn
          full
          size={isElder ? 'lg' : 'md'}
          color={C.primary}
          onClick={handleDownloadPDF}
          style={{
            background:'linear-gradient(135deg,#1B4F8A,#2C7BE5)',
            boxShadow:'0 6px 20px rgba(27,79,138,0.35)',
            fontSize: isElder ? 18 : 15,
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          }}
        >
          📄 {isElder ? 'Download My Report (PDF)' : 'Download PDF Report'}
        </Btn>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <OutlineBtn onClick={onRetakeVA} full>🔄 Retake Eye Test</OutlineBtn>
          <OutlineBtn onClick={onRetakeColor} full>🔄 Retake Colour Test</OutlineBtn>
        </div>
        <OutlineBtn onClick={onHome} full>🏠 Return to Home</OutlineBtn>
      </div>
    </div>
  );
}
