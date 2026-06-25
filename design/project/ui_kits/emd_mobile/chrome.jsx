// chrome.jsx — Phone shell + mobile header + bottom tab bar + status bar
// Used by every screen mockup in the kit.

function Phone({ children, hasTabs = false, dark = false, sheet = null, fab = null, time = '9:41' }) {
  return (
    <div className="phone">
      <div className={`phone-screen ${hasTabs ? 'has-tabs' : ''} ${dark ? 'dark' : ''}`}>
        <div className="statusbar">
          <span>{time}</span>
          <span className="icons">
            <i className="bi bi-reception-4" />
            <i className="bi bi-wifi" />
            <i className="bi bi-battery-full" />
          </span>
        </div>
        {children}
        {fab}
        {sheet}
      </div>
      <div className="home-indicator" />
    </div>
  );
}

function PhoneCard({ label, title, sub, children }) {
  return (
    <div className="phone-card">
      {children}
      <div className="caption">
        {label && <div className="label">{label}</div>}
        <h3>{title}</h3>
        {sub && <p>{sub}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile header — three layouts:
//   - default: back/title/action
//   - large: greeting + big page title (home screens)
//   - transparent: floats over hero
// ─────────────────────────────────────────────────────────────
function MHeader({ title, leading, trailing, variant = 'default' }) {
  if (variant === 'transparent') {
    return (
      <div className="m-header transparent">
        <div className="m-header-side">{leading}</div>
        <div className="m-header-title" style={{ color: '#fff' }}>{title}</div>
        <div className="m-header-side" style={{ justifyContent: 'flex-end' }}>{trailing}</div>
      </div>
    );
  }
  return (
    <div className={`m-header ${variant === 'left' ? 'left' : ''}`}>
      <div className="m-header-side">{leading}</div>
      <div className="m-header-title">{title}</div>
      <div className="m-header-side" style={{ justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}

function MLargeHead({ greeting, title, trailing }) {
  return (
    <div className="m-largehead">
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

function MIconBtn({ icon, onClick, variant = 'default', ariaLabel }) {
  return (
    <button className={`m-iconbtn ${variant}`} onClick={onClick} aria-label={ariaLabel}>
      <i className={`bi bi-${icon}`} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar — EMD's four surfaces + SOS as centered raised tab
// Order: Home, Records, SOS (raised), Doctors, More
// ─────────────────────────────────────────────────────────────
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
        <button
          key={t.key}
          className={`tab ${t.sos ? 'sos' : ''} ${active === t.key ? 'active' : ''}`}
          onClick={() => onTab(t.key)}
        >
          {t.sos ? (
            <React.Fragment>
              <div className="sos-dot"><i className={`bi bi-${t.icon}`} /></div>
              <span>{t.label}</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <i className={`bi bi-${t.icon}`} />
              <span>{t.label}</span>
            </React.Fragment>
          )}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { Phone, PhoneCard, MHeader, MLargeHead, MIconBtn, TabBar });
