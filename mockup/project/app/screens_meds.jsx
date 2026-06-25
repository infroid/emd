// screens_meds.jsx — prescriptions list, medication detail, diet hand-off sheet.

const { useState } = React;

function ScreenRx({ nav }) {
  const { RX } = window.DB;
  const active = RX.filter(r => r.active);
  const done = RX.filter(r => !r.active);
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Medications" trailing={<MIconBtn icon="plus-lg" onClick={() => nav.toast('Add a medication', 'capsule')} />} />
      <div className="scroll" style={{ padding: '12px 16px 16px' }}>
        {/* adherence summary */}
        <div className="rings-card" style={{ background: 'radial-gradient(130% 95% at 100% 0%, rgba(59,130,246,.14), transparent 55%), var(--bg-1)' }}>
          <div className="head">
            <div>
              <div className="score">94<small> %</small></div>
              <p className="lbl">7-day adherence · great work</p>
            </div>
            <Ring value={94} size={62} stroke={7} color="#2563eb" track="rgba(128,128,128,.18)"><I name="capsule" style={{ color: '#2563eb', fontSize: 18 }} /></Ring>
          </div>
          <div className="rings-row">
            <div className="ring-chip"><div className="v">2</div><div className="k">Active</div></div>
            <div className="ring-chip"><div className="v">1</div><div className="k">Refill soon</div></div>
            <div className="ring-chip"><div className="v">3</div><div className="k">Reminders</div></div>
          </div>
        </div>

        <div className="spacer-16" />
        <SectionLabel>Active</SectionLabel>
        <div className="stack-10">
          {active.map(r => (
            <button key={r.id} className="rx-card tap" style={{ width: '100%', textAlign: 'left' }} onClick={() => nav.push('rxDetail', { id: r.id })}>
              <span className={`pillico ico tone-${r.tone}`}><I name={r.icon} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, margin: 0, color: 'var(--fg-1)' }}>{r.name} <span style={{ color: 'var(--fg-muted)', fontWeight: 500, fontSize: 13 }}>{r.dose}</span></p>
                  {r.left <= 1 ? <MStatus tone="red" dot={false}>Refill</MStatus> : <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{r.left} left</span>}
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', margin: '3px 0 7px' }}>{r.freq} · {r.by}</p>
                <div className="linebar"><i style={{ width: `${r.adherence}%` }} /></div>
              </div>
            </button>
          ))}
        </div>

        <div className="spacer-16" />
        <SectionLabel>Completed</SectionLabel>
        <MList>
          {done.map(r => <MRow key={r.id} icon={r.icon} iconTone="gray" title={`${r.name} · ${r.dose}`} sub={`${r.freq} · ${r.by}`} chev={false} onClick={() => nav.push('rxDetail', { id: r.id })} />)}
        </MList>
      </div>
    </React.Fragment>
  );
}

function ScreenRxDetail({ nav, params }) {
  const r = window.DB.RX.find(x => x.id === params.id) || window.DB.RX[0];
  const sched = [['sunrise-fill', 'Morning', '8:00 AM', true], ['sun-fill', 'Midday', '1:00 PM', r.freq.includes('Twice')], ['moon-stars-fill', 'Night', '9:00 PM', r.freq.includes('night')]];
  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title={r.name} trailing={<MIconBtn icon="three-dots" />} />
      <div className="scroll" style={{ padding: '12px 16px 16px' }}>
        <div className="card-soft" style={{ textAlign: 'center', marginBottom: 14 }}>
          <span className={`ico tone-${r.tone}`} style={{ width: 64, height: 64, borderRadius: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto' }}><I name={r.icon} /></span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, margin: '12px 0 2px' }}>{r.name} {r.dose}</h2>
          <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>{r.freq} · prescribed by {r.by}</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <div className="card-soft" style={{ flex: 1, textAlign: 'center' }}>
            <Ring value={r.adherence} size={64} stroke={7} color="var(--emd-success)" track="var(--bg-3)" ><span className="metric-hero" style={{ fontSize: 16 }}>{r.adherence}%</span></Ring>
            <p className="muted" style={{ fontSize: 11, margin: '8px 0 0', textTransform: 'uppercase', letterSpacing: '.05em' }}>Adherence</p>
          </div>
          <div className="card-soft" style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="metric-hero" style={{ fontSize: 30, color: r.left <= 1 ? 'var(--accent)' : 'var(--fg-1)' }}>{r.left}</div>
            <p className="muted" style={{ fontSize: 11, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '.05em' }}>Doses left</p>
          </div>
          <div className="card-soft" style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="metric-hero" style={{ fontSize: 30 }}>{r.refills}</div>
            <p className="muted" style={{ fontSize: 11, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '.05em' }}>Refills</p>
          </div>
        </div>

        <SectionLabel>Daily schedule</SectionLabel>
        <MList style={{ marginBottom: 14 }}>
          {sched.filter(s => s[3]).map(s => (
            <MRow key={s[1]} icon={s[0]} iconTone="amber" title={s[1]} sub={`Take 1 tablet`} trailingStrong={s[2]} chev={false}
              right={<MSwitch on onChange={() => {}} />} />
          ))}
        </MList>

        {r.active && (
          <React.Fragment>
            {r.left <= 1 && <MBanner tone="warn" title="Running low">Only {r.left} dose left. Request a refill so you don't miss a day.</MBanner>}
            <div className="spacer-12" />
            <div style={{ display: 'flex', gap: 8 }}>
              <MButton variant="primary" block icon="arrow-repeat" onClick={() => { nav.pop(); nav.toast('Refill requested', 'check-circle-fill'); }}>Request refill</MButton>
              <MButton variant="secondary" icon="bell" onClick={() => nav.toast('Reminders on', 'bell-fill')} />
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

function ScreenDietSheet({ nav }) {
  return (
    <React.Fragment>
      <MLargeHead greeting="Diet" title="Nutrition" />
      <div className="scroll" style={{ padding: '8px 16px 0', opacity: 0.45, filter: 'blur(2px)', pointerEvents: 'none' }}>
        <MList>
          <MRow icon="apple" iconTone="green" title="Today's meal plan" sub="1,820 kcal · Mediterranean" />
          <MRow icon="cup-hot-fill" iconTone="amber" title="Recipes" sub="Quick · for diabetes" />
          <MRow icon="basket-fill" iconTone="blue" title="Grocery list" sub="9 items" />
        </MList>
      </div>
      <BottomSheet title="Hand off to MyFoodCraving?" sub="Diet & nutrition lives in our partner app. We'll pass your conditions and meds so meal plans match." onClose={() => nav.pop()}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 12px', background: 'var(--bg-2)', borderRadius: 14, marginBottom: 14 }}>
          <span className="ico tone-green" style={{ width: 40, height: 40, borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><I name="apple" /></span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, margin: 0, color: 'var(--fg-1)' }}>MyFoodCraving</p>
            <p style={{ fontSize: 11.5, color: 'var(--fg-muted)', margin: '2px 0 0' }}>Free · Will open in app</p>
          </div>
          <MStatus tone="green">Linked</MStatus>
        </div>
        <MButton variant="primary" block iconRight="box-arrow-up-right" onClick={() => { nav.pop(); nav.toast('Opening MyFoodCraving…', 'box-arrow-up-right'); }}>Open MyFoodCraving</MButton>
        <div style={{ height: 8 }} />
        <MButton variant="ghost" block onClick={() => nav.pop()}>Not now</MButton>
      </BottomSheet>
    </React.Fragment>
  );
}

Object.assign(window, { ScreenRx, ScreenRxDetail, ScreenDietSheet });
