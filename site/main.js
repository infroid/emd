// EaseMyDisease landing — theme toggle, mobile drawer, scroll reveal, header & back-to-top.
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
  function openDrawer() { if (drawer) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true'); } }
  function closeDrawer() { if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false'); } }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeDrawer); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  /* ---- Sticky header shadow + back-to-top visibility ---- */
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
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }
})();
