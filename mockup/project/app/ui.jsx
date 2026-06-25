// ui.jsx — EMD prototype component library.
// Forks the mobile kit's atoms + chrome (class names live in base.css), and
// adds new primitives (switch, segmented control, rings, score bars).
// Everything is exported to window for cross-file use.

const { useState, useRef, useEffect, useCallback } = React;

// ── Icon helper ───────────────────────────────────────────────
function I({ name, ...rest }) { return <i className={`bi bi-${name}`} {...rest} />; }

// ── Header ────────────────────────────────────────────────────
function MHeader({ title, leading, trailing, variant = 'default', sticky, light }) {
  const cls = `m-header ${variant === 'left' ? 'left' : ''} ${variant === 'transparent' ? 'transparent' : ''} ${sticky ? 'sticky' : ''}`;
  const titleStyle = (variant === 'transparent' || light) ? { color: '#fff' } : undefined;
  return (
    <div className={cls}>
      <div className="m-header-side">{leading}</div>
      <div className="m-header-title" style={titleStyle}>{title}</div>
      <div className="m-header-side" style={{ justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}

function MLargeHead({ greeting, title, trailing, sticky }) {
  return (
    <div className={`m-largehead ${sticky ? 'sticky' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          {greeting && <p className="greeting">{greeting}</p>}
          <h1>{title}</h1>
        </div>
        {trailing && <div>{trailing}</div>}
      </div>
    </div>
  );
}

function MIconBtn({ icon, onClick, variant = 'default', ariaLabel, style }) {
  return (
    <button className={`m-iconbtn ${variant}`} onClick={onClick} aria-label={ariaLabel || icon} style={style}>
      <I name={icon} />
    </button>
  );
}

// Back button shortcut
function MBack({ onClick, light }) {
  return light
    ? <button className="m-iconbtn ghost" style={{ color: '#fff' }} onClick={onClick} aria-label="Back"><I name="chevron-left" /></button>
    : <MIconBtn icon="chevron-left" onClick={onClick} ariaLabel="Back" />;
}

// ── Bottom tab bar ────────────────────────────────────────────
function TabBar({ active = 'home', onTab = () => {} }) {
  const tabs = [
    { key: 'home',    icon: 'house-fill',         label: 'Home' },
    { key: 'records', icon: 'file-medical-fill',  label: 'Records' },
    { key: 'sos',     icon: 'heart-pulse-fill',   label: 'SOS', sos: true },
    { key: 'doctors', icon: 'chat-dots-fill',     label: 'Doctors' },
    { key: 'profile', icon: 'person-circle',      label: 'You' },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <button key={t.key}
          className={`tab ${t.sos ? 'sos' : ''} ${active === t.key ? 'active' : ''}`}
          onClick={() => onTab(t.key)}>
          {t.sos
            ? <React.Fragment><div className="sos-dot"><I name={t.icon} /></div><span>{t.label}</span></React.Fragment>
            : <React.Fragment><I name={t.icon} /><span>{t.label}</span></React.Fragment>}
        </button>
      ))}
    </div>
  );
}

// ── Buttons ───────────────────────────────────────────────────
function MButton({ children, variant = 'primary', icon, iconRight, block, onClick, style }) {
  return (
    <button className={`m-btn ${variant} ${block ? 'block' : ''}`} onClick={onClick} style={style}>
      {icon && <I name={icon} />}
      {children}
      {iconRight && <I name={iconRight} />}
    </button>
  );
}

// ── Chips / status ────────────────────────────────────────────
function MChip({ children, active, tonal, icon, onClick, style }) {
  return (
    <button className={`m-chip ${active ? 'active' : ''} ${tonal ? 'tonal' : ''}`} onClick={onClick} style={style}>
      {icon && <I name={icon} />}{children}
    </button>
  );
}

function MStatus({ children, tone = 'gray', dot = true, style }) {
  return (
    <span className={`m-status ${tone}`} style={style}>
      {dot && <span className="dot" />}{children}
    </span>
  );
}

// ── Lists ─────────────────────────────────────────────────────
function MList({ children, style }) { return <div className="m-list" style={style}>{children}</div>; }

function MRow({ icon, iconTone = 'gray', title, sub, trailing, trailingStrong, chev = true, onClick, right }) {
  return (
    <button className="m-list-row" onClick={onClick}>
      {icon && <span className={`ico tone-${iconTone}`}><I name={icon} /></span>}
      <div className="meta">
        <p className="t">{title}</p>
        {sub && <p className="s">{sub}</p>}
      </div>
      {right}
      {(trailing || trailingStrong) && (
        <div className="trailing">
          {trailingStrong && <strong>{trailingStrong}</strong>}
          {trailing}
        </div>
      )}
      {chev && <I name="chevron-right" className="bi chev" />}
    </button>
  );
}

// ── Search ────────────────────────────────────────────────────
function MSearch({ placeholder = 'Search', value = '', onChange, onFocus }) {
  return (
    <div className="m-search">
      <I name="search" />
      <input placeholder={placeholder} defaultValue={value} onChange={onChange} onFocus={onFocus} />
      <I name="mic-fill" />
    </div>
  );
}

// ── Fields ────────────────────────────────────────────────────
function MField({ label, placeholder, value, type = 'text', help, error, onChange, defaultValue }) {
  return (
    <div className={`m-field ${error ? 'error' : ''}`}>
      {label && <label>{label}</label>}
      <input type={type} placeholder={placeholder} value={value} defaultValue={defaultValue} onChange={onChange} />
      {(help || error) && <span className="help">{error || help}</span>}
    </div>
  );
}

function MOtp({ value = '', count = 6 }) {
  const digits = value.split('');
  return (
    <div className="m-otp">
      {Array.from({ length: count }).map((_, i) => (
        <input key={i} maxLength={1} defaultValue={digits[i] || ''} className={digits[i] ? 'filled' : ''} aria-label={`Digit ${i + 1}`} />
      ))}
    </div>
  );
}

// ── Banner / toast ────────────────────────────────────────────
function MBanner({ tone = 'info', title, children, icon }) {
  const d = { info: 'info-circle-fill', warn: 'exclamation-triangle-fill', error: 'x-octagon-fill', success: 'check-circle-fill' };
  return (
    <div className={`m-banner ${tone}`}>
      <I name={icon || d[tone]} />
      <div>{title && <span className="t">{title}</span>}{children}</div>
    </div>
  );
}

function MToast({ children, icon = 'check-circle-fill' }) {
  return <div className="m-toast"><i className={`bi bi-${icon} x`} />{children}</div>;
}

// ── Stat tile ─────────────────────────────────────────────────
function StatTile({ icon, label, value, unit, trend, trendDir = 'up', onClick }) {
  return (
    <div className="stat-tile tap" onClick={onClick}>
      <div className="meta">{icon && <I name={icon} />}<span>{label}</span></div>
      <div className="num">{value}{unit && <small>{unit}</small>}</div>
      {trend && <div className={`trend ${trendDir}`}><I name={`arrow-${trendDir === 'up' ? 'up-right' : 'down-right'}`} />{trend}</div>}
    </div>
  );
}

// ── Doctor card ───────────────────────────────────────────────
function DocCard({ initials, avatarTone = 'purple', name, role, rating, distance, price, online, onClick }) {
  return (
    <div className="doc-card tap" onClick={onClick}>
      <div className={`doc-avatar ${avatarTone}`}>{initials}</div>
      <div className="doc-info">
        <h4>{name}</h4>
        <p className="role">{role}</p>
        <div className="doc-meta">
          {rating && <span><I name="star-fill" /> {rating}</span>}
          {distance && <span><I name="geo-alt-fill" /> {distance}</span>}
          {online && <MStatus tone="green">Online</MStatus>}
        </div>
      </div>
      {price && <div className="price"><span className="amt">{price}</span><span className="unit">/ visit</span></div>}
    </div>
  );
}

// ── Bottom sheet ──────────────────────────────────────────────
function BottomSheet({ title, sub, children, onClose }) {
  return (
    <React.Fragment>
      <div className="sheet-scrim" onClick={onClose} />
      <div className="sheet">
        <div className="handle" />
        {title && <h3>{title}</h3>}
        {sub && <p>{sub}</p>}
        {children}
      </div>
    </React.Fragment>
  );
}

function MFab({ icon = 'plus-lg', onClick, style }) {
  return <button className="m-fab" onClick={onClick} style={style}><I name={icon} /></button>;
}

// ── Big SOS button (with hold-to-dispatch ring) ───────────────
function SosBig({ progress = 0, holding, label = 'SOS', sub = 'Hold 3s to dispatch', ...handlers }) {
  const R = 116, C = 2 * Math.PI * R;
  return (
    <button className={`sos-big ${holding ? 'holding' : ''}`} {...handlers}>
      {holding && (
        <svg className="sos-hold-ring" viewBox="0 0 252 252">
          <circle className="track" cx="126" cy="126" r={R} />
          <circle className="prog" cx="126" cy="126" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
        </svg>
      )}
      <I name="heart-pulse-fill" />
      <span className="lbl">{label}</span>
      <span className="sub">{sub}</span>
    </button>
  );
}

// ── New primitives ────────────────────────────────────────────
function MSwitch({ on, onChange }) {
  return <button className={`m-switch ${on ? 'on' : ''}`} onClick={() => onChange && onChange(!on)} aria-pressed={on} />;
}

function MSeg({ options, value, onChange }) {
  return (
    <div className="m-seg">
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        return <button key={v} className={value === v ? 'active' : ''} onClick={() => onChange(v)}>{l}</button>;
      })}
    </div>
  );
}

function Avatar({ children, tone = 'purple', size = 44, radius = 14, style }) {
  return <div className={`avatar ${tone}`} style={{ width: size, height: size, borderRadius: radius, fontSize: size * 0.36, ...style }}>{children}</div>;
}

function SectionLabel({ children, action, onAction }) {
  return (
    <div className="section-label">
      <h2>{children}</h2>
      {action && <span className="link" onClick={onAction}>{action}</span>}
    </div>
  );
}

// circular progress ring (SVG)
function Ring({ value = 0, size = 56, stroke = 6, color = '#22c55e', track = 'rgba(255,255,255,.14)', children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.32,.72,.32,1)' }} />
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>}
    </div>
  );
}

function ScoreBar({ value, color }) {
  const c = color || (value >= 75 ? 'var(--emd-success)' : value >= 50 ? 'var(--emd-warning)' : 'var(--accent)');
  return <div className="score-bar"><i style={{ width: `${value}%`, background: c }} /></div>;
}

Object.assign(window, {
  I, MHeader, MLargeHead, MIconBtn, MBack, TabBar, MButton, MChip, MStatus,
  MList, MRow, MSearch, MField, MOtp, MBanner, MToast, StatTile, DocCard,
  BottomSheet, MFab, SosBig, MSwitch, MSeg, Avatar, SectionLabel, Ring, ScoreBar,
});
