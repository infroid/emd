// screens_auth.jsx — splash / welcome, login, signup, OTP verify.

const { useState, useEffect } = React;

function ScreenSplash({ nav }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { i: 'lightning-charge-fill', t: 'Sub-10 minute SOS response', tone: 'red' },
    { i: 'shield-fill-check', t: 'HIPAA-compliant health vault', tone: 'blue' },
    { i: 'chat-dots-fill', t: 'Video consult in under 7 min', tone: 'purple' },
  ];
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="scroll" style={{ padding: '36px 24px 24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
        <div style={{
          width: 150, height: 150, borderRadius: 40,
          background: 'linear-gradient(180deg, #fdfbf6 0%, #ecdfd0 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 18px 36px rgba(220,38,38,.20)', marginBottom: 6,
        }}>
          <img src="assets/logos/logo-primary.png" style={{ width: '86%', height: '86%', objectFit: 'contain' }} alt="EMD" />
        </div>
        <p className="eyebrow" style={{ color: 'var(--accent-text)' }}>EaseMyDisease</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', lineHeight: 1.08, margin: 0, color: 'var(--fg-1)' }}>
          Medical help,<br /><em style={{ color: 'var(--accent-text)', fontStyle: 'normal' }}>the moment you need it</em>
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--fg-2)', margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
          Emergency response, your health records, and doctors on call — all in one calm place.
        </p>

        <div style={{ marginTop: 18, width: '100%', maxWidth: 300 }}>
          {slides.map((s, idx) => (
            <div key={s.t} style={{
              display: idx === slide ? 'flex' : 'none', gap: 12, alignItems: 'center',
              padding: '12px 14px', borderRadius: 16, background: 'var(--bg-1)',
              border: '1px solid var(--border-1)',
            }}>
              <span className={`ico tone-${s.tone}`} style={{ width: 38, height: 38, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                <I name={s.i} />
              </span>
              <span style={{ fontSize: 13.5, color: 'var(--fg-1)', fontWeight: 600, textAlign: 'left' }}>{s.t}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 14 }}>
            {slides.map((_, idx) => (
              <span key={idx} onClick={() => setSlide(idx)} style={{
                width: idx === slide ? 22 : 7, height: 7, borderRadius: 99,
                background: idx === slide ? 'var(--accent)' : 'var(--border-2)',
                transition: 'all .3s ease', cursor: 'pointer',
              }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 18 }}>
        <MButton variant="primary" block iconRight="arrow-right" onClick={() => nav.push('signup')}>Get Protected Now</MButton>
        <MButton variant="ghost" block onClick={() => nav.push('login')}>I already have an account</MButton>
      </div>
    </div>
  );
}

function ScreenLogin({ nav }) {
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Welcome back" />
      <div className="scroll" style={{ padding: '16px 22px 24px' }}>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: '2px 0 22px', lineHeight: 1.5 }}>
          Sign in to your health vault. We verify each device once.
        </p>
        <div className="stack-12">
          <MField label="Phone or email" placeholder="+1 (415) 555-0142" type="text" defaultValue="+1 (415) 555-0142" />
          <MField label="Password" placeholder="••••••••" type="password" defaultValue="password" />
        </div>
        <div style={{ textAlign: 'right', margin: '10px 0 18px' }}>
          <span className="link" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent-text)' }}>Forgot password?</span>
        </div>
        <MButton variant="primary" block iconRight="arrow-right" onClick={() => nav.reset('home')}>Sign in</MButton>
        <div style={{ height: 12 }} />
        <MButton variant="secondary" block icon="shield-lock" onClick={() => nav.push('otp', { from: 'login' })}>Use a one-time code instead</MButton>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-1)' }} />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-1)' }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['google', 'apple', 'microsoft'].map(b => (
            <button key={b} className="m-btn secondary block" style={{ flex: 1 }} onClick={() => nav.reset('home')}>
              <I name={b} />
            </button>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', marginTop: 22 }}>
          New here? <span className="link" style={{ color: 'var(--accent-text)', fontWeight: 600 }} onClick={() => nav.replace('signup')}>Create an account</span>
        </p>
      </div>
    </React.Fragment>
  );
}

function ScreenSignup({ nav }) {
  const [agree, setAgree] = useState(true);
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Create your vault" />
      <div className="scroll" style={{ padding: '16px 22px 24px' }}>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: '2px 0 22px', lineHeight: 1.5 }}>
          Takes 60 seconds. Your records stay encrypted and locked to your phone.
        </p>
        <div className="stack-12">
          <MField label="Full name" placeholder="Jordan Patel" defaultValue="Jordan Patel" />
          <MField label="Phone number" placeholder="+1 (415) 555-0142" type="tel" defaultValue="+1 (415) 555-0142" />
          <MField label="Email" placeholder="jordan@email.com" type="email" defaultValue="jordan@email.com" />
          <MField label="Create password" placeholder="At least 8 characters" type="password" defaultValue="password" help="Use 8+ characters with a number" />
        </div>
        <button className="tap" onClick={() => setAgree(!agree)} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', margin: '16px 0 18px', background: 'transparent', border: 0, textAlign: 'left', padding: 0 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
            border: `2px solid ${agree ? 'var(--accent)' : 'var(--border-2)'}`,
            background: agree ? 'var(--accent)' : 'transparent', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
          }}>{agree && <I name="check-lg" />}</span>
          <span style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.45 }}>
            I agree to the <span style={{ color: 'var(--accent-text)', fontWeight: 600 }}>Terms</span> and <span style={{ color: 'var(--accent-text)', fontWeight: 600 }}>HIPAA Privacy Notice</span>.
          </span>
        </button>
        <MButton variant="primary" block iconRight="arrow-right" onClick={() => nav.push('otp', { from: 'signup' })}>Continue</MButton>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)', marginTop: 18 }}>
          Already have an account? <span className="link" style={{ color: 'var(--accent-text)', fontWeight: 600 }} onClick={() => nav.replace('login')}>Sign in</span>
        </p>
      </div>
    </React.Fragment>
  );
}

function ScreenOtp({ nav }) {
  const [secs, setSecs] = useState(23);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(secs - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Verify your number" />
      <div className="scroll" style={{ padding: '14px 22px' }}>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: '4px 0 24px', lineHeight: 1.5 }}>
          We sent a 6-digit code to <strong style={{ color: 'var(--fg-1)' }}>+1 (415) 555-0142</strong>. It expires in 10 minutes.
        </p>
        <MOtp value="427" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Didn't get it?</span>
          <button className="m-btn ghost" disabled={secs > 0} onClick={() => setSecs(23)} style={{ padding: '8px 12px', minHeight: 'auto', fontSize: 13, opacity: secs > 0 ? .6 : 1 }}>
            {secs > 0 ? `Resend in 0:${String(secs).padStart(2, '0')}` : 'Resend code'}
          </button>
        </div>
        <div style={{ height: 16 }} />
        <MBanner tone="info" title="Why a code?">Your health vault is locked to your phone. We verify every new device once.</MBanner>
        <div style={{ height: 18 }} />
        <MButton variant="primary" block iconRight="arrow-right" onClick={() => nav.reset('home')}>Verify &amp; Continue</MButton>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { ScreenSplash, ScreenLogin, ScreenSignup, ScreenOtp });
