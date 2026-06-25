// screens_home.jsx — the unified Home dashboard.

function ScreenHome({ nav }) {
  const { USER, APPTS, RX } = window.DB;
  const next = APPTS.find(a => a.status === 'upcoming');
  const rings = [
    { k: 'Heart', v: '76', color: '#f87171', val: 76, icon: 'heart-pulse-fill' },
    { k: 'Move', v: '64', color: '#fbbf24', val: 64, icon: 'fire' },
    { k: 'Glucose', v: '112', color: '#4ade80', val: 80, icon: 'droplet-fill' },
  ];
  const quick = [
    { i: 'heart-pulse-fill', l: 'SOS', tone: 'red', go: ['sos', {}] },
    { i: 'calendar-plus-fill', l: 'Book', tone: 'purple', go: ['doctors', {}] },
    { i: 'person-bounding-box', l: 'Body 3D', tone: 'blue', go: ['anatomy', {}] },
    { i: 'capsule', l: 'Meds', tone: 'green', go: ['rx', {}] },
  ];
  return (
    <React.Fragment>
      <div className="home-hero">
        <div className="home-greet">
          <div className="who">
            <Avatar tone={USER.tone}>{USER.initials}</Avatar>
            <div>
              <p className="hi">Good morning,</p>
              <p className="name">{USER.first}</p>
            </div>
          </div>
          <MIconBtn icon="bell" onClick={() => nav.push('notifications')} />
        </div>
      </div>

      <div className="scroll" style={{ padding: '4px 18px 16px' }}>
        {/* Health rings hero */}
        <div className="rings-card tap" onClick={() => nav.push('anatomy')}>
          <div className="head">
            <div>
              <div className="score">{USER.healthScore}<small> / 100</small></div>
              <p className="lbl">Health score · trending up</p>
            </div>
            <Ring value={USER.healthScore} size={62} stroke={7} color="#16a34a" track="rgba(128,128,128,.18)">
              <I name="activity" style={{ color: '#16a34a', fontSize: 20 }} />
            </Ring>
          </div>
          <div className="rings-row">
            {rings.map(r => (
              <div className="ring-chip" key={r.k}>
                <Ring value={r.val} size={34} stroke={4} color={r.color} track="rgba(128,128,128,.18)">
                  <I name={r.icon} style={{ color: r.color, fontSize: 12 }} />
                </Ring>
                <div><div className="v">{r.v}</div><div className="k">{r.k}</div></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, position: 'relative', zIndex: 1, fontSize: 12, color: 'var(--fg-muted)' }}>
            <I name="hand-index-thumb" /> Tap to open your interactive body map
          </div>
        </div>

        <div style={{ height: 16 }} />
        <div className="quick-grid">
          {quick.map(q => (
            <button key={q.l} className="quick" onClick={() => nav.push(...q.go)}>
              <span className={`qi ico tone-${q.tone}`}><I name={q.i} /></span>
              <span className="ql">{q.l}</span>
            </button>
          ))}
        </div>

        {/* Next appointment */}
        {next && (
          <React.Fragment>
            <div style={{ height: 18 }} />
            <SectionLabel action="All" onAction={() => nav.push('appointments')}>Up next</SectionLabel>
            <div className="up-card tap" onClick={() => nav.push('appointments')}>
              <Avatar tone={next.tone} size={46} radius={15}>{next.initials}</Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, margin: 0, color: 'var(--fg-1)' }}>{next.doc}</p>
                <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '2px 0 0' }}>{next.spec}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, margin: 0, color: 'var(--accent-text)' }}>{next.time}</p>
                <p style={{ fontSize: 11.5, color: 'var(--fg-muted)', margin: '2px 0 0' }}>{next.when}</p>
              </div>
            </div>
          </React.Fragment>
        )}

        {/* Today's meds */}
        <div style={{ height: 18 }} />
        <SectionLabel action="Manage" onAction={() => nav.push('rx')}>Today's medications</SectionLabel>
        <MList>
          {RX.filter(r => r.active).slice(0, 2).map(r => (
            <MRow key={r.id} icon={r.icon} iconTone={r.tone} title={`${r.name} · ${r.dose}`} sub={r.freq}
              chev={false} onClick={() => nav.push('rxDetail', { id: r.id })}
              right={<MChip tonal style={{ pointerEvents: 'none' }} icon="check2">Taken</MChip>} />
          ))}
        </MList>

        {/* Diet teaser */}
        <div style={{ height: 18 }} />
        <div className="card-soft tap" onClick={() => nav.sheet('dietSheet')} style={{ display: 'flex', gap: 13, alignItems: 'center', background: 'linear-gradient(135deg, rgba(22,163,74,.10), rgba(22,163,74,.02))', borderColor: 'rgba(22,163,74,.2)' }}>
          <span className="ico tone-green" style={{ width: 44, height: 44, borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><I name="apple" /></span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, margin: 0, color: 'var(--fg-1)' }}>Today's meal plan</p>
            <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '2px 0 0' }}>1,820 kcal · tuned for diabetes</p>
          </div>
          <I name="chevron-right" style={{ color: 'var(--fg-muted)' }} />
        </div>

        {/* Recent activity */}
        <div style={{ height: 18 }} />
        <SectionLabel>Recent activity</SectionLabel>
        <div className="card-soft">
          <div className="timeline">
            <div className="tl-item blue">
              <div className="when">Today · 9:02 AM</div>
              <div className="what">Lipid panel uploaded &amp; OCR'd</div>
              <span className="link" style={{ fontSize: 12, color: 'var(--accent-text)', cursor: 'pointer' }} onClick={() => nav.push('labDetail', { id: 'lipid' })}>View result</span>
            </div>
            <div className="tl-item green">
              <div className="when">Yesterday</div>
              <div className="what">Shared records with Dr. Rao</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Cardiology · expires in 7 days</div>
            </div>
            <div className="tl-item" style={{ paddingBottom: 0 }}>
              <div className="when">Sat · 9:14 PM</div>
              <div className="what">SOS test alert — resolved</div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { ScreenHome });
