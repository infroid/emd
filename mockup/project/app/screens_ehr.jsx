// screens_ehr.jsx — vault home, category list, lab detail, upload, share.

const { useState, useEffect } = React;

function ScreenEhr({ nav }) {
  const { REC_CATS } = window.DB;
  return (
    <React.Fragment>
      <MLargeHead greeting="Vault · Jordan Patel" title="Health Records" trailing={<MIconBtn icon="upload" onClick={() => nav.push('upload')} />} />
      <div className="scroll" style={{ padding: '8px 16px 16px' }}>
        <MSearch placeholder="Search records, prescriptions" onFocus={() => {}} />

        {/* Body map call-out — the signature entry */}
        <div className="spacer-16" />
        <div className="tap" onClick={() => nav.push('anatomy')} style={{
          borderRadius: 22, padding: 16, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 14px 30px -14px rgba(59,130,246,.6)',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, background: 'radial-gradient(circle, rgba(255,255,255,.25), transparent 70%)' }} />
          <span style={{ width: 50, height: 50, borderRadius: 16, background: 'rgba(255,255,255,.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}><I name="person-bounding-box" /></span>
          <div style={{ flex: 1, position: 'relative' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, margin: 0 }}>Explore your body in 3D</p>
            <p style={{ fontSize: 12.5, opacity: .9, margin: '3px 0 0', lineHeight: 1.4 }}>Tap any organ to see how it's doing and its linked records.</p>
          </div>
          <I name="chevron-right" style={{ position: 'relative' }} />
        </div>

        {/* Vault overview */}
        <div className="m-card" style={{ margin: '16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, margin: 0 }}>My vault</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', margin: '4px 0 0' }}>247 records</h3>
            </div>
            <MStatus tone="green"><I name="shield-fill-check" />Synced</MStatus>
          </div>
          <div className="stat-grid">
            <StatTile icon="capsule" label="Prescriptions" value="12" trend="2 active" trendDir="up" onClick={() => nav.push('rx')} />
            <StatTile icon="clipboard-pulse-fill" label="Lab results" value="38" trend="5 this month" trendDir="up" onClick={() => nav.push('catDetail', { id: 'labs' })} />
          </div>
        </div>

        <SectionLabel>Categories</SectionLabel>
        <MList>
          {REC_CATS.map(c => (
            <MRow key={c.id} icon={c.icon} iconTone={c.tone} title={c.title} sub={c.sub}
              onClick={() => nav.push(c.id === 'rx' ? 'rx' : 'catDetail', { id: c.id, title: c.title })} />
          ))}
        </MList>

        <div className="spacer-16" />
        <SectionLabel action="All">Recent activity</SectionLabel>
        <MList>
          <MRow icon="upload" iconTone="green" title="Lipid panel uploaded" sub="Mercy General · today" trailing="OCR'd" chev={false} onClick={() => nav.push('labDetail', { id: 'lipid' })} />
          <MRow icon="share-fill" iconTone="blue" title="Shared with Dr. Rao" sub="Cardiology · expires 7d" trailingStrong="●" chev={false} />
          <MRow icon="hourglass-split" iconTone="amber" title="A1c result pending" sub="Quest Diagnostics · 3 days" chev={false} />
        </MList>
      </div>
    </React.Fragment>
  );
}

function ScreenCat({ nav, params }) {
  const cat = window.DB.REC_CATS.find(c => c.id === params.id) || { title: params.title || 'Records', n: 6 };
  // synthesize a believable record list for the category
  const sample = {
    labs: [
      ['Lipid Panel', 'Quest Diagnostics · May 12', 'Normal', 'green', 'lipid'],
      ['A1c (HbA1c)', 'Quest Diagnostics · pending', 'Pending', 'amber'],
      ['Complete Blood Count', 'Mercy General · Apr 02', 'Normal', 'green'],
      ['Thyroid (TSH)', 'LabCorp · Mar 18', 'Normal', 'green'],
      ['Vitamin D', 'LabCorp · Mar 18', 'Low', 'red'],
    ],
    imaging: [
      ['Chest X-ray', 'Mercy General · Apr 2026', 'Clear', 'green'],
      ['Knee MRI', 'BayImaging · Apr 2026', 'Reviewed', 'blue'],
      ['Abdominal US', 'Mercy General · Jan 2026', 'Normal', 'green'],
    ],
    visits: [
      ['ER discharge', 'Mercy General · Feb 2026', 'Summary', 'blue'],
      ['Cardiology consult', 'Dr. Rao · Jan 2026', 'Notes', 'purple'],
      ['Annual physical', 'Dr. Rivera · 2025', 'Notes', 'green'],
    ],
    cond: [
      ['Type II diabetes', 'Diagnosed 2021 · managed', 'Active', 'amber'],
      ['Asthma', 'Mild · controlled', 'Active', 'blue'],
      ['Penicillin allergy', 'Severe reaction', 'Alert', 'red'],
    ],
    vax: [
      ['Influenza', 'Oct 2025', 'Up to date', 'green'],
      ['COVID-19 booster', 'Sep 2025', 'Up to date', 'green'],
      ['Tdap', '2022', 'Due 2032', 'blue'],
    ],
  }[params.id] || [['Record', 'Today', 'Saved', 'gray']];

  const tones = { green: 'green', amber: 'amber', red: 'red', blue: 'blue', purple: 'purple' };
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title={cat.title} trailing={<MIconBtn icon="funnel" />} />
      <div className="scroll" style={{ padding: '12px 16px 16px' }}>
        <p className="muted" style={{ fontSize: 13, margin: '0 0 12px' }}>{sample.length} records · newest first</p>
        <MList>
          {sample.map((r, i) => (
            <MRow key={i} icon={cat.icon || 'file-earmark-medical'} iconTone={tones[r[3]] || 'gray'} title={r[0]} sub={r[1]}
              trailingStrong={r[2]} onClick={() => r[4] ? nav.push('labDetail', { id: r[4] }) : nav.toast('Opening record…', 'file-earmark-text')} />
          ))}
        </MList>
        <div className="spacer-16" />
        <MButton variant="secondary" block icon="upload" onClick={() => nav.push('upload')}>Add to {cat.title.toLowerCase()}</MButton>
      </div>
    </React.Fragment>
  );
}

function ScreenLabDetail({ nav, params }) {
  const lab = window.DB.LABS.find(l => l.id === (params.id || 'lipid')) || window.DB.LABS[0];
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title={lab.title} trailing={<MIconBtn icon="share" onClick={() => nav.push('share', { what: lab.title })} />} />
      <div className="scroll" style={{ padding: '4px 16px 16px' }}>
        <div className="m-card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
            <span className="ico tone-blue" style={{ width: 44, height: 44, borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><I name="clipboard-pulse-fill" /></span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, margin: 0 }}>Lab result</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: 0 }}>{lab.lab}</h2>
            </div>
            <MStatus tone={lab.tone}>{lab.status}</MStatus>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: 0 }}>Collected {lab.date} · Reviewed by Dr. A. Rao · Ref #LP-22841</p>
        </div>

        <SectionLabel>Values</SectionLabel>
        <MList>
          {lab.values.map(v => (
            <MRow key={v.name} icon={v.icon} iconTone={v.tone} title={v.name} sub={v.ref} trailingStrong={`${v.val}${v.unit ? ' ' + v.unit : ''}`} trailing={v.flag} chev={false} />
          ))}
        </MList>
        <div className="spacer-12" />
        <MBanner tone="warn" title="One value to watch">Your triglycerides are slightly elevated. Diet adjustments usually move this back into range.</MBanner>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <MButton variant="primary" icon="share" block onClick={() => nav.push('share', { what: lab.title })}>Share with a doctor</MButton>
          <MButton variant="secondary" icon="download" onClick={() => nav.toast('Downloaded PDF', 'download')} />
        </div>
      </div>
    </React.Fragment>
  );
}

function ScreenUpload({ nav }) {
  const [stage, setStage] = useState('pick'); // pick | progress | done
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (stage !== 'progress') return;
    const t = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(t); setStage('done'); return 100; } return p + 8; }), 120);
    return () => clearInterval(t);
  }, [stage]);

  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Add to vault" />
      <div className="scroll" style={{ padding: '14px 18px 18px' }}>
        {stage === 'pick' && (
          <React.Fragment>
            <p className="muted" style={{ fontSize: 13.5, margin: '0 0 16px', lineHeight: 1.5 }}>We'll auto-read (OCR) the document and file it in the right category.</p>
            <div className="stack-12">
              {[
                ['camera-fill', 'green', 'Scan with camera', 'Snap a lab report or prescription'],
                ['image-fill', 'blue', 'Upload from photos', 'PDF, JPG or PNG'],
                ['hospital', 'purple', 'Connect a provider', 'Mercy General, Quest, LabCorp…'],
                ['heart-pulse', 'red', 'Sync from Apple Health', 'Vitals, steps, sleep'],
              ].map(([i, t, title, sub]) => (
                <button key={title} className="card-soft tap" style={{ display: 'flex', gap: 13, alignItems: 'center', textAlign: 'left', width: '100%', border: '1px solid var(--border-1)' }}
                  onClick={() => { setStage('progress'); setPct(0); }}>
                  <span className={`ico tone-${t}`} style={{ width: 46, height: 46, borderRadius: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 21 }}><I name={i} /></span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, margin: 0, color: 'var(--fg-1)' }}>{title}</p>
                    <p style={{ fontSize: 12, color: 'var(--fg-muted)', margin: '2px 0 0' }}>{sub}</p>
                  </div>
                  <I name="chevron-right" style={{ color: 'var(--fg-muted)' }} />
                </button>
              ))}
            </div>
          </React.Fragment>
        )}

        {stage === 'progress' && (
          <div style={{ textAlign: 'center', paddingTop: 50 }}>
            <Ring value={pct} size={130} stroke={10} color="var(--emd-info)" track="var(--bg-3)">
              <div className="metric-hero" style={{ fontSize: 30 }}>{pct}%</div>
            </Ring>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: '24px 0 6px' }}>Reading your document…</h3>
            <p className="muted" style={{ fontSize: 13.5 }}>Extracting values and matching them to your record categories.</p>
          </div>
        )}

        {stage === 'done' && (
          <div style={{ textAlign: 'center', paddingTop: 50 }}>
            <div style={{ width: 92, height: 92, borderRadius: '50%', background: 'rgba(22,163,74,.12)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <I name="check-lg" style={{ fontSize: 44, color: 'var(--emd-success)' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, margin: '14px 0 6px' }}>Added to your vault</h3>
            <p className="muted" style={{ fontSize: 13.5, maxWidth: 240, margin: '0 auto 22px' }}>Lipid Panel filed under Lab results and linked to your Heart.</p>
            <MButton variant="primary" block icon="eye" onClick={() => nav.replace('labDetail', { id: 'lipid' })}>View result</MButton>
            <div className="spacer-8" />
            <MButton variant="ghost" block onClick={() => nav.pop()}>Done</MButton>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

function ScreenShare({ nav, params }) {
  const { DOCTORS } = window.DB;
  const [pick, setPick] = useState('rao');
  const [expiry, setExpiry] = useState('7 days');
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Share securely" />
      <div className="scroll" style={{ padding: '14px 16px 16px' }}>
        <MBanner tone="info" title="Time-boxed access">The recipient sees only what you pick, and access auto-expires. You can revoke anytime.</MBanner>
        <div className="spacer-16" />
        <SectionLabel>Sharing</SectionLabel>
        <MList style={{ marginBottom: 16 }}>
          <MRow icon="file-earmark-medical-fill" iconTone="blue" title={params.what || 'Lipid Panel'} sub="1 lab result" chev={false} right={<MStatus tone="blue" dot={false}>Selected</MStatus>} />
        </MList>

        <SectionLabel>With</SectionLabel>
        <div className="stack-10" style={{ marginBottom: 16 }}>
          {DOCTORS.slice(0, 3).map(d => (
            <button key={d.id} className="card-soft tap" style={{ display: 'flex', gap: 12, alignItems: 'center', width: '100%', textAlign: 'left', border: `1.5px solid ${pick === d.id ? 'var(--accent)' : 'var(--border-1)'}` }} onClick={() => setPick(d.id)}>
              <Avatar tone={d.tone} size={42} radius={13}>{d.initials}</Avatar>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, margin: 0, color: 'var(--fg-1)' }}>{d.name}</p>
                <p style={{ fontSize: 12, color: 'var(--fg-muted)', margin: '2px 0 0' }}>{d.spec} · {d.hospital}</p>
              </div>
              <span style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${pick === d.id ? 'var(--accent)' : 'var(--border-2)'}`, background: pick === d.id ? 'var(--accent)' : 'transparent', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{pick === d.id && <I name="check-lg" />}</span>
            </button>
          ))}
        </div>

        <SectionLabel>Access expires after</SectionLabel>
        <div className="spacer-8" />
        <MSeg options={['24 hours', '7 days', '30 days']} value={expiry} onChange={setExpiry} />
        <div className="spacer-16" />
        <MButton variant="primary" block icon="shield-lock-fill" onClick={() => { nav.pop(); nav.toast(`Shared · expires in ${expiry}`, 'check-circle-fill'); }}>Generate secure link</MButton>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { ScreenEhr, ScreenCat, ScreenLabDetail, ScreenUpload, ScreenShare });
