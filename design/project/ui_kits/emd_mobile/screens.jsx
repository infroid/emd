// screens.jsx — Full-screen mockups for the EMD mobile kit.

// ─────────────────────────────────────────────────────────────
// 1. ONBOARDING — welcome / value prop, sign-in entry
// ─────────────────────────────────────────────────────────────
function ScreenOnboarding() {
  return (
    <div className="scroll" style={{ padding: '40px 24px 24px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 }}>
        <div style={{
          width: 132, height: 132, borderRadius: 36,
          background: 'linear-gradient(180deg, #fdfbf6 0%, #ecdfd0 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 28px rgba(220,38,38,.18)',
          marginBottom: 8,
        }}>
          <img src="../../assets/logos/logo-primary.png" style={{ width: '88%', height: '88%', objectFit: 'contain' }} alt="EMD" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0, color: 'var(--fg-1)' }}>
          Medical Help,<br/>
          <em style={{ color: 'var(--accent-text)', fontStyle: 'normal' }}>Instantly</em>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: 0, maxWidth: 240, lineHeight: 1.5 }}>
          Emergency response, your health records, and doctors on call — in one app.
        </p>
        {/* feature dots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20, width: '100%', maxWidth: 280, textAlign: 'left' }}>
          {[
            { i: 'lightning-charge-fill', t: 'Sub-10 minute SOS response' },
            { i: 'shield-fill-check',     t: 'HIPAA-compliant health vault' },
            { i: 'chat-dots-fill',         t: 'Video consult in under 7 min' },
          ].map(({ i, t }) => (
            <div key={t} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="ico tone-red" style={{ width: 32, height: 32, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                <i className={`bi bi-${i}`} />
              </span>
              <span style={{ fontSize: 13.5, color: 'var(--fg-1)', fontWeight: 500 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 28 }}>
        <MButton variant="primary" block iconRight="arrow-right">Get Protected Now</MButton>
        <MButton variant="ghost" block>I already have an account</MButton>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. SIGN-IN with OTP (keyboard could go here; kept minimal)
// ─────────────────────────────────────────────────────────────
function ScreenOtp() {
  return (
    <React.Fragment>
      <MHeader
        leading={<MIconBtn icon="chevron-left" />}
        title="Verify your number"
      />
      <div className="scroll" style={{ padding: '12px 20px' }}>
        <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: '4px 0 24px', lineHeight: 1.5 }}>
          We sent a 6-digit code to <strong style={{ color: 'var(--fg-1)' }}>+1 (415) 555-0142</strong>. It expires in 10 minutes.
        </p>
        <MOtp value="4 2 7" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Didn't get it?</span>
          <button className="m-btn ghost" style={{ padding: '8px 12px', minHeight: 'auto', fontSize: 13 }}>Resend in 0:23</button>
        </div>
        <MBanner tone="info" title="Why a code?">
          Your health vault is locked to your phone. We verify every new device once.
        </MBanner>
        <div style={{ height: 16 }} />
        <MButton variant="primary" block iconRight="arrow-right">Verify & Continue</MButton>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. SOS HOME — the big red button
// ─────────────────────────────────────────────────────────────
function ScreenSosHome() {
  return (
    <React.Fragment>
      <MHeader
        leading={<MIconBtn icon="list" />}
        title="SOS Emergency"
        trailing={<MIconBtn icon="bell" />}
      />
      <div className="scroll" style={{ padding: '0 16px 16px' }}>
        <div className="sos-stage">
          <MStatus tone="green">All systems ready</MStatus>
          <SosBig />
          <p className="sos-instruct">
            <strong>Hold for 3 seconds</strong> to dispatch emergency services with your location.
          </p>
        </div>

        <div className="m-section" style={{ padding: '8px 0' }}>
          <div className="m-section-head"><h2>Active settings</h2></div>
          <MList>
            <MRow icon="geo-alt-fill"  iconTone="red"   title="Location sharing"  sub="On · 415 Mission St" trailing="6 m ago" chev={false} />
            <MRow icon="people-fill"   iconTone="blue"  title="Emergency contacts" sub="3 contacts will be notified" />
            <MRow icon="capsule"        iconTone="purple" title="Medical profile"   sub="Penicillin allergy · Type II diabetes" />
          </MList>
        </div>

        <div className="m-section" style={{ padding: '8px 0' }}>
          <div className="m-section-head"><h2>Recent incidents</h2><a className="link" href="#">All</a></div>
          <MList>
            <MRow icon="check2"  iconTone="green" title="Test alert" sub="Saturday · 9:14 PM" trailingStrong="Resolved" chev={false} />
          </MList>
        </div>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. SOS ACTIVE — emergency in progress (dispatching)
// ─────────────────────────────────────────────────────────────
function ScreenSosActive() {
  return (
    <React.Fragment>
      {/* Hero band — red */}
      <div style={{
        background: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
        color: '#fff',
        padding: '40px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,.18), transparent 60%)', pointerEvents: 'none' }} />
        <MHeader variant="transparent"
          leading={<button className="m-iconbtn ghost" style={{ color: '#fff' }}><i className="bi bi-chevron-left" /></button>}
          title="Emergency in progress"
          trailing={<button className="m-iconbtn ghost" style={{ color: '#fff' }}><i className="bi bi-three-dots" /></button>}
        />
        <div style={{ position: 'relative', textAlign: 'center', marginTop: 12 }}>
          <span style={{
            display: 'inline-flex', gap: 6, alignItems: 'center',
            padding: '4px 10px', borderRadius: 99,
            background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(8px)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#fff', animation: 'sosPulseBig 1.4s infinite' }} />
            Dispatching
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, margin: '12px 0 4px', letterSpacing: '-0.02em' }}>
            Help is on the way
          </h2>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.85)', margin: 0 }}>
            ETA <strong style={{ color: '#fff' }}>6 min 24 sec</strong> · Mercy General EMS-04
          </p>
        </div>
      </div>

      <div className="scroll" style={{ padding: '16px', flex: 1 }}>
        {/* Map placeholder */}
        <div style={{
          height: 140, borderRadius: 18, overflow: 'hidden',
          border: '1px solid var(--border-1)',
          background:
            'linear-gradient(180deg, #e8f0ea, #d5e3d8)',
          position: 'relative',
          marginBottom: 12,
        }}>
          {/* fake roads */}
          <svg width="100%" height="100%" viewBox="0 0 320 140" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <path d="M-20 80 Q 60 60 140 90 T 340 70" stroke="#fff" strokeWidth="8" fill="none" />
            <path d="M-20 80 Q 60 60 140 90 T 340 70" stroke="#cbd5e0" strokeWidth="1" fill="none" />
            <path d="M40 -10 L 80 160" stroke="#fff" strokeWidth="6" fill="none" />
            <path d="M220 -10 L 240 160" stroke="#fff" strokeWidth="6" fill="none" />
            <circle cx="180" cy="85" r="10" fill="#dc2626" />
            <circle cx="180" cy="85" r="18" fill="rgba(220,38,38,.2)" />
            <circle cx="60" cy="40" r="7" fill="#3b82f6" />
          </svg>
          <div style={{
            position: 'absolute', bottom: 8, left: 8,
            padding: '4px 10px', borderRadius: 99,
            background: 'rgba(255,255,255,.95)', fontSize: 11, fontWeight: 600,
            color: 'var(--fg-1)',
          }}>
            <i className="bi bi-geo-alt-fill" style={{ color: 'var(--accent)' }} /> 415 Mission St
          </div>
        </div>

        <MList>
          <MRow icon="person-arms-up" iconTone="blue" title="Dr. Marcus Rivera" sub="EMT-Paramedic · Mercy General" trailing="2.4 mi" chev={false} />
          <MRow icon="truck-front-fill" iconTone="red" title="EMS-04" sub="Ambulance dispatched · 6:42 PM" trailing="6 min" chev={false} />
          <MRow icon="telephone-forward-fill" iconTone="green" title="Call dispatcher" sub="Direct line to your responder" />
        </MList>

        <div style={{ height: 12 }} />

        <MBanner tone="info" title="Sharing automatically">
          Your live location, vitals, allergies, and emergency contacts have been sent to the responder.
        </MBanner>

        <div style={{ height: 12 }} />

        <MButton variant="secondary" block icon="x-circle">Cancel emergency</MButton>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. EHR — Health Records home (list + categories + recent)
// ─────────────────────────────────────────────────────────────
function ScreenEhr() {
  return (
    <React.Fragment>
      <MLargeHead
        greeting="Vault · Jordan Patel"
        title="Health Records"
        trailing={<MIconBtn icon="share" />}
      />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <div style={{ padding: '0 0 12px' }}>
          <MSearch placeholder="Search records, prescriptions" />
        </div>

        {/* Vault overview */}
        <div className="m-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, margin: 0 }}>My vault</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', margin: '4px 0 0' }}>247 records</h3>
            </div>
            <MStatus tone="green"><i className="bi bi-shield-fill-check" />Synced</MStatus>
          </div>
          <div className="stat-grid">
            <StatTile icon="capsule" label="Prescriptions" value="12" trend="2 active" trendDir="up" />
            <StatTile icon="clipboard-pulse-fill" label="Lab results" value="38" trend="5 this month" trendDir="up" />
          </div>
        </div>

        <div className="m-section" style={{ padding: '4px 0' }}>
          <div className="m-section-head"><h2>Categories</h2></div>
          <MList>
            <MRow icon="capsule"               iconTone="purple" title="Prescriptions"   sub="12 records · 2 active" trailing="" />
            <MRow icon="clipboard-pulse-fill"  iconTone="blue"   title="Lab results"     sub="38 records · A1c due in 9 days" />
            <MRow icon="camera-fill"           iconTone="green"  title="Imaging & scans" sub="6 records · MRI Apr 2026" />
            <MRow icon="bandaid-fill"          iconTone="red"    title="Visits & discharge" sub="14 records" />
            <MRow icon="shield-fill-check"     iconTone="amber"  title="Allergies & conditions" sub="3 entries · Penicillin, T2D, Asthma" />
          </MList>
        </div>

        <div className="m-section" style={{ padding: '4px 0' }}>
          <div className="m-section-head"><h2>Recent activity</h2><a className="link" href="#">All</a></div>
          <MList>
            <MRow icon="upload"      iconTone="green"  title="Lipid panel uploaded" sub="Mercy General · today" trailing="OCR'd" chev={false} />
            <MRow icon="share-fill"  iconTone="blue"   title="Shared with Dr. Rao"   sub="Cardiology · expires 7d" trailing="●" chev={false} />
            <MRow icon="hourglass-split" iconTone="amber" title="A1c result pending" sub="Quest Diagnostics · 3 days" chev={false} />
          </MList>
        </div>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. EHR Detail — single lab result / prescription
// ─────────────────────────────────────────────────────────────
function ScreenEhrDetail() {
  return (
    <React.Fragment>
      <MHeader
        leading={<MIconBtn icon="chevron-left" />}
        title="Lipid Panel"
        trailing={<MIconBtn icon="share" />}
      />
      <div className="scroll" style={{ padding: '4px 16px 16px' }}>
        {/* meta block */}
        <div className="m-card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <span className="ico tone-blue" style={{ width: 44, height: 44, borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              <i className="bi bi-clipboard-pulse-fill" />
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, margin: 0 }}>Lab result</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: 0, letterSpacing: '-0.015em' }}>Quest Diagnostics</h2>
            </div>
            <MStatus tone="green">Normal</MStatus>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: 0 }}>
            Collected Tue May 12 · Reviewed by Dr. A. Rao · Ref #LP-22841
          </p>
        </div>

        <div className="m-section-head" style={{ margin: '8px 0' }}><h2>Values</h2></div>
        <MList>
          <MRow icon="heart-fill" iconTone="red"   title="LDL Cholesterol"  sub="Optimal: < 100 mg/dL"  trailingStrong="92 mg/dL" trailing="Normal" chev={false} />
          <MRow icon="heart-fill" iconTone="green" title="HDL Cholesterol"  sub="Optimal: > 60 mg/dL"   trailingStrong="64 mg/dL" trailing="Normal" chev={false} />
          <MRow icon="droplet-fill" iconTone="amber" title="Triglycerides" sub="Optimal: < 150 mg/dL" trailingStrong="172 mg/dL" trailing="Borderline" chev={false} />
          <MRow icon="speedometer2" iconTone="blue" title="Total / HDL ratio" sub="Optimal: < 5.0"     trailingStrong="3.4" trailing="Normal" chev={false} />
        </MList>

        <div style={{ height: 12 }} />
        <MBanner tone="warn" title="One value to watch">
          Your triglycerides are slightly elevated. Diet adjustments usually move this back into range.
        </MBanner>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <MButton variant="primary" icon="share" block>Share with a doctor</MButton>
          <MButton variant="secondary" icon="download" />
        </div>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// 7. DOCTORS — list with filters
// ─────────────────────────────────────────────────────────────
function ScreenDoctors() {
  return (
    <React.Fragment>
      <MLargeHead
        greeting="Consult"
        title="Find a doctor"
        trailing={<MIconBtn icon="sliders" />}
      />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <MSearch placeholder="Specialty, name, condition" />
        <div className="row" style={{ marginTop: 12, marginBottom: 8 }}>
          <MChip active icon="lightning-charge-fill">Available now</MChip>
          <MChip>Video</MChip>
          <MChip>In person</MChip>
          <MChip>Top rated</MChip>
        </div>

        <div className="row-gap" style={{ marginTop: 12 }}>
          <DocCard initials="AR" avatarTone="blue" name="Dr. Amita Rao" role="Cardiologist · 14 yr exp" rating="4.9 (412)" distance="2.1 mi" price="$45" online />
          <DocCard initials="MR" avatarTone="purple" name="Dr. Marcus Rivera" role="General Physician · 8 yr exp" rating="4.8 (1.2k)" distance="0.8 mi" price="$30" online />
          <DocCard initials="LI" avatarTone="green" name="Dr. Lakshmi Iyer" role="Pediatrician · 11 yr exp" rating="4.9 (689)" distance="3.4 mi" price="$38" />
          <DocCard initials="RD" avatarTone="red" name="Dr. Rina Desai" role="Internal Medicine · 9 yr" rating="4.7 (320)" distance="1.7 mi" price="$35" online />
        </div>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. BOOKING — doctor detail + time slots
// ─────────────────────────────────────────────────────────────
function ScreenBooking() {
  const days = [
    { d: 'Mon', n: 24, free: false },
    { d: 'Tue', n: 25, free: true, active: true },
    { d: 'Wed', n: 26, free: true },
    { d: 'Thu', n: 27, free: false },
    { d: 'Fri', n: 28, free: true },
  ];
  return (
    <React.Fragment>
      <MHeader
        leading={<MIconBtn icon="chevron-left" />}
        title="Book appointment"
        trailing={<MIconBtn icon="heart" />}
      />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <DocCard initials="AR" avatarTone="blue" name="Dr. Amita Rao" role="Cardiologist · Mercy General" rating="4.9 (412)" distance="2.1 mi" price="$45" online />

        <div style={{ display: 'flex', gap: 8, marginTop: 14, marginBottom: 14 }}>
          <MChip active>Video</MChip>
          <MChip>Voice</MChip>
          <MChip>In person</MChip>
          <MChip>Chat</MChip>
        </div>

        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', margin: '6px 0 10px' }}>
          May · this week
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {days.map(d => (
            <button key={d.n} className={`m-chip ${d.active ? 'active' : ''}`} style={{
              flexDirection: 'column', gap: 2, padding: '10px 0',
              opacity: d.free ? 1 : 0.4, justifyContent: 'center',
            }}>
              <span style={{ fontSize: 10, fontWeight: 600 }}>{d.d}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800 }}>{d.n}</span>
            </button>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-muted)', margin: '20px 0 10px' }}>
          Available slots · Tue May 25
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {['9:00 AM','10:30','11:15','1:45 PM','3:00','4:30','5:15','6:00','7:45'].map((s, i) => (
            <button key={s} className={`m-chip ${i === 4 ? 'active' : ''}`} style={{ justifyContent: 'center', padding: '10px 0', fontSize: 13 }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ height: 16 }} />
        <MBanner tone="success" title="Notes will sync">
          Visit notes and prescriptions will be added to your vault automatically.
        </MBanner>

        <div style={{ height: 14 }} />
        <MButton variant="primary" block iconRight="arrow-right">Confirm · Tue 3:00 PM</MButton>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. VIDEO CALL — in-consult
// ─────────────────────────────────────────────────────────────
function ScreenVideoCall() {
  return (
    <div style={{ position: 'relative', flex: 1, background: '#0e0d12', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* "Doctor video" full bleed */}
      <div style={{
        flex: 1,
        background:
          'radial-gradient(circle at 50% 35%, rgba(168,85,247,.35), transparent 55%), linear-gradient(180deg, #2c1a4d, #0e0d12)',
        position: 'relative',
      }}>
        {/* doctor "avatar" placeholder */}
        <div style={{
          position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 140, height: 140, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #6d28d9)',
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 50,
          boxShadow: '0 12px 40px rgba(124,58,237,.5)',
        }}>AR</div>

        {/* top status */}
        <div style={{ position: 'absolute', top: 60, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            padding: '6px 10px', borderRadius: 99,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: '#22c55e' }} />
            12:24
          </div>
          <div style={{ padding: '6px 10px', borderRadius: 99, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)', fontSize: 11, fontWeight: 600 }}>
            <i className="bi bi-translate" /> EN ↔ HI
          </div>
        </div>

        {/* self preview */}
        <div style={{
          position: 'absolute', top: 110, right: 16,
          width: 80, height: 110, borderRadius: 14,
          background: 'linear-gradient(135deg, #475569, #1e293b)',
          border: '2px solid rgba(255,255,255,.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)',
        }}>JP</div>

        {/* doctor name */}
        <div style={{ position: 'absolute', bottom: 130, left: 16, right: 16, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, margin: 0 }}>Dr. Amita Rao</h2>
          <p style={{ fontSize: 12, opacity: 0.7, margin: '4px 0 0' }}>Cardiology consult · Notes recording</p>
        </div>
      </div>

      {/* controls */}
      <div style={{
        background: 'rgba(255,255,255,.08)',
        backdropFilter: 'blur(20px)',
        padding: '18px 20px 38px',
        display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center',
      }}>
        {[
          { i: 'mic-fill',  bg: 'rgba(255,255,255,.14)' },
          { i: 'camera-video-fill',  bg: 'rgba(255,255,255,.14)' },
          { i: 'chat-square-text-fill', bg: 'rgba(255,255,255,.14)' },
          { i: 'telephone-x-fill', bg: '#dc2626', big: true },
        ].map((b, i) => (
          <button key={i} style={{
            width: b.big ? 60 : 48, height: b.big ? 60 : 48,
            borderRadius: '50%', border: 0, color: '#fff',
            background: b.bg, cursor: 'pointer',
            fontSize: b.big ? 22 : 18,
            boxShadow: b.big ? '0 8px 24px rgba(220,38,38,.45)' : 'none',
          }}>
            <i className={`bi bi-${b.i}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 10. PROFILE / MORE
// ─────────────────────────────────────────────────────────────
function ScreenProfile() {
  return (
    <React.Fragment>
      <MLargeHead title="You" trailing={<MIconBtn icon="gear" />} />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        {/* identity card */}
        <div className="m-card" style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'linear-gradient(135deg, #a855f7, #6d28d9)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
          }}>JP</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, margin: 0, letterSpacing: '-0.01em' }}>Jordan Patel</h3>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '2px 0 6px' }}>+1 (415) 555-0142 · jordan@email.com</p>
            <MStatus tone="green"><i className="bi bi-shield-fill-check" />Vault verified</MStatus>
          </div>
        </div>

        <div className="m-section" style={{ padding: '4px 0' }}>
          <div className="m-section-head"><h2>Account</h2></div>
          <MList>
            <MRow icon="person-vcard-fill" iconTone="blue"  title="Personal info"     sub="Name, DOB, address" />
            <MRow icon="people-fill"       iconTone="red"   title="Emergency contacts" sub="3 contacts" trailing="3" />
            <MRow icon="credit-card-2-front-fill" iconTone="purple" title="Insurance" sub="Aetna · PPO" />
            <MRow icon="people-fill"       iconTone="green" title="Family vaults"     sub="Mom · Dad · Aanya" trailing="3" />
          </MList>
        </div>

        <div className="m-section" style={{ padding: '4px 0' }}>
          <div className="m-section-head"><h2>Preferences</h2></div>
          <MList>
            <MRow icon="bell-fill"  iconTone="amber" title="Notifications" />
            <MRow icon="translate" iconTone="blue"   title="Language" trailing="English" />
            <MRow icon="moon-stars-fill" iconTone="purple" title="Appearance" trailing="System" />
            <MRow icon="shield-lock-fill" iconTone="red" title="Privacy & data" />
          </MList>
        </div>

        <div className="m-section" style={{ padding: '4px 0' }}>
          <div className="m-section-head"><h2>Support</h2></div>
          <MList>
            <MRow icon="question-circle-fill" iconTone="gray" title="Help center" />
            <MRow icon="chat-left-dots-fill"  iconTone="gray" title="Contact support" />
            <MRow icon="box-arrow-right"      iconTone="red"  title="Sign out" chev={false} />
          </MList>
        </div>
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// 11. BOTTOM SHEET DEMO — diet hand-off
// ─────────────────────────────────────────────────────────────
function ScreenSheetDemo() {
  return (
    <React.Fragment>
      <MLargeHead greeting="Diet" title="Nutrition" />
      <div className="scroll" style={{ padding: '8px 16px 0', opacity: 0.5, filter: 'blur(2px)' }}>
        <MList>
          <MRow icon="apple" iconTone="green" title="Today's meal plan" sub="1,820 kcal · Mediterranean" />
          <MRow icon="cup-hot-fill" iconTone="amber" title="Recipes" sub="Quick · for diabetes" />
          <MRow icon="basket-fill" iconTone="blue" title="Grocery list" sub="9 items" />
        </MList>
      </div>
      <BottomSheet
        title="Hand off to MyFoodCraving?"
        sub="Diet & nutrition lives in our partner app. We'll pass your conditions and meds so meal plans match."
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 14, marginBottom: 14 }}>
          <span className="ico tone-green" style={{ width: 40, height: 40, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            <i className="bi bi-apple" />
          </span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, margin: 0 }}>MyFoodCraving</p>
            <p style={{ fontSize: 11.5, color: 'var(--fg-muted)', margin: '2px 0 0' }}>Free · Will open in app</p>
          </div>
          <MStatus tone="green">Linked</MStatus>
        </div>
        <MButton variant="primary" block iconRight="box-arrow-up-right">Open MyFoodCraving</MButton>
        <div style={{ height: 8 }} />
        <MButton variant="ghost" block>Not now</MButton>
      </BottomSheet>
    </React.Fragment>
  );
}

Object.assign(window, {
  ScreenOnboarding, ScreenOtp, ScreenSosHome, ScreenSosActive,
  ScreenEhr, ScreenEhrDetail, ScreenDoctors, ScreenBooking,
  ScreenVideoCall, ScreenProfile, ScreenSheetDemo,
});
