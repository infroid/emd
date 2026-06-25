// shell.jsx — Navigation framework, device frame, stage, theme + toast.
// Reads window.SCREENS (a registry) and window.INITIAL_SCREEN, both set by main.jsx.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const NavCtx = React.createContext(null);
const useNav = () => React.useContext(NavCtx);

// One mounted screen. Clears its entrance-animation class once it finishes so a
// static capture (verifier / PDF / PPTX) shows the settled state, not opacity:0.
function ScreenFrame({ entry, cfg, nav, enter, extraCls }) {
  const [anim, setAnim] = useState(enter || 'none');
  useEffect(() => {
    setAnim(enter || 'none');
    // Clear the entrance class via a timer so content is never stuck at the
    // animation's opacity:0 start frame (offscreen iframes pause CSS animations
    // and never fire animationend — this keeps captures/exports correct).
    const t = setTimeout(() => setAnim('none'), 460);
    return () => clearTimeout(t);
  }, [entry.id]);
  const Comp = cfg.comp || (() => <div style={{ padding: 40 }}>Missing screen: {entry.key}</div>);
  return (
    <div
      className={`screen anim-${anim} ${cfg.tabs ? 'has-tabs' : ''} ${cfg.dark ? 'fullbleed' : ''} ${extraCls || ''}`}
      style={{ paddingTop: cfg.bleed ? 0 : 44 }}
      onAnimationEnd={(e) => { if (e.target === e.currentTarget) setAnim('none'); }}>
      <Comp nav={nav} params={entry.params} />
    </div>
  );
}

const TAB_ROOT = { home: 'home', records: 'ehr', sos: 'sos', doctors: 'doctors', profile: 'profile' };

function App() {
  const [stack, setStack] = useState(() => [{ key: window.INITIAL_SCREEN || 'splash', params: {}, id: 0, enter: 'fade' }]);
  const [leaving, setLeaving] = useState(null);
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState(null);
  const [scale, setScale] = useState(1);
  const idRef = useRef(1);
  const toastTimer = useRef(null);

  // apply theme to root for token switching
  useEffect(() => { document.documentElement.setAttribute('data-bs-theme', theme); }, [theme]);

  // fit device to viewport
  useEffect(() => {
    const fit = () => {
      const s = Math.min((window.innerHeight - 40) / 844, (window.innerWidth - 40) / 390, 1.08);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const showToast = useCallback((msg, icon) => {
    setToast({ msg, icon });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const nav = React.useMemo(() => ({
    push(key, params = {}, enter = 'push') {
      setStack(s => [...s, { key, params, id: idRef.current++, enter }]);
    },
    sheet(key, params = {}) {
      setStack(s => [...s, { key, params, id: idRef.current++, enter: 'up' }]);
    },
    pop() {
      setStack(s => {
        if (s.length <= 1) return s;
        setLeaving(s[s.length - 1]);
        setTimeout(() => setLeaving(null), 420);
        const ns = s.slice(0, -1);
        ns[ns.length - 1] = { ...ns[ns.length - 1], enter: 'none' };
        return ns;
      });
    },
    popTo(key) {
      setStack(s => {
        const i = s.map(e => e.key).lastIndexOf(key);
        if (i < 0) return s;
        const lv = s[s.length - 1];
        if (s.length - 1 > i) setLeaving(lv);
        const ns = s.slice(0, i + 1);
        ns[ns.length - 1] = { ...ns[ns.length - 1], enter: 'none' };
        return ns;
      });
    },
    reset(key, params = {}) {
      setLeaving(null);
      setStack([{ key, params, id: idRef.current++, enter: 'fade' }]);
    },
    replace(key, params = {}, enter = 'fade') {
      setStack(s => [...s.slice(0, -1), { key, params, id: idRef.current++, enter }]);
    },
    tab(tabKey) {
      const root = TAB_ROOT[tabKey] || 'home';
      setLeaving(null);
      setStack([{ key: root, params: {}, id: idRef.current++, enter: 'fade' }]);
    },
    toast: showToast,
    theme, setTheme,
  }), [showToast, theme]);

  const SCREENS = window.SCREENS || {};
  const top = stack[stack.length - 1];
  const cfg = SCREENS[top.key] || {};
  const activeTab = cfg.tab || null;

  return (
    <NavCtx.Provider value={nav}>
      <div className="stage-controls">
        <button className="stage-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <i className={`bi bi-${theme === 'light' ? 'moon-stars-fill' : 'sun-fill'}`} />
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <button className="stage-btn" onClick={() => nav.reset('splash')}>
          <i className="bi bi-arrow-counterclockwise" /> Restart
        </button>
      </div>

      <div className="stage">
        <div className="device-scaler" style={{ transform: `scale(${scale})` }}>
          <div className="phone">
            <div className={`phone-screen ${theme === 'dark' ? 'dark' : ''} ${cfg.tabs ? 'has-tabs' : ''}`}>
              <div className="statusbar">
                <span>9:41</span>
                <span className="icons"><i className="bi bi-reception-4" /><i className="bi bi-wifi" /><i className="bi bi-battery-full" /></span>
              </div>

              <div className="viewport">
                {/* keep the screen below the top mounted for depth during push */}
                {stack.length > 1 && top.enter === 'push' && (
                  <ScreenFrame key={stack[stack.length - 2].id} entry={stack[stack.length - 2]} cfg={SCREENS[stack[stack.length - 2].key] || {}} nav={nav} enter="none" extraCls="beneath" />
                )}
                <ScreenFrame key={top.id} entry={top} cfg={cfg} nav={nav} enter={top.enter} />
                {leaving && (
                  <div className="screen leaving" onAnimationEnd={() => setLeaving(null)}
                       style={{ paddingTop: (SCREENS[leaving.key] || {}).bleed ? 0 : 44 }}>
                    {(() => { const C = (SCREENS[leaving.key] || {}).comp; return C ? <C nav={nav} params={leaving.params} /> : null; })()}
                  </div>
                )}
              </div>

              {cfg.tabs && <TabBar active={activeTab} onTab={(t) => nav.tab(t)} />}

              {toast && (
                <div style={{ position: 'absolute', top: 52, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 90, padding: '0 16px' }}>
                  <MToast icon={toast.icon}>{toast.msg}</MToast>
                </div>
              )}

              <div className="home-indicator" />
            </div>
          </div>
        </div>
      </div>

      <div className="stage-hint"><i className="bi bi-hand-index-thumb" /> Fully interactive — tap anything</div>
    </NavCtx.Provider>
  );
}

Object.assign(window, { useNav, App });
