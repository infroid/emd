// Header.jsx — sticky navbar with logo, nav, theme/language toggles, auth buttons
const { useState } = React;

function Header({ currentView, onNavigate, theme, onToggleTheme, lang, onToggleLang }) {
  const navItems = [
    { id: 'sos',    label: 'SOS Emergency',     icon: 'bi-heart-pulse-fill' },
    { id: 'ehr',    label: 'Health Records',    icon: 'bi-file-medical-fill' },
    { id: 'doctor', label: 'Consult Doctor',    icon: 'bi-chat-dots-fill' },
    { id: 'diet',   label: 'Diet & Nutrition',  icon: 'bi-apple' },
  ];

  return (
    <header className="emd-header">
      <div className="emd-header-inner">
        <a className="emd-brand" href="#" onClick={(e) => { e.preventDefault(); onNavigate('sos'); }}>
          <span className="emd-brand-mark">
            <img src="../../assets/logos/logo-256.png" alt="EaseMyDisease" />
          </span>
          <span className="emd-brand-word">EaseMyDisease</span>
        </a>

        <nav className="emd-nav" role="navigation" aria-label="Main">
          {navItems.map((it) => (
            <button
              key={it.id}
              className={currentView === it.id ? 'active' : ''}
              onClick={() => onNavigate(it.id)}
              aria-current={currentView === it.id ? 'page' : undefined}
            >
              {it.label}
            </button>
          ))}
        </nav>

        <div className="emd-header-controls">
          <button className="emd-toggle" onClick={onToggleTheme} aria-label="Toggle theme" title="Toggle theme">
            <i className={theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill'}
               style={{ color: theme === 'dark' ? '#60a5fa' : '#f59e0b' }} />
          </button>
          <button className="emd-lang" onClick={onToggleLang} aria-label="Language">
            <i className="bi bi-translate" />
            <span>{lang}</span>
          </button>
          <button className="emd-auth-btn login" onClick={() => alert('(prototype) Sign in flow')}>
            <i className="bi bi-box-arrow-in-right" />
            <span>Sign In</span>
          </button>
          <button className="emd-auth-btn signup" onClick={() => alert('(prototype) Sign up flow')}>
            <i className="bi bi-person-plus" />
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    </header>
  );
}

window.Header = Header;
