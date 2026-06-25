// EaseMyDisease landing — theme toggle, mobile drawer, scroll reveal.
(function () {
  var root = document.documentElement;

  /* ---- Theme: respect saved choice, else system preference ---- */
  var saved = null;
  try { saved = localStorage.getItem('emd-theme'); } catch (e) {}
  if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    saved = 'dark';
  }
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
  function closeDrawer() { if (drawer) drawer.classList.remove('open'); }
  if (menuBtn) menuBtn.addEventListener('click', function () { drawer.classList.add('open'); });
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
  }

  /* ---- Scroll reveal ---- */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();
