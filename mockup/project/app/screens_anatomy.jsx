// screens_anatomy.jsx — signature interactive body map + organ drill-down.

const { useState } = React;

const scoreColor = s => s >= 85 ? '#16a34a' : s >= 73 ? '#f59e0b' : '#dc2626';
const scoreTone  = s => s >= 85 ? 'green'   : s >= 73 ? 'amber'   : 'red';
const scoreLabel = s => s >= 85 ? 'Excellent' : s >= 73 ? 'Good' : 'Watch';

// approximate screen position (%) of each organ for the floating tag
const ORGAN_POS = {
  brain:   { l: 50, t: 7 },
  lungs:   { l: 38, t: 28 },
  heart:   { l: 60, t: 30 },
  liver:   { l: 40, t: 41 },
  stomach: { l: 58, t: 44 },
  kidneys: { l: 38, t: 52 },
};

function BodyMap({ selected, onSelect }) {
  const { ORGANS } = window.DB;
  const oc = k => scoreColor(ORGANS[k].score);
  const organProps = k => ({
    className: `organ ${selected === k ? 'selected' : ''}`,
    fill: oc(k), fillOpacity: 0.92, stroke: 'rgba(255,255,255,.55)', strokeWidth: 1.5,
    onClick: () => onSelect(k),
  });
  return (
    <svg className="anatomy-svg" viewBox="0 0 220 430">
      {/* ---- body base ---- */}
      <g className="body-base">
        <circle cx="110" cy="40" r="28" />
        <rect x="98" y="62" width="24" height="22" rx="10" />
        <circle cx="62" cy="94" r="17" /><circle cx="158" cy="94" r="17" />
        <rect x="34" y="92" width="22" height="132" rx="11" />
        <rect x="164" y="92" width="22" height="132" rx="11" />
        <rect x="56" y="80" width="108" height="152" rx="36" />
        <rect x="64" y="198" width="92" height="64" rx="26" />
        <rect x="70" y="250" width="34" height="172" rx="16" />
        <rect x="116" y="250" width="34" height="172" rx="16" />
      </g>

      {/* center seam */}
      <line x1="110" y1="84" x2="110" y2="250" stroke="rgba(0,0,0,.05)" strokeWidth="1.5" />

      {/* ---- organs ---- */}
      {/* brain */}
      <ellipse cx="110" cy="35" rx="18" ry="13" {...organProps('brain')} />
      <path d="M110 23 V 47 M101 27 Q110 35 101 44 M119 27 Q110 35 119 44" stroke="rgba(255,255,255,.4)" strokeWidth="1.2" fill="none" pointerEvents="none" />
      {/* lungs */}
      <ellipse cx="92" cy="128" rx="15" ry="26" {...organProps('lungs')} />
      <ellipse cx="128" cy="128" rx="15" ry="26" {...organProps('lungs')} />
      {/* heart */}
      <path d="M114 116 C110 109 99 111 99 121 C99 130 109 137 114 141 C119 137 129 130 129 121 C129 111 118 109 114 116 Z" {...organProps('heart')} />
      {/* liver */}
      <path d="M78 156 Q104 148 116 158 Q112 176 92 176 Q80 174 78 156 Z" {...organProps('liver')} />
      {/* stomach / digestive */}
      <path d="M118 166 Q134 164 132 180 Q130 194 114 192 Q106 188 110 176 Q112 168 118 166 Z" {...organProps('stomach')} />
      {/* kidneys */}
      <path d="M90 192 q-9 2 -8 14 q1 9 9 8 q5 -1 4 -10 q-1 -11 -5 -12 z" {...organProps('kidneys')} />
      <path d="M130 192 q9 2 8 14 q-1 9 -9 8 q-5 -1 -4 -10 q1 -11 5 -12 z" {...organProps('kidneys')} />
    </svg>
  );
}

function ScreenAnatomy({ nav }) {
  const { ORGANS } = window.DB;
  const [sel, setSel] = useState('heart');
  const o = ORGANS[sel];
  const pos = ORGAN_POS[sel];

  return (
    <React.Fragment>
      <MHeader leading={<MBack onClick={() => nav.pop()} />} title="Body map" trailing={<MIconBtn icon="info-circle" onClick={() => nav.toast('Scores blend your latest labs, vitals & wearables', 'info-circle-fill')} />} />
      <div className="scroll" style={{ padding: '0 0 16px' }}>
        <div className="anatomy-wrap">
          <div className="anatomy-stage">
            <BodyMap selected={sel} onSelect={setSel} />
            {/* floating value tag */}
            <div style={{ position: 'absolute', left: `${pos.l}%`, top: `${pos.t}%`, transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 4 }}>
              <span style={{ background: scoreColor(o.score), color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, padding: '3px 9px', borderRadius: 99, boxShadow: '0 4px 12px rgba(0,0,0,.25)', whiteSpace: 'nowrap' }}>
                {o.label} · {o.score}
              </span>
            </div>
          </div>
          <div className="anatomy-legend">
            <span><i className="dot" style={{ background: '#16a34a' }} />Excellent</span>
            <span><i className="dot" style={{ background: '#f59e0b' }} />Good</span>
            <span><i className="dot" style={{ background: '#dc2626' }} />Watch</span>
          </div>
        </div>

        <div style={{ padding: '4px 16px 0' }}>
          {/* selected organ card */}
          <div className="card-soft tap" onClick={() => nav.push('organ', { key: sel })} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ width: 46, height: 46, borderRadius: 14, background: `${scoreColor(o.score)}22`, color: scoreColor(o.score), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}><I name={o.icon} /></span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, margin: 0 }}>{o.label}</h3>
                <MStatus tone={scoreTone(o.score)} dot={false}>{o.status}</MStatus>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="metric-hero" style={{ fontSize: 30, color: scoreColor(o.score) }}>{o.score}</div>
                <p style={{ fontSize: 10, color: 'var(--fg-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>/ 100</p>
              </div>
            </div>
            <ScoreBar value={o.score} color={scoreColor(o.score)} />
            <p style={{ fontSize: 13, color: 'var(--fg-2)', margin: '12px 0 0', lineHeight: 1.5 }}>{o.note}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 12.5, color: 'var(--accent-text)', fontWeight: 600 }}>
              Open full breakdown <I name="arrow-right" />
            </div>
          </div>

          <SectionLabel>All systems</SectionLabel>
          <MList>
            {Object.keys(ORGANS).map(k => {
              const x = ORGANS[k];
              return (
                <MRow key={k} icon={x.icon} iconTone={scoreTone(x.score)} title={x.label} sub={x.status}
                  onClick={() => setSel(k)}
                  right={<div style={{ width: 56, marginRight: 8 }}><ScoreBar value={x.score} color={scoreColor(x.score)} /></div>}
                  trailingStrong={String(x.score)} chev={k === sel ? false : true} />
              );
            })}
          </MList>
        </div>
      </div>
    </React.Fragment>
  );
}

function ScreenOrgan({ nav, params }) {
  const o = window.DB.ORGANS[params.key] || window.DB.ORGANS.heart;
  const col = scoreColor(o.score);
  return (
    <React.Fragment>
      <div className="organ-hero band-glow" style={{ background: `linear-gradient(165deg, ${col}, ${col}cc)`, position: 'relative', overflow: 'hidden' }}>
        <MHeader variant="transparent" leading={<MBack light onClick={() => nav.pop()} />} title={o.label}
          trailing={<button className="m-iconbtn ghost" style={{ color: '#fff' }} onClick={() => nav.toast('Shared organ summary', 'share-fill')}><I name="share" /></button>} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 99, background: 'rgba(255,255,255,.2)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              <I name={o.icon} /> {o.status}
            </span>
            <div className="big">{o.score}<span style={{ fontSize: 22, opacity: .7 }}> / 100</span></div>
            <p style={{ fontSize: 12.5, opacity: .9, margin: 0 }}>Function &amp; fitness score</p>
          </div>
          <Ring value={o.score} size={84} stroke={9} color="#fff" track="rgba(255,255,255,.25)">
            <I name={o.icon} style={{ color: '#fff', fontSize: 26 }} />
          </Ring>
        </div>
      </div>

      <div className="scroll" style={{ padding: '16px' }}>
        <MBanner tone={scoreTone(o.score) === 'red' ? 'warn' : 'info'} title="What this means">{o.note}</MBanner>

        <div className="spacer-16" />
        <SectionLabel>Key metrics</SectionLabel>
        <div className="stat-grid">
          {o.metrics.map(m => (
            <div className="stat-tile" key={m.k}>
              <div className="meta"><span>{m.k}</span></div>
              <div className="num" style={{ fontSize: 20 }}>{m.v}</div>
            </div>
          ))}
        </div>

        <div className="spacer-16" />
        <SectionLabel action="All labs" onAction={() => nav.push('catDetail', { id: 'labs', title: 'Lab results' })}>Linked records</SectionLabel>
        <MList>
          {o.records.map(r => (
            <MRow key={r} icon="file-earmark-medical-fill" iconTone={scoreTone(o.score)} title={r} onClick={() => nav.push('labDetail', { id: 'lipid' })} />
          ))}
        </MList>

        <div className="spacer-16" />
        <div style={{ display: 'flex', gap: 8 }}>
          <MButton variant="primary" block icon="chat-dots-fill" onClick={() => nav.push('doctors')}>Talk to a specialist</MButton>
          <MButton variant="secondary" icon="bell" onClick={() => nav.toast('Tracking enabled', 'bell-fill')} />
        </div>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { ScreenAnatomy, ScreenOrgan });
