import { useState, useEffect } from 'react';
import Head from 'next/head';

const skinTones = [
  { id: 'ivory', name: 'Ivory', color: '#FDEBD0', desc: 'Very fair' },
  { id: 'porcelain', name: 'Porcelain', color: '#F5CBA7', desc: 'Fair' },
  { id: 'sand', name: 'Sand', color: '#F0B27A', desc: 'Light' },
  { id: 'honey', name: 'Honey', color: '#E59866', desc: 'Light medium' },
  { id: 'caramel', name: 'Caramel', color: '#CA6F1E', desc: 'Medium' },
  { id: 'toffee', name: 'Toffee', color: '#AF601A', desc: 'Medium tan' },
  { id: 'sienna', name: 'Sienna', color: '#935116', desc: 'Tan' },
  { id: 'mahogany', name: 'Mahogany', color: '#6E2C0F', desc: 'Deep brown' },
  { id: 'coffee', name: 'Coffee', color: '#4A1A08', desc: 'Very deep' },
  { id: 'ebony', name: 'Ebony', color: '#2C0D03', desc: 'Richest deep' },
];

const steps = [
  {
    id: 'gender',
    question: 'Who are we styling today?',
    options: ['Man', 'Woman', 'Non-binary / Gender-fluid'],
    isSkinTone: false,
  },
  {
    id: 'bodyType',
    question: 'How would you describe your build?',
    options: ['Slim / Lean', 'Athletic / Toned', 'Average / Medium', 'Broad / Muscular', 'Curvy / Full-figured'],
    isSkinTone: false,
  },
  {
    id: 'skinTone',
    question: 'What is your skin tone?',
    options: [],
    isSkinTone: true,
  },
  {
    id: 'budget',
    question: "What's your monthly style budget?",
    options: ['Under $50', '$50-$150', '$150-$300', '$300+'],
    isSkinTone: false,
  },
  {
    id: 'lifestyle',
    question: 'What best describes your day-to-day life?',
    options: ['Student / Campus life', 'Office / Corporate', 'Creative / Freelance', 'Active / Outdoor', 'Social / Nightlife'],
    isSkinTone: false,
  },
  {
    id: 'goal',
    question: "What's your style goal?",
    options: ['Look more put-together', 'Attract romantic interest', 'Command respect at work', 'Build a signature look', 'Upgrade from basics'],
    isSkinTone: false,
  },
];

const AMAZON = 'https://www.amazon.com/s?tag=fitcoded-20&k=';
const ASOS = 'https://www.asos.com/search/?q=';

const logoCSS = `
  .fc-ring-pulse {
    fill: none;
    stroke: #C9A84C;
    stroke-width: 1;
    opacity: 0;
    animation: fcPulse 2.5s ease 2.5s infinite;
  }
  .fc-ring {
    fill: none;
    stroke: #C9A84C;
    stroke-width: 2.5;
    stroke-dasharray: 502;
    stroke-dashoffset: 502;
    animation: fcDraw 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
  }
  .fc-letter-f {
    fill: #C9A84C;
    font-family: Georgia, serif;
    font-size: 52px;
    text-anchor: middle;
    dominant-baseline: central;
    opacity: 0;
    animation: fcFadeF 0.5s ease 1.3s forwards;
  }
  .fc-letter-c {
    fill: #C9A84C;
    font-family: Georgia, serif;
    font-size: 52px;
    text-anchor: middle;
    dominant-baseline: central;
    opacity: 0;
    animation: fcFadeC 0.5s ease 1.9s forwards;
  }
  @keyframes fcDraw {
    to { stroke-dashoffset: 0; }
  }
  @keyframes fcFadeF {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fcFadeC {
    from { opacity: 0; transform: translateX(8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fcPulse {
    0% { opacity: 0; }
    30% { opacity: 0.25; }
    100% { opacity: 0; }
  }
`;

export default function Home() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [styleResult, setStyleResult] = useState(null);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(0);

  const loadingMessages = [
    { main: 'Analyzing your skin tone...', sub: 'Reading your unique complexion' },
    { main: 'Selecting your color palette...', sub: 'Matching colors to your tone' },
    { main: 'Building your outfits...', sub: 'Curating pieces for your lifestyle' },
    { main: 'Finalizing your style profile...', sub: 'Almost ready' },
  ];

  useEffect(() => {
    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isStandalone = window.navigator.standalone;
    setIsIOS(ios);
    if (ios && !isStandalone) {
      setTimeout(() => setShowBanner(true), 3000);
    }
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingMessage(0);
      interval = setInterval(() => {
        setLoadingMessage((prev) => (prev + 1) % 4);
      }, 2200);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleSelect = async (value) => {
    const newAnswers = { ...answers, [steps[step].id]: value };
    setAnswers(newAnswers);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(steps.length);
      await generate(newAnswers);
    }
  };

  const generate = async (a) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(a),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStyleResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(-1);
    setAnswers({});
    setStyleResult(null);
    setError(null);
  };

  const currentStep = steps[step];

  return (
    <>
      <Head>
        <title>FitCoded — Style Advisor</title>
        <meta name="description" content="Get your personalized style profile in 60 seconds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {showBanner && (
        <div className="install-banner">
          <div className="install-content">
            <div className="logo-wrap">
              <style>{logoCSS}</style>
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="40" height="40" overflow="visible">
                <circle className="fc-ring-pulse" cx="100" cy="100" r="80" />
                <circle className="fc-ring" cx="100" cy="100" r="80" />
                <text className="fc-letter-f" x="82" y="102">F</text>
                <text className="fc-letter-c" x="118" y="102">C</text>
              </svg>
            </div>
            <div className="install-text">
              <strong>Add FitCoded to your home screen</strong>
              {isIOS ? (
                <span>Tap <strong>Share</strong> then <strong>Add to Home Screen</strong></span>
              ) : (
                <span>Install the app for quick access</span>
              )}
            </div>
            {!isIOS && deferredPrompt && (
              <button className="install-btn" onClick={handleInstall}>Install</button>
            )}
            <button className="install-close" onClick={() => setShowBanner(false)}>✕</button>
          </div>
        </div>
      )}

      <div className="root">

        {step === -1 && (
          <div className="center fade">
            <div className="badge">YOUR STYLE ADVISOR</div>
            <h1 className="hero">
              Your Style,<br />
              <span className="accent">Decoded.</span>
            </h1>
            <p className="sub">
              Answer 6 questions. Get a personalized style profile with outfits you can shop right now.
            </p>
            <button className="cta" onClick={() => setStep(0)}>Get My Style Profile →</button>
            <p className="free">Free · No sign-up · 60 seconds</p>
          </div>
        )}

        {step >= 0 && step < steps.length && (
          <div className="wrap fade">
            <div className="progress">
              <div className="fill" style={{ width: `${(step / steps.length) * 100}%` }} />
            </div>
            <div className="step-count">{step + 1} of {steps.length}</div>
            <h2 className="question">{currentStep.question}</h2>

            {currentStep.isSkinTone ? (
              <div className="skin-grid">
                {skinTones.map((tone) => (
                  <button
                    key={tone.id}
                    className="skin-btn"
                    onClick={() => handleSelect(tone.name)}
                  >
                    <div className="skin-swatch" style={{ background: tone.color }} />
                    <span className="skin-name">{tone.name}</span>
                    <span className="skin-desc">{tone.desc}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="options">
                {currentStep.options.map((opt) => (
                  <button
                    key={opt}
                    className="option"
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {step > 0 && (
              <button className="back" onClick={() => setStep(step - 1)}>← Back</button>
            )}
          </div>
        )}

        {step === steps.length && loading && (
          <div className="center fade">
            <div className="spinner" />
            <p className="loading-text">{loadingMessages[loadingMessage].main}</p>
            <p className="loading-sub">{loadingMessages[loadingMessage].sub}</p>
          </div>
        )}

        {step === steps.length && !loading && error && (
          <div className="center fade">
            <p className="error">{error}</p>
            <button className="cta" onClick={reset}>Try Again</button>
          </div>
        )}

        {styleResult && !loading && (
          <div className="results fade">

            <div className="res-header">
              <div className="badge">YOUR STYLE PROFILE</div>
              <div className="persona">{styleResult.stylePersonality}</div>
            </div>

            <div className="card">
              <div className="card-title">YOUR COLOR PALETTE</div>
              <div className="palette">
                {styleResult.colorPalette?.map((c, i) => (
                  <div key={i} className="swatch-wrap">
                    <div className="swatch" style={{ background: c }} />
                    <span className="color-label">{c}</span>
                  </div>
                ))}
              </div>
              <p className="color-desc">{styleResult.colorDescription}</p>
            </div>

            <div className="sec-title">YOUR OUTFITS</div>
            {styleResult.outfits?.map((outfit, i) => (
              <div key={i} className="card">
                <div className="outfit-top">
                  <span className="occasion">{outfit.occasion?.toUpperCase()}</span>
                  <span className="outfit-name">{outfit.outfitName}</span>
                </div>
                {outfit.pieces?.map((p, j) => (
                  <div key={j} className="piece">
                    <div className="piece-info">
                      <span className="piece-item">{p.item}</span>
                      <span className="piece-tip">{p.tip}</span>
                    </div>
                    <div className="shop-row">
                      <a
                        href={AMAZON + encodeURIComponent(p.search)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shop-a"
                      >
                        Amazon
                      </a>
                      <a
                        href={ASOS + encodeURIComponent(p.search)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shop-b"
                      >
                        ASOS
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="card">
              <div className="card-title">YOUR STYLE RULES</div>
              {styleResult.styleRules?.map((r, i) => (
                <div key={i} className="rule-row">
                  <span className="rule-num">{i + 1}</span>
                  <span className="rule-txt">{r}</span>
                </div>
              ))}
            </div>

            <div className="card avoid-card">
              <div className="card-title">WHAT TO AVOID</div>
              {styleResult.avoid?.map((a, i) => (
                <div key={i} className="rule-row">
                  <span className="avoid-x">✕</span>
                  <span className="rule-txt">{a}</span>
                </div>
              ))}
            </div>

            <div className="qw-card">
              <div className="qw-label">⚡ QUICK WIN</div>
              <p className="qw-txt">{styleResult.quickWin}</p>
            </div>

            <button className="cta full" onClick={reset}>Start Over</button>

          </div>
        )}

      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          background: #0a0a0a;
          color: #f0ede8;
          font-family: Georgia, serif;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .fade {
          animation: fadeIn 0.4s ease forwards;
        }
        .install-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #1a1a1a;
          border-top: 1px solid #c9a96e;
          padding: 14px 16px;
          z-index: 1000;
        }
        .install-content {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 560px;
          margin: 0 auto;
        }
        .logo-wrap {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
        }
        .install-text {
          flex: 1;
          font-family: Arial, sans-serif;
          font-size: 13px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .install-text strong {
          color: #c9a96e;
        }
        .install-text span {
          color: #888;
          font-size: 11px;
        }
        .install-btn {
          background: #c9a96e;
          color: #0a0a0a;
          border: none;
          padding: 8px 16px;
          font-size: 12px;
          font-family: Arial, sans-serif;
          cursor: pointer;
          font-weight: 700;
          flex-shrink: 0;
        }
        .install-close {
          background: transparent;
          border: none;
          color: #555;
          font-size: 16px;
          cursor: pointer;
          flex-shrink: 0;
          padding: 4px;
        }
        .root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          padding-bottom: 80px;
        }
        .center {
          max-width: 480px;
          width: 100%;
          text-align: center;
          padding: 40px 0;
        }
        .wrap {
          max-width: 500px;
          width: 100%;
        }
        .results {
          max-width: 560px;
          width: 100%;
          padding-bottom: 60px;
        }
        .badge {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: #c9a96e;
          border: 1px solid #c9a96e;
          padding: 4px 12px;
          margin-bottom: 24px;
          font-family: Arial, sans-serif;
        }
        .hero {
          font-size: clamp(40px, 10vw, 68px);
          font-weight: 400;
          line-height: 1.05;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .accent {
          color: #c9a96e;
          font-style: italic;
        }
        .sub {
          font-size: 15px;
          color: #888;
          line-height: 1.7;
          margin-bottom: 36px;
          font-family: Arial, sans-serif;
        }
        .cta {
          background: #c9a96e;
          color: #0a0a0a;
          border: none;
          padding: 15px 32px;
          font-size: 13px;
          letter-spacing: 0.1em;
          font-family: Arial, sans-serif;
          cursor: pointer;
          font-weight: 700;
          transition: opacity 0.2s;
        }
        .cta:hover {
          opacity: 0.85;
        }
        .cta.full {
          width: 100%;
          padding: 18px;
          font-size: 12px;
          letter-spacing: 0.15em;
        }
        .free {
          margin-top: 14px;
          font-size: 11px;
          color: #444;
          font-family: Arial, sans-serif;
          letter-spacing: 0.05em;
        }
        .progress {
          width: 100%;
          height: 2px;
          background: #1e1e1e;
          margin-bottom: 28px;
        }
        .fill {
          height: 100%;
          background: #c9a96e;
          transition: width 0.3s ease;
        }
        .step-count {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #444;
          font-family: Arial, sans-serif;
          margin-bottom: 14px;
        }
        .question {
          font-size: clamp(20px, 5vw, 28px);
          font-weight: 400;
          margin-bottom: 28px;
          line-height: 1.3;
        }
        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .option {
          background: transparent;
          border: 1px solid #222;
          color: #f0ede8;
          padding: 15px 18px;
          text-align: left;
          font-size: 14px;
          cursor: pointer;
          font-family: Arial, sans-serif;
          transition: all 0.2s;
        }
        .option:hover {
          border-color: #c9a96e;
          color: #c9a96e;
        }
        .skin-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 8px;
        }
        .skin-btn {
          background: transparent;
          border: 1px solid #222;
          padding: 10px 6px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .skin-btn:hover {
          border-color: #c9a96e;
        }
        .skin-swatch {
          width: 36px;
          height: 36px;
          border-radius: 50%;
        }
        .skin-name {
          font-size: 10px;
          color: #f0ede8;
          font-family: Arial, sans-serif;
          text-align: center;
        }
        .skin-desc {
          font-size: 9px;
          color: #666;
          font-family: Arial, sans-serif;
          text-align: center;
        }
        .back {
          background: transparent;
          border: none;
          color: #444;
          font-size: 12px;
          cursor: pointer;
          margin-top: 20px;
          font-family: Arial, sans-serif;
          letter-spacing: 0.05em;
          display: block;
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 2px solid #1e1e1e;
          border-top: 2px solid #c9a96e;
          border-radius: 50%;
          margin: 0 auto 20px;
          animation: spin 0.8s linear infinite;
        }
        .loading-text {
          font-size: 17px;
          font-style: italic;
          margin-bottom: 8px;
        }
        .loading-sub {
          font-size: 12px;
          color: #555;
          font-family: Arial, sans-serif;
          letter-spacing: 0.05em;
        }
        .error {
          color: #e07070;
          font-family: Arial, sans-serif;
          font-size: 13px;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .res-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .persona {
          font-size: clamp(26px, 6vw, 44px);
          font-weight: 400;
          font-style: italic;
          color: #c9a96e;
          margin-top: 14px;
        }
        .card {
          border: 1px solid #1e1e1e;
          padding: 22px;
          margin-bottom: 14px;
          background: #0f0f0f;
        }
        .card-title {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #c9a96e;
          font-family: Arial, sans-serif;
          margin-bottom: 14px;
          font-weight: 400;
        }
        .palette {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .swatch-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .swatch {
          width: 40px;
          height: 40px;
        }
        .color-label {
          font-size: 10px;
          color: #555;
          font-family: Arial, sans-serif;
        }
        .color-desc {
          font-size: 13px;
          color: #777;
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .sec-title {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #444;
          font-family: Arial, sans-serif;
          margin-bottom: 10px;
          font-weight: 400;
          margin-top: 6px;
        }
        .outfit-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 6px;
        }
        .occasion {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #c9a96e;
          font-family: Arial, sans-serif;
        }
        .outfit-name {
          font-size: 15px;
          font-style: italic;
        }
        .piece {
          border-top: 1px solid #1a1a1a;
          padding-top: 12px;
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .piece-info {
          flex: 1;
          min-width: 130px;
        }
        .piece-item {
          font-size: 14px;
          font-family: Arial, sans-serif;
          display: block;
          margin-bottom: 3px;
        }
        .piece-tip {
          font-size: 11px;
          color: #555;
          font-family: Arial, sans-serif;
          line-height: 1.5;
          display: block;
        }
        .shop-row {
          display: flex;
          gap: 6px;
        }
        .shop-a {
          background: #c9a96e;
          color: #0a0a0a;
          padding: 5px 10px;
          font-size: 10px;
          font-family: Arial, sans-serif;
          text-decoration: none;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .shop-b {
          border: 1px solid #c9a96e;
          color: #c9a96e;
          padding: 5px 10px;
          font-size: 10px;
          font-family: Arial, sans-serif;
          text-decoration: none;
          letter-spacing: 0.05em;
        }
        .rule-row {
          display: flex;
          gap: 10px;
          margin-bottom: 9px;
          align-items: flex-start;
        }
        .rule-num {
          color: #c9a96e;
          font-size: 12px;
          font-style: italic;
          width: 16px;
          flex-shrink: 0;
        }
        .rule-txt {
          font-size: 13px;
          font-family: Arial, sans-serif;
          color: #bbb;
          line-height: 1.6;
        }
        .avoid-card {
          border-color: #1a1010;
          background: #0d0b0b;
        }
        .avoid-x {
          color: #6a2a2a;
          font-size: 11px;
          width: 16px;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .qw-card {
          background: #c9a96e;
          padding: 22px;
          margin-bottom: 28px;
        }
        .qw-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #0a0a0a;
          font-family: Arial, sans-serif;
          margin-bottom: 8px;
          font-weight: 700;
        }
        .qw-txt {
          font-size: 14px;
          color: #0a0a0a;
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
      `}</style>
    </>
  );
}
