import { useState, useEffect, useCallback } from 'react';
import { getSession } from './utils/helpers';

// Auth screens
import { SplashScreen }          from './components/auth/SplashScreen';
import { LanguageScreen }        from './components/auth/LanguageScreen';
import { LoginRegisterScreen }   from './components/auth/LoginRegisterScreen';

// Layout
import { TopBar }                from './components/dashboard/TopBar';

// Screens
import { HomeDashboard }         from './components/screens/HomeDashboard';
import { VATestScreen }          from './components/screens/VATestScreen';
import { ColorTestScreen }       from './components/screens/ColorTestScreen';
import { ReportScreen }          from './components/screens/ReportScreen';
import { SocialWorkerDashboard } from './components/social/SocialWorkerDashboard';

// ── Screen flow ──────────────────────────────────────────
// splash → language → auth → home
// home → vaTest → colorTest → report
// home (social_worker) → socialDashboard

export default function App() {
  const [screen,   setScreen]   = useState('splash');
  const [lang,     setLang]     = useState({ code:'en' });
  const [user,     setUser]     = useState(null);
  const [stars,    setStars]    = useState(0);
  const [testData, setTestData] = useState({});
  const [testsCompleted, setTestsCompleted] = useState({ va:false, color:false });
  // For social worker patient testing
  const [activePatient, setActivePatient] = useState(null);

  // ── Check for existing session ───────────────────────
  useEffect(() => {
    const saved = getSession();
    if (saved) {
      setUser(saved);
      // Skip straight to home if already logged in
      setScreen('home');
    }
  }, []);

  const handleLogin = useCallback((u) => {
    setUser(u);
    setScreen('home');
  }, []);

  const addStars = useCallback((n) => {
    setStars(s => s + n);
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
    setActivePatient(null);
  }, []);

  // ── Pre-auth screens ─────────────────────────────────
  if (screen === 'splash') return <SplashScreen onDone={() => setScreen('language')} />;
  if (screen === 'language') return <LanguageScreen onSelect={(l) => { setLang(l); setScreen('auth'); }} />;
  if (screen === 'auth') return <LoginRegisterScreen lang={lang.code} onLogin={handleLogin} />;

  // ── Get effective user (or active patient for social worker) ──
  const effectiveUser = activePatient
    ? { ...activePatient, lang: lang.code }
    : { ...user, lang: lang.code };

  // ── Show different home screen for social workers ────
  const isSocialWorker = user?.role === 'social_worker';

  // ── Determine which screen to show ──────────────────
  let content;
  switch (screen) {
    case 'home':
      if (isSocialWorker && !activePatient) {
        content = (
          <SocialWorkerDashboard
            user={user}
            onStartPatientTest={(patient) => {
              setActivePatient(patient);
              setTestsCompleted({ va:false, color:false });
              setTestData({});
              setScreen('home');
            }}
          />
        );
      } else {
        content = (
          <HomeDashboard
            user={effectiveUser}
            stars={stars}
            testsCompleted={testsCompleted}
            onStartVA={() => setScreen('vaTest')}
            onStartColor={() => setScreen('colorTest')}
            onViewReport={() => setScreen('report')}
          />
        );
      }
      break;

    case 'vaTest':
      content = (
        <VATestScreen
          user={effectiveUser}
          stars={stars}
          onAddStars={addStars}
          onDone={(data) => {
            setTestData(prev => ({ ...prev, ...data }));
            setTestsCompleted(t => ({ ...t, va:true }));
            setScreen('colorTest');
          }}
        />
      );
      break;

    case 'colorTest':
      content = (
        <ColorTestScreen
          user={effectiveUser}
          stars={stars}
          onAddStars={addStars}
          onDone={(data) => {
            setTestData(prev => ({ ...prev, ...data }));
            setTestsCompleted(t => ({ ...t, color:true }));
            setScreen('report');
          }}
        />
      );
      break;

    case 'report':
      content = (
        <ReportScreen
          user={effectiveUser}
          testData={testData}
          onRetakeVA={() => setScreen('vaTest')}
          onRetakeColor={() => setScreen('colorTest')}
          onHome={goHome}
        />
      );
      break;

    default:
      content = <div>Unknown screen</div>;
  }

  return (
    <>
      <TopBar
        user={effectiveUser}
        screen={screen}
        onHome={goHome}
        showBack={screen !== 'home'}
        onBack={() => {
          if (screen === 'colorTest') setScreen('vaTest');
          else if (screen === 'report') setScreen('home');
          else if (screen === 'vaTest') setScreen('home');
          else goHome();
        }}
      />
      <div style={{ minHeight:'calc(100vh - 58px)' }}>
        {content}
      </div>
    </>
  );
}
