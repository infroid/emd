// screens_sos.jsx — SOS home (hold to dispatch), active dispatch, contacts, medical profile.

const { useState, useEffect, useRef } = React;

function ScreenSos({ nav }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const timer = useRef(null);
  const start = useRef(0);
  const HOLD = 3000;

  const tick = () => {
    const p = Math.min(1, (Date.now() - start.current) / HOLD);
    setProgress(p);
    if (p >= 1) { stop(true); nav.replace('sosActive'); }
  };
  const begin = (e) => { e.preventDefault(); setHolding(true); start.current = Date.now(); clearInterval(timer.current); timer.current = setInterval(tick, 40); };
  const stop = (done) => { clearInterval(timer.current); setHolding(false); if (!done) setProgress(0); };
  useEffect(() => () => clearInterval(timer.current), []);

  const { CONTACTS } = window.DB;
  return (
    <React.Fragment>
      <MHeader leading={<MIconBtn icon="list" />} title="SOS Emergency" trailing={<MIconBtn icon="bell" onClick={() => nav.push('notifications')} />} />
      <div className="scroll" style={{ padding: '0 16px 16px' }}>
        <div className="sos-stage">
          <MStatus tone="green">All systems ready</MStatus>
          <SosBig progress={progress} holding={holding}
            sub={holding ? 'Keep holding…' : 'Hold 3s to dispatch'}
            onPointerDown={begin} onPointerUp={() => stop(false)} onPointerLeave={() => stop(false)} />
          <p className="sos-instruct">
            <strong>{holding ? 'Release to cancel' : 'Hold for 3 seconds'}</strong> to dispatch emergency services with your live location.
          </p>
        </div>

        <div className="m-section" style={{ padding: '8px 0' }}>
          <div className="m-section-head"><h2>What gets shared</h2></div>
          <MList>
            <MRow icon="geo-alt-fill" iconTone="red" title="Location sharing" sub="On · 415 Mission St" trailing="6 m ago" chev={false} />
            <MRow icon="people-fill" iconTone="blue" title="Emergency contacts" sub="3 contacts will be notified" onClick={() => nav.push('contacts')} />
            <MRow icon="capsule" iconTone="purple" title="Medical profile" sub="Penicillin allergy · Type II diabetes" onClick={() => nav.push('medical')} />
          </MList>
        </div>

        <div className="m-section" style={{ padding: '8px 0' }}>
          <div className="m-section-head"><h2>Quick reach</h2></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="m-btn secondary block" style={{ flexDirection: 'column', height: 'auto', padding: '14px 8px', gap: 6 }} onClick={() => nav.push('contacts')}>
              <I name="telephone-fill" style={{ fontSize: 18, color: 'var(--accent)' }} /><span style={{ fontSize: 12 }}>Call 911</span>
            </button>
            <button className="m-btn secondary block" style={{ flexDirection: 'column', height: 'auto', padding: '14px 8px', gap: 6 }} onClick={() => nav.toast('Sharing location link…', 'geo-alt-fill')}>
              <I name="share-fill" style={{ fontSize: 18, color: 'var(--emd-info)' }} /><span style={{ fontSize: 12 }}>Share location</span>
            </button>
            <button className="m-btn secondary block" style={{ flexDirection: 'column', height: 'auto', padding: '14px 8px', gap: 6 }} onClick={() => nav.push('medical')}>
              <I name="file-medical-fill" style={{ fontSize: 18, color: 'var(--emd-doctor)' }} /><span style={{ fontSize: 12 }}>Med ID</span>
            </button>
          </div>
        </div>

        <div className="m-section" style={{ padding: '8px 0' }}>
          <div className="m-section-head"><h2>Recent incidents</h2><a className="link">All</a></div>
          <MList>
            <MRow icon="check2" iconTone="green" title="Test alert" sub="Saturday · 9:14 PM" trailingStrong="Resolved" chev={false} />
          </MList>
        </div>
      </div>
    </React.Fragment>
  );
}

function ScreenSosActive({ nav }) {
  const [secs, setSecs] = useState(384); // 6:24
  useEffect(() => { const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  const mm = Math.floor(secs / 60), ss = String(secs % 60).padStart(2, '0');
  return (
    <React.Fragment>
      <div className="band-red band-glow" style={{ padding: '40px 20px 24px', position: 'relative', overflow: 'hidden' }}>
        <MHeader variant="transparent"
          leading={<MBack light onClick={() => nav.reset('sos')} />}
          title="Emergency in progress"
          trailing={<button className="m-iconbtn ghost" style={{ color: '#fff' }}><I name="three-dots" /></button>} />
        <div style={{ position: 'relative', textAlign: 'center', marginTop: 12 }}>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', padding: '4px 12px', borderRadius: 99, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(8px)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#fff', animation: 'sosPulseBig 1.4s infinite' }} /> Dispatching
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 32, margin: '12px 0 4px', letterSpacing: '-0.02em' }}>Help is on the way</h2>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.88)', margin: 0 }}>ETA <strong style={{ color: '#fff' }}>{mm} min {ss} sec</strong> · Mercy General EMS-04</p>
        </div>
      </div>

      <div className="scroll" style={{ padding: '16px', flex: 1 }}>
        <div style={{ height: 150, borderRadius: 18, overflow: 'hidden', border: '1px solid var(--border-1)', background: 'linear-gradient(180deg, #e8f0ea, #d5e3d8)', position: 'relative', marginBottom: 12 }}>
          <svg width="100%" height="100%" viewBox="0 0 320 150" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <path d="M-20 90 Q 60 70 140 100 T 340 80" stroke="#fff" strokeWidth="8" fill="none" />
            <path d="M40 -10 L 80 170" stroke="#fff" strokeWidth="6" fill="none" />
            <path d="M220 -10 L 240 170" stroke="#fff" strokeWidth="6" fill="none" />
            <line x1="60" y1="44" x2="180" y2="95" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="5 4" />
            <circle cx="180" cy="95" r="10" fill="#dc2626" /><circle cx="180" cy="95" r="18" fill="rgba(220,38,38,.2)" />
            <circle cx="60" cy="44" r="7" fill="#3b82f6" />
          </svg>
          <div style={{ position: 'absolute', bottom: 8, left: 8, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,.95)', fontSize: 11, fontWeight: 600, color: '#1f2937' }}>
            <I name="geo-alt-fill" style={{ color: 'var(--accent)' }} /> 415 Mission St
          </div>
        </div>

        <MList>
          <MRow icon="person-arms-up" iconTone="blue" title="Dr. Marcus Rivera" sub="EMT-Paramedic · Mercy General" trailing="2.4 mi" chev={false} />
          <MRow icon="truck-front-fill" iconTone="red" title="EMS-04" sub="Ambulance dispatched · 6:42 PM" trailing={`${mm} min`} chev={false} />
          <MRow icon="telephone-forward-fill" iconTone="green" title="Call dispatcher" sub="Direct line to your responder" onClick={() => nav.toast('Calling dispatcher…', 'telephone-fill')} />
        </MList>
        <div style={{ height: 12 }} />
        <MBanner tone="info" title="Sharing automatically">Your live location, vitals, allergies, and emergency contacts have been sent to the responder.</MBanner>
        <div style={{ height: 12 }} />
        <MButton variant="secondary" block icon="x-circle" onClick={() => { nav.reset('sos'); nav.toast('Emergency cancelled', 'check-circle-fill'); }}>Cancel emergency</MButton>
      </div>
    </React.Fragment>
  );
}

function ScreenContacts({ nav }) {
  const { CONTACTS } = window.DB;
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Emergency contacts" trailing={<MIconBtn icon="plus-lg" onClick={() => nav.toast('Add a contact', 'person-plus-fill')} />} />
      <div className="scroll" style={{ padding: '12px 16px 16px' }}>
        <MBanner tone="info" title="Notified on every SOS">These people get your live location and condition the moment you dispatch.</MBanner>
        <div style={{ height: 14 }} />
        <div className="stack-10">
          {CONTACTS.map(c => (
            <div key={c.name} className="card-soft" style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
              <Avatar tone={c.tone} size={46} radius={15}>{c.initials}</Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, margin: 0, color: 'var(--fg-1)' }}>{c.name}</p>
                  {c.primary && <MStatus tone="red" dot={false}>Primary</MStatus>}
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '2px 0 0' }}>{c.rel} · {c.phone}</p>
              </div>
              <MIconBtn icon="telephone-fill" variant="solid" onClick={() => nav.toast(`Calling ${c.name.split(' ')[0]}…`, 'telephone-fill')} />
            </div>
          ))}
        </div>
        <div style={{ height: 14 }} />
        <MButton variant="secondary" block icon="person-plus-fill" onClick={() => nav.toast('Add a contact', 'person-plus-fill')}>Add emergency contact</MButton>
      </div>
    </React.Fragment>
  );
}

function ScreenMedical({ nav }) {
  const { USER } = window.DB;
  const [share, setShare] = useState({ allergies: true, conditions: true, meds: true, contacts: true });
  const facts = [
    { k: 'Blood type', v: USER.blood }, { k: 'Date of birth', v: USER.dob },
    { k: 'Height', v: USER.height }, { k: 'Weight', v: USER.weight },
  ];
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Medical profile" trailing={<MIconBtn icon="pencil" onClick={() => nav.toast('Edit medical profile', 'pencil')} />} />
      <div className="scroll" style={{ padding: '12px 16px 16px' }}>
        <div className="band-red band-glow" style={{ borderRadius: 22, padding: 18, position: 'relative', overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13 }}>
            <Avatar tone="red" size={52} radius={16} style={{ background: 'rgba(255,255,255,.2)' }}>{USER.initials}</Avatar>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, margin: 0 }}>{USER.name}</p>
              <p style={{ fontSize: 12.5, opacity: .9, margin: '2px 0 0' }}>{USER.age} · {USER.sex} · {USER.blood}</p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'center' }}><I name="qr-code" style={{ fontSize: 34 }} /><p style={{ fontSize: 9, margin: '2px 0 0', opacity: .85 }}>MED ID</p></div>
          </div>
        </div>

        <div className="card-soft" style={{ marginBottom: 14 }}>
          {facts.map(f => <div className="kv" key={f.k}><span className="k">{f.k}</span><span className="v">{f.v}</span></div>)}
        </div>

        <SectionLabel>Allergies</SectionLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {USER.allergies.map(a => <span key={a} className="m-status red" style={{ fontSize: 12, padding: '6px 12px' }}><I name="exclamation-triangle-fill" />{a}</span>)}
        </div>

        <SectionLabel>Conditions</SectionLabel>
        <MList style={{ marginBottom: 16 }}>
          {USER.conditions.map(c => <MRow key={c} icon="clipboard2-pulse-fill" iconTone="amber" title={c} chev={false} />)}
        </MList>

        <SectionLabel>Current medications</SectionLabel>
        <MList style={{ marginBottom: 16 }}>
          {USER.meds.map(m => <MRow key={m} icon="capsule" iconTone="purple" title={m} chev={false} />)}
        </MList>

        <SectionLabel>Share in an emergency</SectionLabel>
        <div className="card-soft">
          {[['allergies', 'Allergies'], ['conditions', 'Conditions'], ['meds', 'Medications'], ['contacts', 'Emergency contacts']].map(([key, label]) => (
            <div className="kv" key={key}><span className="k" style={{ color: 'var(--fg-1)', fontSize: 14 }}>{label}</span>
              <MSwitch on={share[key]} onChange={(v) => setShare({ ...share, [key]: v })} /></div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { ScreenSos, ScreenSosActive, ScreenContacts, ScreenMedical });
