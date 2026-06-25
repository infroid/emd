// components.jsx — Atomic mobile UI components for the EMD mobile kit.

// ─────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────
function MButton({ children, variant = 'primary', icon, iconRight, block, onClick }) {
  return (
    <button className={`m-btn ${variant} ${block ? 'block' : ''}`} onClick={onClick}>
      {icon && <i className={`bi bi-${icon}`} />}
      {children}
      {iconRight && <i className={`bi bi-${iconRight}`} />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Chips & filter pills
// ─────────────────────────────────────────────────────────────
function MChip({ children, active, tonal, icon, onClick }) {
  const cls = `m-chip ${active ? 'active' : ''} ${tonal ? 'tonal' : ''}`;
  return (
    <button className={cls} onClick={onClick}>
      {icon && <i className={`bi bi-${icon}`} />}
      {children}
    </button>
  );
}

function MStatus({ children, tone = 'gray', dot = true }) {
  return (
    <span className={`m-status ${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// List row — the workhorse mobile UI element
// ─────────────────────────────────────────────────────────────
function MList({ children }) {
  return <div className="m-list">{children}</div>;
}

function MRow({ icon, iconTone = 'gray', title, sub, trailing, trailingStrong, chev = true, onClick }) {
  return (
    <button className="m-list-row" onClick={onClick}>
      {icon && <span className={`ico tone-${iconTone}`}><i className={`bi bi-${icon}`} /></span>}
      <div className="meta">
        <p className="t">{title}</p>
        {sub && <p className="s">{sub}</p>}
      </div>
      {(trailing || trailingStrong) && (
        <div className="trailing">
          {trailingStrong && <strong>{trailingStrong}</strong>}
          {trailing}
        </div>
      )}
      {chev && <i className="bi bi-chevron-right chev" />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────────────────────
function MSearch({ placeholder = 'Search', value = '' }) {
  return (
    <div className="m-search">
      <i className="bi bi-search" />
      <input placeholder={placeholder} defaultValue={value} />
      <i className="bi bi-mic-fill" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Form fields
// ─────────────────────────────────────────────────────────────
function MField({ label, placeholder, value = '', type = 'text', help, error }) {
  return (
    <div className={`m-field ${error ? 'error' : ''}`}>
      <label>{label}</label>
      <input type={type} placeholder={placeholder} defaultValue={value} />
      {(help || error) && <span className="help">{error || help}</span>}
    </div>
  );
}

function MOtp({ value = '4 2 7' }) {
  const digits = value.split(' ');
  return (
    <div className="m-otp">
      {[0,1,2,3,4,5].map(i => (
        <input key={i}
          maxLength={1}
          defaultValue={digits[i] || ''}
          className={digits[i] ? 'filled' : ''}
          aria-label={`OTP digit ${i+1}`}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Banners & toasts
// ─────────────────────────────────────────────────────────────
function MBanner({ tone = 'info', title, children, icon }) {
  const defaultIcons = { info: 'info-circle-fill', warn: 'exclamation-triangle-fill', error: 'x-octagon-fill', success: 'check-circle-fill' };
  return (
    <div className={`m-banner ${tone}`}>
      <i className={`bi bi-${icon || defaultIcons[tone]}`} />
      <div>
        {title && <span className="t">{title}</span>}
        {children}
      </div>
    </div>
  );
}

function MToast({ children, icon = 'check-circle-fill' }) {
  return (
    <div className="m-toast">
      <i className={`bi bi-${icon} x`} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat tile / Vital tile
// ─────────────────────────────────────────────────────────────
function StatTile({ icon, label, value, unit, trend, trendDir = 'up' }) {
  return (
    <div className="stat-tile">
      <div className="meta">
        {icon && <i className={`bi bi-${icon}`} />}
        <span>{label}</span>
      </div>
      <div className="num">{value}{unit && <small>{unit}</small>}</div>
      {trend && (
        <div className={`trend ${trendDir}`}>
          <i className={`bi bi-arrow-${trendDir === 'up' ? 'up-right' : 'down-right'}`} />
          {trend}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Doctor card (used in lists)
// ─────────────────────────────────────────────────────────────
function DocCard({ initials, avatarTone = 'purple', name, role, rating, distance, price, online }) {
  return (
    <div className="doc-card">
      <div className={`doc-avatar ${avatarTone}`}>{initials}</div>
      <div className="doc-info">
        <h4>{name}</h4>
        <p className="role">{role}</p>
        <div className="doc-meta">
          {rating && <span><i className="bi bi-star-fill" /> {rating}</span>}
          {distance && <span><i className="bi bi-geo-alt-fill" /> {distance}</span>}
          {online && <MStatus tone="green">Online</MStatus>}
        </div>
      </div>
      {price && (
        <div className="price">
          <span className="amt">{price}</span>
          <span className="unit">/ visit</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom Sheet (overlay inside a phone screen)
// ─────────────────────────────────────────────────────────────
function BottomSheet({ title, sub, children }) {
  return (
    <React.Fragment>
      <div className="sheet-scrim" />
      <div className="sheet">
        <div className="handle" />
        {title && <h3>{title}</h3>}
        {sub && <p>{sub}</p>}
        {children}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// FAB
// ─────────────────────────────────────────────────────────────
function MFab({ icon = 'plus-lg', onClick }) {
  return (
    <button className="m-fab" onClick={onClick}>
      <i className={`bi bi-${icon}`} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Big SOS button (for SOS home)
// ─────────────────────────────────────────────────────────────
function SosBig({ onClick }) {
  return (
    <button className="sos-big" onClick={onClick}>
      <i className="bi bi-heart-pulse-fill" />
      <span className="lbl">SOS</span>
      <span className="sub">Hold 3s to dispatch</span>
    </button>
  );
}

Object.assign(window, {
  MButton, MChip, MStatus, MList, MRow, MSearch, MField, MOtp,
  MBanner, MToast, StatTile, DocCard, BottomSheet, MFab, SosBig,
});
