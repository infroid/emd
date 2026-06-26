// EaseMyDisease landing — theme, drawer, scroll reveal, header/back-to-top, and
// the animated feature "demos" (tap-driven, looping micro-interactions).
(function () {
  var root = document.documentElement;

  /* ---- Theme: respect saved choice, else system preference ---- */
  var saved = null;
  try { saved = localStorage.getItem('emd-theme'); } catch (e) {}
  if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) saved = 'dark';
  if (saved) root.setAttribute('data-bs-theme', saved);
  function toggleTheme() {
    var next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('emd-theme', next); } catch (e) {}
  }
  var tb = document.getElementById('themeBtn');
  if (tb) tb.addEventListener('click', toggleTheme);

  /* ---- Mobile drawer ---- */
  var drawer = document.getElementById('drawer');
  var menuBtn = document.getElementById('menuBtn');
  var drawerClose = document.getElementById('drawerClose');
  function openDrawer() { if (drawer) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true'); } }
  function closeDrawer() { if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false'); } }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* ---- Sticky header shadow + back-to-top ---- */
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---- Scroll reveal ---- */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* =========================================================================
     ANIMATED DEMOS — each [data-demo] phone runs a looping, tap-driven script.
     Coordinates in `point` are % of the phone screen (x, y).
     ========================================================================= */
  var TIMELINES = {
    // Hero dashboard: a finger hops across the quick-action tiles.
    dash: { loop: 5600, steps: [
      { at: 400, point: [15, 47] }, { at: 950, down: true }, { at: 1150, up: true },
      { at: 1700, point: [38, 47] }, { at: 2150, down: true }, { at: 2350, up: true },
      { at: 2900, point: [62, 47] }, { at: 3350, down: true }, { at: 3550, up: true },
      { at: 4100, point: [85, 47] }, { at: 4550, down: true }, { at: 4750, up: true },
      { at: 5200, hide: true }
    ] },
    // SOS: press & hold the button -> ring fills -> dispatched screen.
    sos: { loop: 7200, steps: [
      { at: 500, point: [50, 41] },
      { at: 1100, down: true, hold: true },
      { at: 3000, up: true },
      { at: 3150, frame: 1, hold: false, hide: true }
    ] },
    // Body map: tap heart -> heart detail; tap brain -> brain detail.
    body: { loop: 6400, steps: [
      { at: 500, frame: 0, point: [54, 31] }, { at: 1050, down: true }, { at: 1250, up: true },
      { at: 3100, point: [50, 17] }, { at: 3550, down: true, frame: 1 }, { at: 3750, up: true },
      { at: 5900, hide: true }
    ] },
    // Vault: tap "Scan with camera" -> OCR progress -> filed.
    vault: { loop: 7400, steps: [
      { at: 500, frame: 0, point: [50, 32] },
      { at: 1100, down: true }, { at: 1300, up: true, frame: 1, hide: true },
      { at: 3300, frame: 2 },
      { at: 7000, hide: true }
    ] },
    // Doctors: profile -> book -> booking -> confirm -> booked.
    doctors: { loop: 9200, steps: [
      { at: 600, frame: 0, point: [50, 87] },
      { at: 1150, down: true }, { at: 1350, up: true, frame: 1 },
      { at: 2900, point: [50, 90] },
      { at: 3450, down: true }, { at: 3650, up: true, frame: 2, hide: true },
      { at: 8600, hide: true }
    ] },
    // Meds: tap "Refill" -> request confirmed toast.
    meds: { loop: 5600, steps: [
      { at: 600, frame: 0, point: [85, 55] },
      { at: 1150, down: true }, { at: 1350, up: true, frame: 1, hide: true },
      { at: 5200, hide: true }
    ] },
    // Security: flip "Usage analytics" on, then "Anonymous research" off.
    security: { loop: 6400, steps: [
      { at: 600, point: [86, 70] }, { at: 1150, down: true }, { at: 1350, up: true, cls: { sel: '.sw-usage', add: ['on'] } },
      { at: 3000, point: [86, 58] }, { at: 3550, down: true }, { at: 3750, up: true, cls: { sel: '.sw-research', remove: ['on'] } },
      { at: 6000, hide: true }
    ] }
  };

  function initDemos() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('[data-demo]').forEach(function (phone) {
      var tl = TIMELINES[phone.getAttribute('data-demo')];
      if (!tl) return;
      var tap = phone.querySelector('.tap');
      var frames = phone.querySelectorAll('.frame');
      var timers = [], dirty = [], playing = false;

      function setFrame(n) { frames.forEach(function (f, i) { f.classList.toggle('active', i === n); }); }
      function clearTimers() { timers.forEach(clearTimeout); timers = []; }
      function reset() {
        clearTimers();
        while (dirty.length) { (dirty.pop())(); }
        if (tap) { tap.classList.remove('show', 'down', 'ping'); tap.style.left = '50%'; tap.style.top = '50%'; }
        phone.classList.remove('holding');
        setFrame(0);
      }
      function apply(s) {
        if (s.frame != null) setFrame(s.frame);
        if (s.point && tap) { tap.classList.add('show'); tap.style.left = s.point[0] + '%'; tap.style.top = s.point[1] + '%'; }
        if (s.down && tap) { tap.classList.add('down'); tap.classList.remove('ping'); void tap.offsetWidth; tap.classList.add('ping'); }
        if (s.up && tap) tap.classList.remove('down');
        if (s.hide && tap) tap.classList.remove('show');
        if (s.hold != null) phone.classList.toggle('holding', s.hold);
        if (s.cls) {
          var el = phone.querySelector(s.cls.sel);
          if (el) {
            var add = s.cls.add || [], rem = s.cls.remove || [];
            add.forEach(function (c) { el.classList.add(c); });
            rem.forEach(function (c) { el.classList.remove(c); });
            dirty.push(function () { add.forEach(function (c) { el.classList.remove(c); }); rem.forEach(function (c) { el.classList.add(c); }); });
          }
        }
      }
      function cycle() {
        reset();
        tl.steps.forEach(function (s) { timers.push(setTimeout(function () { apply(s); }, s.at)); });
        timers.push(setTimeout(cycle, tl.loop));
      }
      function play() { if (!playing) { playing = true; cycle(); } }
      function stop() { playing = false; clearTimers(); }

      if (reduce) { setFrame(0); return; }
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) play(); else stop(); });
        }, { threshold: 0.3 }).observe(phone);
      } else { play(); }
    });
  }
  initDemos();
})();
