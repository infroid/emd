/* @ds-bundle: {"format":3,"namespace":"EaseMyDiseaseDesignSystem_019e2c","components":[],"sourceHashes":{"assets/image-slot.js":"5ade9426e255","ui_kits/emd_mobile/App.jsx":"be4be6979162","ui_kits/emd_mobile/chrome.jsx":"e7fef5473783","ui_kits/emd_mobile/components.jsx":"356e69b102d9","ui_kits/emd_mobile/ios-frame.jsx":"d67eb3ffe562","ui_kits/emd_mobile/screens.jsx":"dcd1cea24111","ui_kits/emd_web/App.jsx":"e00043a8e14d","ui_kits/emd_web/Button.jsx":"b4a0ceab9262","ui_kits/emd_web/CTASection.jsx":"fd4884739a20","ui_kits/emd_web/DietView.jsx":"938aacae6d69","ui_kits/emd_web/DoctorBookingCard.jsx":"f28ade1516ce","ui_kits/emd_web/EhrActivityCard.jsx":"d6e4e40f0606","ui_kits/emd_web/EmergencyFAB.jsx":"a6d7c533e800","ui_kits/emd_web/FeatureCard.jsx":"586db64728e2","ui_kits/emd_web/Footer.jsx":"5ec5921ab96d","ui_kits/emd_web/Header.jsx":"038e8afdd5f3","ui_kits/emd_web/Hero.jsx":"fc60bca5914b","ui_kits/emd_web/PhoneMockup.jsx":"f8afa95b3a57","ui_kits/emd_web/StatCluster.jsx":"6d4ca6432ad1","ui_kits/emd_web/Testimonials.jsx":"ce8f1a4ad81f","ui_kits/emd_web/TrustBadge.jsx":"657fbdb4d830"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EaseMyDiseaseDesignSystem_019e2c = window.EaseMyDiseaseDesignSystem_019e2c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/image-slot.js
try { (() => {
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <script src="image-slot.js"></script>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet = ':host{display:inline-block;position:relative;vertical-align:top;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' + '  cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .spill{display:block}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls sit BELOW the mask (top:100%), absolutely positioned so the
  // author-declared slot height is unaffected. The gap is padding, not a
  // top offset, so the hover target stays contiguous with the frame.
  '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }
    constructor() {
      super();
      const root = this.attachShadow({
        mode: 'open'
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="ring" part="ring"></div>' + '</div>' + '<div class="spill">' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' + '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="clear" title="Remove image">Remove</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') {
          this._exitReframe(true);
          this._input.click();
        }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null);else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') && (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return {
        iw,
        ih,
        fw,
        fh,
        base: Math.max(fw / iw, fh / ih)
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w;
      this._spill.style.height = h;
      this._spill.style.left = l;
      this._spill.style.top = t;
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/emd_mobile/App.jsx
try { (() => {
// App.jsx — EMD Mobile UI Kit gallery page
const {
  useState
} = React;
function App() {
  const [activeTab, setActiveTab] = useState('home');
  return /*#__PURE__*/React.createElement("div", {
    className: "page",
    "data-screen-label": "EMD Mobile UI Kit"
  }, /*#__PURE__*/React.createElement("header", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "title-block"
  }, /*#__PURE__*/React.createElement("p", {
    className: "eyebrow"
  }, "EMD \xB7 Mobile & responsive"), /*#__PURE__*/React.createElement("h1", null, "EaseMyDisease, ", /*#__PURE__*/React.createElement("em", null, "in your pocket")), /*#__PURE__*/React.createElement("p", null, "The mobile / PWA half of the EMD design system: phone screen mockups for the four product surfaces, plus the atomic components that compose them \u2014 bottom tab bar, list rows, banners, sheets, and the signature SOS button.")), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "../emd_web/index.html",
    className: "m-btn secondary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-display"
  }), "Web UI kit"), /*#__PURE__*/React.createElement("a", {
    href: "../../preview/buttons.html",
    className: "m-btn ghost"
  }, "Design system"))), /*#__PURE__*/React.createElement("section", {
    className: "section",
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "01 \xB7 Surfaces"), /*#__PURE__*/React.createElement("h2", null, "The four tabs")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Each product surface has its own home. The bottom tab bar persists across all of them, with SOS raised in the center as the always-reachable emergency action.")), /*#__PURE__*/React.createElement("div", {
    className: "phone-row"
  }, /*#__PURE__*/React.createElement(PhoneCard, {
    label: "Tab \xB7 SOS",
    title: "SOS Home",
    sub: "The signature red dome. Hold-to-dispatch with location + medical profile pre-attached."
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenSosHome, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "sos",
    onTab: setActiveTab
  }))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "Tab \xB7 Records",
    title: "Health Vault",
    sub: "247 records, indexed and searchable. Stats up top, categories below, recent activity at the bottom."
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenEhr, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "records",
    onTab: setActiveTab
  }))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "Tab \xB7 Doctors",
    title: "Find a Doctor",
    sub: "Filter chips, doctor cards with avatar + role + rating + price. Available-now chip pre-selected."
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenDoctors, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "doctors",
    onTab: setActiveTab
  }))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "Tab \xB7 You",
    title: "Profile",
    sub: "Identity, account, family vaults, language, privacy. The hub for everything that's not a primary surface."
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenProfile, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "profile",
    onTab: setActiveTab
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "02 \xB7 Flows"), /*#__PURE__*/React.createElement("h2", null, "Scenarios")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Onboarding, an active emergency, drill-in details, a booking flow, and a video consult. The motion through the product.")), /*#__PURE__*/React.createElement("div", {
    className: "phone-row"
  }, /*#__PURE__*/React.createElement(PhoneCard, {
    label: "01 \xB7 Auth",
    title: "Onboarding",
    sub: "The first screen anyone sees. Brand mark, calm-urgency headline, three value bullets, two CTAs."
  }, /*#__PURE__*/React.createElement(Phone, null, /*#__PURE__*/React.createElement(ScreenOnboarding, null))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "02 \xB7 Auth",
    title: "OTP verify",
    sub: "One-time code, expiry timer, resend, info banner explaining why we ask."
  }, /*#__PURE__*/React.createElement(Phone, null, /*#__PURE__*/React.createElement(ScreenOtp, null))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "03 \xB7 SOS",
    title: "Emergency active",
    sub: "Red hero band, ETA, mini map, dispatch details, cancel CTA. The most important screen in the product."
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenSosActive, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "sos",
    onTab: setActiveTab
  }))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "04 \xB7 EHR",
    title: "Record detail",
    sub: "A single lab result. Status pill in the header, values as a list with normal/borderline tags, share-to-doctor primary CTA."
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenEhrDetail, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "records",
    onTab: setActiveTab
  }))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "05 \xB7 Consult",
    title: "Book appointment",
    sub: "Doctor card, channel chips, week strip, slot grid. Confirm CTA carries the slot label."
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenBooking, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "doctors",
    onTab: setActiveTab
  }))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "06 \xB7 Consult",
    title: "In-call",
    sub: "Full-bleed doctor video, self preview, translation chip, recording badge. Red end-call is the only big button."
  }, /*#__PURE__*/React.createElement(Phone, null, /*#__PURE__*/React.createElement(ScreenVideoCall, null))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "07 \xB7 Hand-off",
    title: "Bottom sheet",
    sub: "Diet & nutrition hands off to partner MFC. Sheet over scrim; primary CTA opens the partner app."
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenSheetDemo, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "profile",
    onTab: setActiveTab
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "03 \xB7 Atoms"), /*#__PURE__*/React.createElement("h2", null, "Components")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "Every block that makes up the screens above. Each card shows the component in isolation with a touch-friendly hit area.")), /*#__PURE__*/React.createElement("div", {
    className: "comp-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "comp-card span-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Mobile headers"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-header / .m-largehead")), /*#__PURE__*/React.createElement("div", {
    className: "body",
    style: {
      gap: 14,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1px solid var(--border-1)'
    }
  }, /*#__PURE__*/React.createElement(MHeader, {
    leading: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "chevron-left"
    }),
    title: "Lipid Panel",
    trailing: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "share"
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-1)',
      border: '1px solid var(--border-1)'
    }
  }, /*#__PURE__*/React.createElement(MLargeHead, {
    greeting: "Vault \xB7 Jordan Patel",
    title: "Health Records",
    trailing: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "share"
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(180deg, #ef4444, #b91c1c)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(MHeader, {
    variant: "transparent",
    leading: /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn ghost",
      style: {
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-chevron-left"
    })),
    title: "Emergency in progress",
    trailing: /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn ghost",
      style: {
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-three-dots"
    }))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card span-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Bottom tab bar"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".tabbar \xB7 SOS raised")), /*#__PURE__*/React.createElement("div", {
    className: "body center",
    style: {
      background: 'var(--bg-2)',
      padding: '40px 24px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 360,
      height: 76
    }
  }, /*#__PURE__*/React.createElement(TabBar, {
    active: activeTab,
    onTab: setActiveTab
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--fg-muted)',
      margin: '12px 0 0',
      textAlign: 'center'
    }
  }, "Tap a tab to test the active state. SOS pulses always."))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Buttons"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-btn \xB7 48px tap")), /*#__PURE__*/React.createElement("div", {
    className: "body row"
  }, /*#__PURE__*/React.createElement(MButton, {
    variant: "primary"
  }, "Confirm"), /*#__PURE__*/React.createElement(MButton, {
    variant: "secondary"
  }, "Skip"), /*#__PURE__*/React.createElement(MButton, {
    variant: "tonal",
    icon: "share"
  }, "Share"), /*#__PURE__*/React.createElement(MButton, {
    variant: "ghost"
  }, "Cancel"), /*#__PURE__*/React.createElement(MButton, {
    variant: "primary",
    icon: "lightning-charge-fill",
    iconRight: "arrow-right",
    block: true
  }, "Get Protected Now"))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Chips & filters"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-chip")), /*#__PURE__*/React.createElement("div", {
    className: "body row"
  }, /*#__PURE__*/React.createElement(MChip, {
    active: true,
    icon: "lightning-charge-fill"
  }, "Available now"), /*#__PURE__*/React.createElement(MChip, null, "Video"), /*#__PURE__*/React.createElement(MChip, null, "In person"), /*#__PURE__*/React.createElement(MChip, null, "Top rated"), /*#__PURE__*/React.createElement(MChip, {
    tonal: true,
    icon: "shield-fill-check"
  }, "HIPAA"))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Status pills"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-status")), /*#__PURE__*/React.createElement("div", {
    className: "body row"
  }, /*#__PURE__*/React.createElement(MStatus, {
    tone: "green"
  }, "Online"), /*#__PURE__*/React.createElement(MStatus, {
    tone: "red"
  }, "Dispatching"), /*#__PURE__*/React.createElement(MStatus, {
    tone: "amber"
  }, "Pending"), /*#__PURE__*/React.createElement(MStatus, {
    tone: "blue"
  }, "Synced"), /*#__PURE__*/React.createElement(MStatus, {
    tone: "purple"
  }, "Booked"), /*#__PURE__*/React.createElement(MStatus, {
    tone: "gray",
    dot: false
  }, "Draft"))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Search"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-search")), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(MSearch, {
    placeholder: "Records, prescriptions, doctors"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card span-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "List rows"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-list \xB7 .m-list-row")), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "geo-alt-fill",
    iconTone: "red",
    title: "Location sharing",
    sub: "On \xB7 415 Mission St",
    trailing: "6 m ago",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "capsule",
    iconTone: "purple",
    title: "Prescriptions",
    sub: "12 records \xB7 2 active"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "upload",
    iconTone: "green",
    title: "Lipid panel uploaded",
    sub: "Mercy General \xB7 today",
    trailing: "OCR'd",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "people-fill",
    iconTone: "blue",
    title: "Emergency contacts",
    sub: "3 contacts will be notified",
    trailing: "3"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Form fields"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-field")), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(MField, {
    label: "Phone number",
    placeholder: "+1 (415) 555-0142",
    type: "tel"
  }), /*#__PURE__*/React.createElement(MField, {
    label: "Date of birth",
    placeholder: "MM / DD / YYYY",
    help: "Helps doctors verify your records"
  }), /*#__PURE__*/React.createElement(MField, {
    label: "Insurance ID",
    placeholder: "",
    error: "That ID isn't in our directory",
    value: "X-22-991"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "OTP input"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-otp")), /*#__PURE__*/React.createElement("div", {
    className: "body center"
  }, /*#__PURE__*/React.createElement(MOtp, {
    value: "4 2 7"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--fg-muted)',
      margin: '14px 0 0'
    }
  }, "Code expires in 0:23"))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card span-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Banners"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-banner \xB7 info / warn / error / success")), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(MBanner, {
    tone: "info",
    title: "Why a code?"
  }, "Your vault is locked to your phone. We verify every new device once."), /*#__PURE__*/React.createElement(MBanner, {
    tone: "warn",
    title: "One value to watch"
  }, "Your triglycerides are slightly elevated. Diet adjustments usually move this back into range."), /*#__PURE__*/React.createElement(MBanner, {
    tone: "error",
    title: "Couldn't reach dispatcher"
  }, "Your call dropped. Tap to retry \u2014 your location is still being shared."), /*#__PURE__*/React.createElement(MBanner, {
    tone: "success",
    title: "Records imported"
  }, "12 records from Mercy General were added to your vault."))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Toast"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-toast \xB7 slide from top")), /*#__PURE__*/React.createElement("div", {
    className: "body center"
  }, /*#__PURE__*/React.createElement(MToast, null, "Shared with Dr. Rao \u2014 expires in 7 days"))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Stat tiles"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".stat-tile")), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stat-grid"
  }, /*#__PURE__*/React.createElement(StatTile, {
    icon: "heart-pulse-fill",
    label: "Resting HR",
    value: "68",
    unit: "bpm",
    trend: "-3 vs last wk",
    trendDir: "down"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "droplet-fill",
    label: "Glucose",
    value: "112",
    unit: "mg/dL",
    trend: "In range",
    trendDir: "up"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "capsule",
    label: "Adherence",
    value: "94",
    unit: "%",
    trend: "+2",
    trendDir: "up"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "moon-stars-fill",
    label: "Sleep avg",
    value: "6.8",
    unit: "h",
    trend: "-0.3",
    trendDir: "down"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Doctor card"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".doc-card")), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, /*#__PURE__*/React.createElement(DocCard, {
    initials: "AR",
    avatarTone: "blue",
    name: "Dr. Amita Rao",
    role: "Cardiologist \xB7 14 yr exp",
    rating: "4.9 (412)",
    distance: "2.1 mi",
    price: "$45",
    online: true
  }), /*#__PURE__*/React.createElement(DocCard, {
    initials: "MR",
    avatarTone: "purple",
    name: "Dr. Marcus Rivera",
    role: "General Physician \xB7 8 yr exp",
    rating: "4.8 (1.2k)",
    distance: "0.8 mi",
    price: "$30"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "SOS button"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".sos-big \xB7 signature")), /*#__PURE__*/React.createElement("div", {
    className: "body center",
    style: {
      paddingTop: 36,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement(SosBig, null))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "FAB"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-fab")), /*#__PURE__*/React.createElement("div", {
    className: "body center",
    style: {
      position: 'relative',
      minHeight: 180
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 200,
      height: 140,
      background: 'var(--bg-1)',
      border: '1px dashed var(--border-1)',
      borderRadius: 18
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "m-fab",
    style: {
      position: 'absolute',
      right: 12,
      bottom: 12
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-plus-lg"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--fg-muted)',
      margin: '10px 0 0'
    }
  }, "Pinned bottom-right \xB7 16px from edge"))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Icon buttons"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".m-iconbtn")), /*#__PURE__*/React.createElement("div", {
    className: "body row"
  }, /*#__PURE__*/React.createElement(MIconBtn, {
    icon: "chevron-left"
  }), /*#__PURE__*/React.createElement(MIconBtn, {
    icon: "search"
  }), /*#__PURE__*/React.createElement(MIconBtn, {
    icon: "bell"
  }), /*#__PURE__*/React.createElement(MIconBtn, {
    icon: "gear"
  }), /*#__PURE__*/React.createElement(MIconBtn, {
    icon: "share"
  }), /*#__PURE__*/React.createElement(MIconBtn, {
    icon: "heart-pulse-fill",
    variant: "solid"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "comp-card span-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "head"
  }, /*#__PURE__*/React.createElement("h4", null, "Bottom sheet"), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, ".sheet \xB7 28px radius, drag handle")), /*#__PURE__*/React.createElement("div", {
    className: "body",
    style: {
      padding: 0,
      background: 'var(--bg-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 280,
      borderRadius: 20,
      margin: 16,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, var(--bg-3), var(--bg-2))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      opacity: 0.4
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--fg-muted)',
      margin: 0
    }
  }, "Diet"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22,
      margin: '4px 0 12px'
    }
  }, "Nutrition")), /*#__PURE__*/React.createElement("div", {
    className: "sheet-scrim",
    style: {
      borderRadius: 20
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sheet",
    style: {
      borderRadius: '24px 24px 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "handle"
  }), /*#__PURE__*/React.createElement("h3", null, "Hand off to MyFoodCraving?"), /*#__PURE__*/React.createElement("p", null, "Diet & nutrition lives in our partner app. We'll pass your conditions and meds so meal plans match."), /*#__PURE__*/React.createElement(MButton, {
    variant: "primary",
    block: true,
    iconRight: "box-arrow-up-right"
  }, "Open MyFoodCraving"))))))), /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "04 \xB7 Responsive"), /*#__PURE__*/React.createElement("h2", null, "Mobile-first, but it scales")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "EMD ships as a PWA \u2014 same HTML, same Bootstrap layer. The mobile chrome below collapses cleanly into the desktop kit's web header above the 768px breakpoint.")), /*#__PURE__*/React.createElement("div", {
    className: "responsive-pair"
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true
  }, /*#__PURE__*/React.createElement(ScreenSosHome, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "sos",
    onTab: setActiveTab
  })), /*#__PURE__*/React.createElement("div", {
    className: "info"
  }, /*#__PURE__*/React.createElement("h3", null, "Breakpoints & structural rules"), /*#__PURE__*/React.createElement("p", null, "The mobile UI kit is built for \u2264 768px (Bootstrap's ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      background: 'var(--bg-3)',
      padding: '1px 6px',
      borderRadius: 4,
      fontSize: '0.9em'
    }
  }, "md"), "). Above that breakpoint the tab bar swaps for the desktop header, the SOS button shrinks to the floating Emergency FAB, and content widens to the standard 1200px container."), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-check-circle-fill"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u2264 768px"), " \u2014 bottom tab bar + 16px gutters + 20px card radius + 48px min hit target")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-check-circle-fill"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "769 \u2013 1199px"), " \u2014 desktop header surfaces; cards bump to 24px radius; bottom FAB takes over emergency entry")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-check-circle-fill"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u2265 1200px"), " \u2014 1200px max-width container; feature grids go 3-column; phone mockups appear as hero visuals only")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-check-circle-fill"
  }), /*#__PURE__*/React.createElement("span", null, "All tokens (color, type scale, spacing, radii) are ", /*#__PURE__*/React.createElement("em", null, "shared"), " across both kits \u2014 there is one source of truth at ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "colors_and_type.css"))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-check-circle-fill"
  }), /*#__PURE__*/React.createElement("span", null, "Dark theme parity is mandatory \u2014 every component above renders in dark via ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "data-bs-theme=\"dark\""))))))), /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "05 \xB7 Dark"), /*#__PURE__*/React.createElement("h2", null, "Dark mode parity")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "EMD's dark is keyed to the brand illustration \u2014 warm cream-on-brown, never cold blue-black. The red accent stays warm too.")), /*#__PURE__*/React.createElement("div", {
    className: "phone-row",
    "data-bs-theme": "dark",
    style: {
      background: '#18150f',
      borderRadius: 28,
      padding: 32,
      margin: '0 -8px'
    }
  }, /*#__PURE__*/React.createElement(PhoneCard, {
    label: "Dark \xB7 SOS",
    title: "SOS Home",
    sub: "Warm brown chrome lets the red stay urgent without being harsh."
  }, /*#__PURE__*/React.createElement("div", {
    "data-bs-theme": "dark"
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true,
    dark: true
  }, /*#__PURE__*/React.createElement(ScreenSosHome, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "sos",
    onTab: setActiveTab
  })))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "Dark \xB7 Records",
    title: "Health Vault",
    sub: "Same 20px cards, same density \u2014 every token has a dark pair."
  }, /*#__PURE__*/React.createElement("div", {
    "data-bs-theme": "dark"
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true,
    dark: true
  }, /*#__PURE__*/React.createElement(ScreenEhr, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "records",
    onTab: setActiveTab
  })))), /*#__PURE__*/React.createElement(PhoneCard, {
    label: "Dark \xB7 Profile",
    title: "You",
    sub: "Avatars and status pills keep their tones; backgrounds shift warm."
  }, /*#__PURE__*/React.createElement("div", {
    "data-bs-theme": "dark"
  }, /*#__PURE__*/React.createElement(Phone, {
    hasTabs: true,
    dark: true
  }, /*#__PURE__*/React.createElement(ScreenProfile, null), /*#__PURE__*/React.createElement(TabBar, {
    active: "profile",
    onTab: setActiveTab
  })))))));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_mobile/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_mobile/chrome.jsx
try { (() => {
// chrome.jsx — Phone shell + mobile header + bottom tab bar + status bar
// Used by every screen mockup in the kit.

function Phone({
  children,
  hasTabs = false,
  dark = false,
  sheet = null,
  fab = null,
  time = '9:41'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: `phone-screen ${hasTabs ? 'has-tabs' : ''} ${dark ? 'dark' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "statusbar"
  }, /*#__PURE__*/React.createElement("span", null, time), /*#__PURE__*/React.createElement("span", {
    className: "icons"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-reception-4"
  }), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-wifi"
  }), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-battery-full"
  }))), children, fab, sheet), /*#__PURE__*/React.createElement("div", {
    className: "home-indicator"
  }));
}
function PhoneCard({
  label,
  title,
  sub,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "phone-card"
  }, children, /*#__PURE__*/React.createElement("div", {
    className: "caption"
  }, label && /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, label), /*#__PURE__*/React.createElement("h3", null, title), sub && /*#__PURE__*/React.createElement("p", null, sub)));
}

// ─────────────────────────────────────────────────────────────
// Mobile header — three layouts:
//   - default: back/title/action
//   - large: greeting + big page title (home screens)
//   - transparent: floats over hero
// ─────────────────────────────────────────────────────────────
function MHeader({
  title,
  leading,
  trailing,
  variant = 'default'
}) {
  if (variant === 'transparent') {
    return /*#__PURE__*/React.createElement("div", {
      className: "m-header transparent"
    }, /*#__PURE__*/React.createElement("div", {
      className: "m-header-side"
    }, leading), /*#__PURE__*/React.createElement("div", {
      className: "m-header-title",
      style: {
        color: '#fff'
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      className: "m-header-side",
      style: {
        justifyContent: 'flex-end'
      }
    }, trailing));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `m-header ${variant === 'left' ? 'left' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-header-side"
  }, leading), /*#__PURE__*/React.createElement("div", {
    className: "m-header-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "m-header-side",
    style: {
      justifyContent: 'flex-end'
    }
  }, trailing));
}
function MLargeHead({
  greeting,
  title,
  trailing
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "m-largehead"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, greeting && /*#__PURE__*/React.createElement("p", {
    className: "greeting"
  }, greeting), /*#__PURE__*/React.createElement("h1", null, title)), trailing && /*#__PURE__*/React.createElement("div", null, trailing)));
}
function MIconBtn({
  icon,
  onClick,
  variant = 'default',
  ariaLabel
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: `m-iconbtn ${variant}`,
    onClick: onClick,
    "aria-label": ariaLabel
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${icon}`
  }));
}

// ─────────────────────────────────────────────────────────────
// Bottom tab bar — EMD's four surfaces + SOS as centered raised tab
// Order: Home, Records, SOS (raised), Doctors, More
// ─────────────────────────────────────────────────────────────
function TabBar({
  active = 'home',
  onTab = () => {}
}) {
  const tabs = [{
    key: 'home',
    icon: 'house-fill',
    label: 'Home'
  }, {
    key: 'records',
    icon: 'file-medical-fill',
    label: 'Records'
  }, {
    key: 'sos',
    icon: 'heart-pulse-fill',
    label: 'SOS',
    sos: true
  }, {
    key: 'doctors',
    icon: 'chat-dots-fill',
    label: 'Doctors'
  }, {
    key: 'profile',
    icon: 'person-circle',
    label: 'You'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "tabbar"
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    className: `tab ${t.sos ? 'sos' : ''} ${active === t.key ? 'active' : ''}`,
    onClick: () => onTab(t.key)
  }, t.sos ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sos-dot"
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${t.icon}`
  })), /*#__PURE__*/React.createElement("span", null, t.label)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${t.icon}`
  }), /*#__PURE__*/React.createElement("span", null, t.label)))));
}
Object.assign(window, {
  Phone,
  PhoneCard,
  MHeader,
  MLargeHead,
  MIconBtn,
  TabBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_mobile/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_mobile/components.jsx
try { (() => {
// components.jsx — Atomic mobile UI components for the EMD mobile kit.

// ─────────────────────────────────────────────────────────────
// Buttons
// ─────────────────────────────────────────────────────────────
function MButton({
  children,
  variant = 'primary',
  icon,
  iconRight,
  block,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: `m-btn ${variant} ${block ? 'block' : ''}`,
    onClick: onClick
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${icon}`
  }), children, iconRight && /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${iconRight}`
  }));
}

// ─────────────────────────────────────────────────────────────
// Chips & filter pills
// ─────────────────────────────────────────────────────────────
function MChip({
  children,
  active,
  tonal,
  icon,
  onClick
}) {
  const cls = `m-chip ${active ? 'active' : ''} ${tonal ? 'tonal' : ''}`;
  return /*#__PURE__*/React.createElement("button", {
    className: cls,
    onClick: onClick
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${icon}`
  }), children);
}
function MStatus({
  children,
  tone = 'gray',
  dot = true
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `m-status ${tone}`
  }, dot && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), children);
}

// ─────────────────────────────────────────────────────────────
// List row — the workhorse mobile UI element
// ─────────────────────────────────────────────────────────────
function MList({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "m-list"
  }, children);
}
function MRow({
  icon,
  iconTone = 'gray',
  title,
  sub,
  trailing,
  trailingStrong,
  chev = true,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "m-list-row",
    onClick: onClick
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: `ico tone-${iconTone}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${icon}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("p", {
    className: "t"
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    className: "s"
  }, sub)), (trailing || trailingStrong) && /*#__PURE__*/React.createElement("div", {
    className: "trailing"
  }, trailingStrong && /*#__PURE__*/React.createElement("strong", null, trailingStrong), trailing), chev && /*#__PURE__*/React.createElement("i", {
    className: "bi bi-chevron-right chev"
  }));
}

// ─────────────────────────────────────────────────────────────
// Search
// ─────────────────────────────────────────────────────────────
function MSearch({
  placeholder = 'Search',
  value = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "m-search"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: placeholder,
    defaultValue: value
  }), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-mic-fill"
  }));
}

// ─────────────────────────────────────────────────────────────
// Form fields
// ─────────────────────────────────────────────────────────────
function MField({
  label,
  placeholder,
  value = '',
  type = 'text',
  help,
  error
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `m-field ${error ? 'error' : ''}`
  }, /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    defaultValue: value
  }), (help || error) && /*#__PURE__*/React.createElement("span", {
    className: "help"
  }, error || help));
}
function MOtp({
  value = '4 2 7'
}) {
  const digits = value.split(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "m-otp"
  }, [0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement("input", {
    key: i,
    maxLength: 1,
    defaultValue: digits[i] || '',
    className: digits[i] ? 'filled' : '',
    "aria-label": `OTP digit ${i + 1}`
  })));
}

// ─────────────────────────────────────────────────────────────
// Banners & toasts
// ─────────────────────────────────────────────────────────────
function MBanner({
  tone = 'info',
  title,
  children,
  icon
}) {
  const defaultIcons = {
    info: 'info-circle-fill',
    warn: 'exclamation-triangle-fill',
    error: 'x-octagon-fill',
    success: 'check-circle-fill'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `m-banner ${tone}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${icon || defaultIcons[tone]}`
  }), /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("span", {
    className: "t"
  }, title), children));
}
function MToast({
  children,
  icon = 'check-circle-fill'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "m-toast"
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${icon} x`
  }), children);
}

// ─────────────────────────────────────────────────────────────
// Stat tile / Vital tile
// ─────────────────────────────────────────────────────────────
function StatTile({
  icon,
  label,
  value,
  unit,
  trend,
  trendDir = 'up'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stat-tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${icon}`
  }), /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, value, unit && /*#__PURE__*/React.createElement("small", null, unit)), trend && /*#__PURE__*/React.createElement("div", {
    className: `trend ${trendDir}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-arrow-${trendDir === 'up' ? 'up-right' : 'down-right'}`
  }), trend));
}

// ─────────────────────────────────────────────────────────────
// Doctor card (used in lists)
// ─────────────────────────────────────────────────────────────
function DocCard({
  initials,
  avatarTone = 'purple',
  name,
  role,
  rating,
  distance,
  price,
  online
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "doc-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: `doc-avatar ${avatarTone}`
  }, initials), /*#__PURE__*/React.createElement("div", {
    className: "doc-info"
  }, /*#__PURE__*/React.createElement("h4", null, name), /*#__PURE__*/React.createElement("p", {
    className: "role"
  }, role), /*#__PURE__*/React.createElement("div", {
    className: "doc-meta"
  }, rating && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-star-fill"
  }), " ", rating), distance && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-geo-alt-fill"
  }), " ", distance), online && /*#__PURE__*/React.createElement(MStatus, {
    tone: "green"
  }, "Online"))), price && /*#__PURE__*/React.createElement("div", {
    className: "price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "amt"
  }, price), /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "/ visit")));
}

// ─────────────────────────────────────────────────────────────
// Bottom Sheet (overlay inside a phone screen)
// ─────────────────────────────────────────────────────────────
function BottomSheet({
  title,
  sub,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "sheet-scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sheet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "handle"
  }), title && /*#__PURE__*/React.createElement("h3", null, title), sub && /*#__PURE__*/React.createElement("p", null, sub), children));
}

// ─────────────────────────────────────────────────────────────
// FAB
// ─────────────────────────────────────────────────────────────
function MFab({
  icon = 'plus-lg',
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "m-fab",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${icon}`
  }));
}

// ─────────────────────────────────────────────────────────────
// Big SOS button (for SOS home)
// ─────────────────────────────────────────────────────────────
function SosBig({
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "sos-big",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-heart-pulse-fill"
  }), /*#__PURE__*/React.createElement("span", {
    className: "lbl"
  }, "SOS"), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, "Hold 3s to dispatch"));
}
Object.assign(window, {
  MButton,
  MChip,
  MStatus,
  MList,
  MRow,
  MSearch,
  MField,
  MOtp,
  MBanner,
  MToast,
  StatTile,
  DocCard,
  BottomSheet,
  MFab,
  SosBig
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_mobile/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_mobile/ios-frame.jsx
try { (() => {
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_mobile/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_mobile/screens.jsx
try { (() => {
// screens.jsx — Full-screen mockups for the EMD mobile kit.

// ─────────────────────────────────────────────────────────────
// 1. ONBOARDING — welcome / value prop, sign-in entry
// ─────────────────────────────────────────────────────────────
function ScreenOnboarding() {
  return /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '40px 24px 24px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 132,
      height: 132,
      borderRadius: 36,
      background: 'linear-gradient(180deg, #fdfbf6 0%, #ecdfd0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 12px 28px rgba(220,38,38,.18)',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/logo-primary.png",
    style: {
      width: '88%',
      height: '88%',
      objectFit: 'contain'
    },
    alt: "EMD"
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 26,
      letterSpacing: '-0.025em',
      lineHeight: 1.1,
      margin: 0,
      color: 'var(--fg-1)'
    }
  }, "Medical Help,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--accent-text)',
      fontStyle: 'normal'
    }
  }, "Instantly")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--fg-2)',
      margin: 0,
      maxWidth: 240,
      lineHeight: 1.5
    }
  }, "Emergency response, your health records, and doctors on call \u2014 in one app."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 20,
      width: '100%',
      maxWidth: 280,
      textAlign: 'left'
    }
  }, [{
    i: 'lightning-charge-fill',
    t: 'Sub-10 minute SOS response'
  }, {
    i: 'shield-fill-check',
    t: 'HIPAA-compliant health vault'
  }, {
    i: 'chat-dots-fill',
    t: 'Video consult in under 7 min'
  }].map(({
    i,
    t
  }) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ico tone-red",
    style: {
      width: 32,
      height: 32,
      borderRadius: 10,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${i}`
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      color: 'var(--fg-1)',
      fontWeight: 500
    }
  }, t))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingBottom: 28
    }
  }, /*#__PURE__*/React.createElement(MButton, {
    variant: "primary",
    block: true,
    iconRight: "arrow-right"
  }, "Get Protected Now"), /*#__PURE__*/React.createElement(MButton, {
    variant: "ghost",
    block: true
  }, "I already have an account")));
}

// ─────────────────────────────────────────────────────────────
// 2. SIGN-IN with OTP (keyboard could go here; kept minimal)
// ─────────────────────────────────────────────────────────────
function ScreenOtp() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    leading: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "chevron-left"
    }),
    title: "Verify your number"
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '12px 20px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--fg-2)',
      margin: '4px 0 24px',
      lineHeight: 1.5
    }
  }, "We sent a 6-digit code to ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--fg-1)'
    }
  }, "+1 (415) 555-0142"), ". It expires in 10 minutes."), /*#__PURE__*/React.createElement(MOtp, {
    value: "4 2 7"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--fg-muted)'
    }
  }, "Didn't get it?"), /*#__PURE__*/React.createElement("button", {
    className: "m-btn ghost",
    style: {
      padding: '8px 12px',
      minHeight: 'auto',
      fontSize: 13
    }
  }, "Resend in 0:23")), /*#__PURE__*/React.createElement(MBanner, {
    tone: "info",
    title: "Why a code?"
  }, "Your health vault is locked to your phone. We verify every new device once."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement(MButton, {
    variant: "primary",
    block: true,
    iconRight: "arrow-right"
  }, "Verify & Continue")));
}

// ─────────────────────────────────────────────────────────────
// 3. SOS HOME — the big red button
// ─────────────────────────────────────────────────────────────
function ScreenSosHome() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    leading: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "list"
    }),
    title: "SOS Emergency",
    trailing: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "bell"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '0 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sos-stage"
  }, /*#__PURE__*/React.createElement(MStatus, {
    tone: "green"
  }, "All systems ready"), /*#__PURE__*/React.createElement(SosBig, null), /*#__PURE__*/React.createElement("p", {
    className: "sos-instruct"
  }, /*#__PURE__*/React.createElement("strong", null, "Hold for 3 seconds"), " to dispatch emergency services with your location.")), /*#__PURE__*/React.createElement("div", {
    className: "m-section",
    style: {
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Active settings")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "geo-alt-fill",
    iconTone: "red",
    title: "Location sharing",
    sub: "On \xB7 415 Mission St",
    trailing: "6 m ago",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "people-fill",
    iconTone: "blue",
    title: "Emergency contacts",
    sub: "3 contacts will be notified"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "capsule",
    iconTone: "purple",
    title: "Medical profile",
    sub: "Penicillin allergy \xB7 Type II diabetes"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "m-section",
    style: {
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Recent incidents"), /*#__PURE__*/React.createElement("a", {
    className: "link",
    href: "#"
  }, "All")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "check2",
    iconTone: "green",
    title: "Test alert",
    sub: "Saturday \xB7 9:14 PM",
    trailingStrong: "Resolved",
    chev: false
  })))));
}

// ─────────────────────────────────────────────────────────────
// 4. SOS ACTIVE — emergency in progress (dispatching)
// ─────────────────────────────────────────────────────────────
function ScreenSosActive() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
      color: '#fff',
      padding: '40px 20px 24px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,.18), transparent 60%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement(MHeader, {
    variant: "transparent",
    leading: /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn ghost",
      style: {
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-chevron-left"
    })),
    title: "Emergency in progress",
    trailing: /*#__PURE__*/React.createElement("button", {
      className: "m-iconbtn ghost",
      style: {
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-three-dots"
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      textAlign: 'center',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: 99,
      background: 'rgba(255,255,255,.18)',
      backdropFilter: 'blur(8px)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 99,
      background: '#fff',
      animation: 'sosPulseBig 1.4s infinite'
    }
  }), "Dispatching"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 32,
      margin: '12px 0 4px',
      letterSpacing: '-0.02em'
    }
  }, "Help is on the way"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: 'rgba(255,255,255,.85)',
      margin: 0
    }
  }, "ETA ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#fff'
    }
  }, "6 min 24 sec"), " \xB7 Mercy General EMS-04"))), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '16px',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 140,
      borderRadius: 18,
      overflow: 'hidden',
      border: '1px solid var(--border-1)',
      background: 'linear-gradient(180deg, #e8f0ea, #d5e3d8)',
      position: 'relative',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    viewBox: "0 0 320 140",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M-20 80 Q 60 60 140 90 T 340 70",
    stroke: "#fff",
    strokeWidth: "8",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M-20 80 Q 60 60 140 90 T 340 70",
    stroke: "#cbd5e0",
    strokeWidth: "1",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40 -10 L 80 160",
    stroke: "#fff",
    strokeWidth: "6",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M220 -10 L 240 160",
    stroke: "#fff",
    strokeWidth: "6",
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "180",
    cy: "85",
    r: "10",
    fill: "#dc2626"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "180",
    cy: "85",
    r: "18",
    fill: "rgba(220,38,38,.2)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "60",
    cy: "40",
    r: "7",
    fill: "#3b82f6"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      padding: '4px 10px',
      borderRadius: 99,
      background: 'rgba(255,255,255,.95)',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--fg-1)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-geo-alt-fill",
    style: {
      color: 'var(--accent)'
    }
  }), " 415 Mission St")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "person-arms-up",
    iconTone: "blue",
    title: "Dr. Marcus Rivera",
    sub: "EMT-Paramedic \xB7 Mercy General",
    trailing: "2.4 mi",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "truck-front-fill",
    iconTone: "red",
    title: "EMS-04",
    sub: "Ambulance dispatched \xB7 6:42 PM",
    trailing: "6 min",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "telephone-forward-fill",
    iconTone: "green",
    title: "Call dispatcher",
    sub: "Direct line to your responder"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12
    }
  }), /*#__PURE__*/React.createElement(MBanner, {
    tone: "info",
    title: "Sharing automatically"
  }, "Your live location, vitals, allergies, and emergency contacts have been sent to the responder."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12
    }
  }), /*#__PURE__*/React.createElement(MButton, {
    variant: "secondary",
    block: true,
    icon: "x-circle"
  }, "Cancel emergency")));
}

// ─────────────────────────────────────────────────────────────
// 5. EHR — Health Records home (list + categories + recent)
// ─────────────────────────────────────────────────────────────
function ScreenEhr() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MLargeHead, {
    greeting: "Vault \xB7 Jordan Patel",
    title: "Health Records",
    trailing: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "share"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '8px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 0 12px'
    }
  }, /*#__PURE__*/React.createElement(MSearch, {
    placeholder: "Search records, prescriptions"
  })), /*#__PURE__*/React.createElement("div", {
    className: "m-card",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--fg-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontWeight: 700,
      margin: 0
    }
  }, "My vault"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22,
      letterSpacing: '-0.02em',
      margin: '4px 0 0'
    }
  }, "247 records")), /*#__PURE__*/React.createElement(MStatus, {
    tone: "green"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-shield-fill-check"
  }), "Synced")), /*#__PURE__*/React.createElement("div", {
    className: "stat-grid"
  }, /*#__PURE__*/React.createElement(StatTile, {
    icon: "capsule",
    label: "Prescriptions",
    value: "12",
    trend: "2 active",
    trendDir: "up"
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "clipboard-pulse-fill",
    label: "Lab results",
    value: "38",
    trend: "5 this month",
    trendDir: "up"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "m-section",
    style: {
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Categories")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "capsule",
    iconTone: "purple",
    title: "Prescriptions",
    sub: "12 records \xB7 2 active",
    trailing: ""
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "clipboard-pulse-fill",
    iconTone: "blue",
    title: "Lab results",
    sub: "38 records \xB7 A1c due in 9 days"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "camera-fill",
    iconTone: "green",
    title: "Imaging & scans",
    sub: "6 records \xB7 MRI Apr 2026"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "bandaid-fill",
    iconTone: "red",
    title: "Visits & discharge",
    sub: "14 records"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "shield-fill-check",
    iconTone: "amber",
    title: "Allergies & conditions",
    sub: "3 entries \xB7 Penicillin, T2D, Asthma"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "m-section",
    style: {
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Recent activity"), /*#__PURE__*/React.createElement("a", {
    className: "link",
    href: "#"
  }, "All")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "upload",
    iconTone: "green",
    title: "Lipid panel uploaded",
    sub: "Mercy General \xB7 today",
    trailing: "OCR'd",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "share-fill",
    iconTone: "blue",
    title: "Shared with Dr. Rao",
    sub: "Cardiology \xB7 expires 7d",
    trailing: "\u25CF",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "hourglass-split",
    iconTone: "amber",
    title: "A1c result pending",
    sub: "Quest Diagnostics \xB7 3 days",
    chev: false
  })))));
}

// ─────────────────────────────────────────────────────────────
// 6. EHR Detail — single lab result / prescription
// ─────────────────────────────────────────────────────────────
function ScreenEhrDetail() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    leading: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "chevron-left"
    }),
    title: "Lipid Panel",
    trailing: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "share"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '4px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-card",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ico tone-blue",
    style: {
      width: 44,
      height: 44,
      borderRadius: 14,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-clipboard-pulse-fill"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: 'var(--fg-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      fontWeight: 700,
      margin: 0
    }
  }, "Lab result"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      margin: 0,
      letterSpacing: '-0.015em'
    }
  }, "Quest Diagnostics")), /*#__PURE__*/React.createElement(MStatus, {
    tone: "green"
  }, "Normal")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: 'var(--fg-muted)',
      margin: 0
    }
  }, "Collected Tue May 12 \xB7 Reviewed by Dr. A. Rao \xB7 Ref #LP-22841")), /*#__PURE__*/React.createElement("div", {
    className: "m-section-head",
    style: {
      margin: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("h2", null, "Values")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "heart-fill",
    iconTone: "red",
    title: "LDL Cholesterol",
    sub: "Optimal: < 100 mg/dL",
    trailingStrong: "92 mg/dL",
    trailing: "Normal",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "heart-fill",
    iconTone: "green",
    title: "HDL Cholesterol",
    sub: "Optimal: > 60 mg/dL",
    trailingStrong: "64 mg/dL",
    trailing: "Normal",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "droplet-fill",
    iconTone: "amber",
    title: "Triglycerides",
    sub: "Optimal: < 150 mg/dL",
    trailingStrong: "172 mg/dL",
    trailing: "Borderline",
    chev: false
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "speedometer2",
    iconTone: "blue",
    title: "Total / HDL ratio",
    sub: "Optimal: < 5.0",
    trailingStrong: "3.4",
    trailing: "Normal",
    chev: false
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12
    }
  }), /*#__PURE__*/React.createElement(MBanner, {
    tone: "warn",
    title: "One value to watch"
  }, "Your triglycerides are slightly elevated. Diet adjustments usually move this back into range."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(MButton, {
    variant: "primary",
    icon: "share",
    block: true
  }, "Share with a doctor"), /*#__PURE__*/React.createElement(MButton, {
    variant: "secondary",
    icon: "download"
  }))));
}

// ─────────────────────────────────────────────────────────────
// 7. DOCTORS — list with filters
// ─────────────────────────────────────────────────────────────
function ScreenDoctors() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MLargeHead, {
    greeting: "Consult",
    title: "Find a doctor",
    trailing: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "sliders"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '8px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement(MSearch, {
    placeholder: "Specialty, name, condition"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginTop: 12,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(MChip, {
    active: true,
    icon: "lightning-charge-fill"
  }, "Available now"), /*#__PURE__*/React.createElement(MChip, null, "Video"), /*#__PURE__*/React.createElement(MChip, null, "In person"), /*#__PURE__*/React.createElement(MChip, null, "Top rated")), /*#__PURE__*/React.createElement("div", {
    className: "row-gap",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(DocCard, {
    initials: "AR",
    avatarTone: "blue",
    name: "Dr. Amita Rao",
    role: "Cardiologist \xB7 14 yr exp",
    rating: "4.9 (412)",
    distance: "2.1 mi",
    price: "$45",
    online: true
  }), /*#__PURE__*/React.createElement(DocCard, {
    initials: "MR",
    avatarTone: "purple",
    name: "Dr. Marcus Rivera",
    role: "General Physician \xB7 8 yr exp",
    rating: "4.8 (1.2k)",
    distance: "0.8 mi",
    price: "$30",
    online: true
  }), /*#__PURE__*/React.createElement(DocCard, {
    initials: "LI",
    avatarTone: "green",
    name: "Dr. Lakshmi Iyer",
    role: "Pediatrician \xB7 11 yr exp",
    rating: "4.9 (689)",
    distance: "3.4 mi",
    price: "$38"
  }), /*#__PURE__*/React.createElement(DocCard, {
    initials: "RD",
    avatarTone: "red",
    name: "Dr. Rina Desai",
    role: "Internal Medicine \xB7 9 yr",
    rating: "4.7 (320)",
    distance: "1.7 mi",
    price: "$35",
    online: true
  }))));
}

// ─────────────────────────────────────────────────────────────
// 8. BOOKING — doctor detail + time slots
// ─────────────────────────────────────────────────────────────
function ScreenBooking() {
  const days = [{
    d: 'Mon',
    n: 24,
    free: false
  }, {
    d: 'Tue',
    n: 25,
    free: true,
    active: true
  }, {
    d: 'Wed',
    n: 26,
    free: true
  }, {
    d: 'Thu',
    n: 27,
    free: false
  }, {
    d: 'Fri',
    n: 28,
    free: true
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MHeader, {
    leading: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "chevron-left"
    }),
    title: "Book appointment",
    trailing: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "heart"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '8px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement(DocCard, {
    initials: "AR",
    avatarTone: "blue",
    name: "Dr. Amita Rao",
    role: "Cardiologist \xB7 Mercy General",
    rating: "4.9 (412)",
    distance: "2.1 mi",
    price: "$45",
    online: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 14,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(MChip, {
    active: true
  }, "Video"), /*#__PURE__*/React.createElement(MChip, null, "Voice"), /*#__PURE__*/React.createElement(MChip, null, "In person"), /*#__PURE__*/React.createElement(MChip, null, "Chat")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--fg-muted)',
      margin: '6px 0 10px'
    }
  }, "May \xB7 this week"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 8
    }
  }, days.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.n,
    className: `m-chip ${d.active ? 'active' : ''}`,
    style: {
      flexDirection: 'column',
      gap: 2,
      padding: '10px 0',
      opacity: d.free ? 1 : 0.4,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 600
    }
  }, d.d), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 16,
      fontWeight: 800
    }
  }, d.n)))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--fg-muted)',
      margin: '20px 0 10px'
    }
  }, "Available slots \xB7 Tue May 25"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8
    }
  }, ['9:00 AM', '10:30', '11:15', '1:45 PM', '3:00', '4:30', '5:15', '6:00', '7:45'].map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: `m-chip ${i === 4 ? 'active' : ''}`,
    style: {
      justifyContent: 'center',
      padding: '10px 0',
      fontSize: 13
    }
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement(MBanner, {
    tone: "success",
    title: "Notes will sync"
  }, "Visit notes and prescriptions will be added to your vault automatically."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 14
    }
  }), /*#__PURE__*/React.createElement(MButton, {
    variant: "primary",
    block: true,
    iconRight: "arrow-right"
  }, "Confirm \xB7 Tue 3:00 PM")));
}

// ─────────────────────────────────────────────────────────────
// 9. VIDEO CALL — in-consult
// ─────────────────────────────────────────────────────────────
function ScreenVideoCall() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      background: '#0e0d12',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'radial-gradient(circle at 50% 35%, rgba(168,85,247,.35), transparent 55%), linear-gradient(180deg, #2c1a4d, #0e0d12)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '32%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 140,
      height: 140,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #a855f7, #6d28d9)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 50,
      boxShadow: '0 12px 40px rgba(124,58,237,.5)'
    }
  }, "AR"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 60,
      left: 16,
      right: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 10px',
      borderRadius: 99,
      background: 'rgba(255,255,255,.12)',
      backdropFilter: 'blur(10px)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 99,
      background: '#22c55e'
    }
  }), "12:24"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '6px 10px',
      borderRadius: 99,
      background: 'rgba(255,255,255,.12)',
      backdropFilter: 'blur(10px)',
      fontSize: 11,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-translate"
  }), " EN \u2194 HI")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 110,
      right: 16,
      width: 80,
      height: 110,
      borderRadius: 14,
      background: 'linear-gradient(135deg, #475569, #1e293b)',
      border: '2px solid rgba(255,255,255,.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 13,
      fontWeight: 700,
      fontFamily: 'var(--font-display)'
    }
  }, "JP"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 130,
      left: 16,
      right: 16,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 20,
      margin: 0
    }
  }, "Dr. Amita Rao"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      opacity: 0.7,
      margin: '4px 0 0'
    }
  }, "Cardiology consult \xB7 Notes recording"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,.08)',
      backdropFilter: 'blur(20px)',
      padding: '18px 20px 38px',
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, [{
    i: 'mic-fill',
    bg: 'rgba(255,255,255,.14)'
  }, {
    i: 'camera-video-fill',
    bg: 'rgba(255,255,255,.14)'
  }, {
    i: 'chat-square-text-fill',
    bg: 'rgba(255,255,255,.14)'
  }, {
    i: 'telephone-x-fill',
    bg: '#dc2626',
    big: true
  }].map((b, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      width: b.big ? 60 : 48,
      height: b.big ? 60 : 48,
      borderRadius: '50%',
      border: 0,
      color: '#fff',
      background: b.bg,
      cursor: 'pointer',
      fontSize: b.big ? 22 : 18,
      boxShadow: b.big ? '0 8px 24px rgba(220,38,38,.45)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-${b.i}`
  })))));
}

// ─────────────────────────────────────────────────────────────
// 10. PROFILE / MORE
// ─────────────────────────────────────────────────────────────
function ScreenProfile() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MLargeHead, {
    title: "You",
    trailing: /*#__PURE__*/React.createElement(MIconBtn, {
      icon: "gear"
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '8px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-card",
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 18,
      background: 'linear-gradient(135deg, #a855f7, #6d28d9)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22
    }
  }, "JP"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 17,
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, "Jordan Patel"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      color: 'var(--fg-muted)',
      margin: '2px 0 6px'
    }
  }, "+1 (415) 555-0142 \xB7 jordan@email.com"), /*#__PURE__*/React.createElement(MStatus, {
    tone: "green"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-shield-fill-check"
  }), "Vault verified"))), /*#__PURE__*/React.createElement("div", {
    className: "m-section",
    style: {
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Account")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "person-vcard-fill",
    iconTone: "blue",
    title: "Personal info",
    sub: "Name, DOB, address"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "people-fill",
    iconTone: "red",
    title: "Emergency contacts",
    sub: "3 contacts",
    trailing: "3"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "credit-card-2-front-fill",
    iconTone: "purple",
    title: "Insurance",
    sub: "Aetna \xB7 PPO"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "people-fill",
    iconTone: "green",
    title: "Family vaults",
    sub: "Mom \xB7 Dad \xB7 Aanya",
    trailing: "3"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "m-section",
    style: {
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Preferences")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "bell-fill",
    iconTone: "amber",
    title: "Notifications"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "translate",
    iconTone: "blue",
    title: "Language",
    trailing: "English"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "moon-stars-fill",
    iconTone: "purple",
    title: "Appearance",
    trailing: "System"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "shield-lock-fill",
    iconTone: "red",
    title: "Privacy & data"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "m-section",
    style: {
      padding: '4px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Support")), /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "question-circle-fill",
    iconTone: "gray",
    title: "Help center"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "chat-left-dots-fill",
    iconTone: "gray",
    title: "Contact support"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "box-arrow-right",
    iconTone: "red",
    title: "Sign out",
    chev: false
  })))));
}

// ─────────────────────────────────────────────────────────────
// 11. BOTTOM SHEET DEMO — diet hand-off
// ─────────────────────────────────────────────────────────────
function ScreenSheetDemo() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MLargeHead, {
    greeting: "Diet",
    title: "Nutrition"
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll",
    style: {
      padding: '8px 16px 0',
      opacity: 0.5,
      filter: 'blur(2px)'
    }
  }, /*#__PURE__*/React.createElement(MList, null, /*#__PURE__*/React.createElement(MRow, {
    icon: "apple",
    iconTone: "green",
    title: "Today's meal plan",
    sub: "1,820 kcal \xB7 Mediterranean"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "cup-hot-fill",
    iconTone: "amber",
    title: "Recipes",
    sub: "Quick \xB7 for diabetes"
  }), /*#__PURE__*/React.createElement(MRow, {
    icon: "basket-fill",
    iconTone: "blue",
    title: "Grocery list",
    sub: "9 items"
  }))), /*#__PURE__*/React.createElement(BottomSheet, {
    title: "Hand off to MyFoodCraving?",
    sub: "Diet & nutrition lives in our partner app. We'll pass your conditions and meds so meal plans match."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      padding: '10px 12px',
      background: 'var(--bg-2)',
      borderRadius: 14,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ico tone-green",
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-apple"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14,
      margin: 0
    }
  }, "MyFoodCraving"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11.5,
      color: 'var(--fg-muted)',
      margin: '2px 0 0'
    }
  }, "Free \xB7 Will open in app")), /*#__PURE__*/React.createElement(MStatus, {
    tone: "green"
  }, "Linked")), /*#__PURE__*/React.createElement(MButton, {
    variant: "primary",
    block: true,
    iconRight: "box-arrow-up-right"
  }, "Open MyFoodCraving"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8
    }
  }), /*#__PURE__*/React.createElement(MButton, {
    variant: "ghost",
    block: true
  }, "Not now")));
}
Object.assign(window, {
  ScreenOnboarding,
  ScreenOtp,
  ScreenSosHome,
  ScreenSosActive,
  ScreenEhr,
  ScreenEhrDetail,
  ScreenDoctors,
  ScreenBooking,
  ScreenVideoCall,
  ScreenProfile,
  ScreenSheetDemo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_mobile/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/App.jsx
try { (() => {
// App.jsx — top-level shell, view router, theme + lang state
const {
  useEffect
} = React;

// ---------- Content per surface (lifted from production templates) ----------
const SOS_FEATURES = [{
  tone: 'red',
  slotId: 'sos-fc-1',
  slotPlaceholder: 'alarm / siren',
  surfaceTag: '01 · sos',
  title: 'Instant Response',
  description: 'Help dispatched in under 10 minutes, with real-time tracking and automated alerts to your emergency contacts.',
  benefits: ['Sub-10 minute response', 'Real-time tracking', 'Auto contact alerts']
}, {
  tone: 'red',
  slotId: 'sos-fc-2',
  slotPlaceholder: 'shield / lock',
  surfaceTag: '01 · sos',
  title: 'Medical-Grade Security',
  description: 'HIPAA-compliant, end-to-end encrypted platform ensuring complete privacy and security of your medical data.',
  benefits: ['HIPAA compliant', 'End-to-end encryption', 'Secure data storage']
}, {
  tone: 'red',
  slotId: 'sos-fc-3',
  slotPlaceholder: 'doctor / team',
  surfaceTag: '01 · sos',
  title: 'Certified Medical Team',
  description: '24/7 access to licensed emergency professionals, directly connected to hospitals and emergency services.',
  benefits: ['Licensed professionals', '24/7 availability', 'Hospital connections']
}, {
  tone: 'red',
  slotId: 'sos-fc-4',
  slotPlaceholder: 'map pin',
  surfaceTag: '01 · sos',
  title: 'Smart Location',
  description: 'Accurate GPS and indoor mapping technology for rapid, precise assistance wherever you are.',
  benefits: ['GPS precision', 'Indoor mapping', 'Location sharing']
}, {
  tone: 'red',
  slotId: 'sos-fc-5',
  slotPlaceholder: 'heart',
  surfaceTag: '01 · sos',
  title: 'Health Integration',
  description: 'Securely connects to your health records and medical history for better, faster emergency care.',
  benefits: ['Medical history access', 'Medication alerts', 'Allergy notifications']
}, {
  tone: 'red',
  slotId: 'sos-fc-6',
  slotPlaceholder: 'phone',
  surfaceTag: '01 · sos',
  title: 'Multi-Channel Support',
  description: 'Voice, text, and video communication options — get help your way, in any language you prefer.',
  benefits: ['Multiple languages', 'Voice & video calls', 'Text messaging']
}];
const SOS_TESTIMONIALS = [{
  initial: 'S',
  name: 'Dr. Sarah Chen',
  role: 'Emergency Physician',
  quote: "Response time was incredible. Within 2 minutes, I had medical professionals on the line and an ambulance dispatched."
}, {
  initial: 'M',
  name: 'Michael Rodriguez',
  role: 'Parent',
  quote: "Knowing my family has 24/7 emergency protection gives me incredible peace of mind. The app is intuitive and reliable."
}, {
  initial: 'E',
  name: 'Eleanor Thompson',
  role: 'Senior Care',
  quote: "At 78, living independently was a concern. This service gives my family confidence that help is always available."
}];
const EHR_FEATURES = [{
  tone: 'blue',
  slotId: 'ehr-fc-1',
  slotPlaceholder: 'vault / folder',
  surfaceTag: '02 · records',
  title: 'One Secure Vault',
  description: 'Every record from every provider, in one HIPAA-compliant timeline.',
  benefits: ['Encrypted at rest', 'Provider-neutral', 'Patient-owned']
}, {
  tone: 'blue',
  slotId: 'ehr-fc-2',
  slotPlaceholder: 'share / link',
  surfaceTag: '02 · records',
  title: 'Share in One Tap',
  description: 'Grant any specialist or emergency room access to exactly what they need, for as long as you choose.',
  benefits: ['Granular permissions', 'Auto-expire links', 'Audit trail']
}, {
  tone: 'blue',
  slotId: 'ehr-fc-3',
  slotPlaceholder: 'chart / graph',
  surfaceTag: '02 · records',
  title: 'Trend Your Health',
  description: 'Automatic charts for vitals, labs, and medications — spot patterns before they become problems.',
  benefits: ['Lab history', 'Medication tracker', 'Vitals dashboard']
}, {
  tone: 'blue',
  slotId: 'ehr-fc-4',
  slotPlaceholder: 'OCR / scan',
  surfaceTag: '02 · records',
  title: 'Snap & Digitize',
  description: 'Photograph any paper record — prescriptions, lab reports, discharge summaries — and we OCR + categorize it instantly.',
  benefits: ['Photo OCR', 'Auto-categorize', '30+ languages']
}, {
  tone: 'blue',
  slotId: 'ehr-fc-5',
  slotPlaceholder: 'family / shield',
  surfaceTag: '02 · records',
  title: 'Family Vaults',
  description: 'Manage records for parents, kids, or anyone in your care — separate vaults, shared visibility, role-based access.',
  benefits: ['Caregiver mode', 'Pediatric profiles', 'Senior care']
}, {
  tone: 'blue',
  slotId: 'ehr-fc-6',
  slotPlaceholder: 'cloud sync',
  surfaceTag: '02 · records',
  title: 'Works Everywhere',
  description: 'Pulls automatically from hospitals on HL7-FHIR, syncs across phone + web + watch, and works offline when you need it.',
  benefits: ['HL7-FHIR ingestion', 'Offline-first', 'Cross-device sync']
}];
const EHR_TESTIMONIALS = [{
  initial: 'A',
  name: 'Dr. Amita Rao',
  role: 'Cardiologist',
  quote: "The first time a patient handed me three years of complete records on the spot, I almost cried. This is the EHR I've wanted my whole career."
}, {
  initial: 'L',
  name: 'Lakshmi Iyer',
  role: 'Primary caregiver',
  quote: "My mother sees four specialists. I used to carry a folder. Now I just unlock the vault for whichever doctor needs it."
}, {
  initial: 'B',
  name: 'Ben Schultz',
  role: 'Living with diabetes',
  quote: "I can finally see my A1c trend across five years on one chart. I caught a slow drift and changed my meds before it became an emergency."
}];
const DOCTOR_FEATURES = [{
  tone: 'purple',
  slotId: 'doc-fc-1',
  slotPlaceholder: 'calendar',
  surfaceTag: '03 · consult',
  title: 'Book in 60 Seconds',
  description: 'Pick a doctor, pick a time. Real availability, real specialists, no phone tag.',
  benefits: ['10,000+ specialists', 'Same-day slots', 'Free rescheduling']
}, {
  tone: 'purple',
  slotId: 'doc-fc-2',
  slotPlaceholder: 'video camera',
  surfaceTag: '03 · consult',
  title: 'Video, Voice, or Chat',
  description: 'Consult on the channel that works for you, with the same doctor every time.',
  benefits: ['HD video', 'Phone fallback', 'Encrypted chat']
}, {
  tone: 'purple',
  slotId: 'doc-fc-3',
  slotPlaceholder: 'clipboard',
  surfaceTag: '03 · consult',
  title: 'Notes That Travel',
  description: 'Every consultation is auto-summarized and added to your EHR — no faxing, no follow-up calls.',
  benefits: ['Auto-summary', 'Prescriptions delivered', 'Synced to records']
}, {
  tone: 'purple',
  slotId: 'doc-fc-4',
  slotPlaceholder: 'second opinion',
  surfaceTag: '03 · consult',
  title: 'Second Opinions, Fast',
  description: 'Get a written second opinion from an independent specialist on any major diagnosis — inside 48 hours, no awkward conversations.',
  benefits: ['48-hr turnaround', 'Independent panel', 'Specialty matching']
}, {
  tone: 'purple',
  slotId: 'doc-fc-5',
  slotPlaceholder: 'translator',
  surfaceTag: '03 · consult',
  title: 'Speak Your Language',
  description: 'Real-time medical translation across 30+ languages — patient speaks Hindi, doctor speaks English, both understand each other.',
  benefits: ['30+ languages', 'Medical terminology', 'Caption mode']
}, {
  tone: 'purple',
  slotId: 'doc-fc-6',
  slotPlaceholder: 'pill bottle',
  surfaceTag: '03 · consult',
  title: 'Pharmacy In-Loop',
  description: 'Prescriptions flow straight to your pharmacy of choice. Refills, allergy checks, generics — handled in the background.',
  benefits: ['e-Rx', 'Allergy alerts', 'Generic swaps']
}];
const DOCTOR_TESTIMONIALS = [{
  initial: 'R',
  name: 'Dr. Rina Desai',
  role: 'Internal Medicine',
  quote: "I see twice as many patients in the same day now — the notes write themselves, the records are already on my screen when the call starts."
}, {
  initial: 'V',
  name: 'Vikram Joshi',
  role: 'Working professional',
  quote: "Three months of trying to find time for a dermatology appointment, then I tried this. 4pm slot, 7-minute wait, prescription at my pharmacy by dinner."
}, {
  initial: 'F',
  name: 'Fatima Al-Khouri',
  role: 'New parent',
  quote: "It's 2am, the baby has a rash, I'm panicking. I had a pediatrician on video in three minutes. That's the entire pitch."
}];

// ---------- View renderers ----------
function SosView({
  onNav
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    trust: "Trusted by 50,000+ families",
    headline: /*#__PURE__*/React.createElement(React.Fragment, null, "Medical Help, Instantly", /*#__PURE__*/React.createElement("br", null)),
    headlineAccent: "Just One Tap Away",
    subtitle: "Connect to certified emergency responders in seconds. Your location and critical info are shared automatically for the fastest, safest care \u2014 anytime, anywhere.",
    stats: [{
      value: '<5 min',
      label: 'Avg. Response'
    }, {
      value: '400+',
      label: 'Lives Saved'
    }, {
      value: '100+',
      label: 'Cities Covered'
    }],
    primaryCta: {
      label: 'Get Protected Now',
      onClick: () => alert('(prototype) Sign up')
    },
    secondaryCta: {
      label: 'See How It Works',
      onClick: () => alert('(prototype) Demo')
    },
    visual: /*#__PURE__*/React.createElement(PhoneMockup, null)
  }), /*#__PURE__*/React.createElement("section", {
    className: "emd-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Medical Emergency Response"), /*#__PURE__*/React.createElement("p", null, "Designed with medical experts, the EaseMyDisease SOS system delivers rapid, reliable help when it matters most.")), /*#__PURE__*/React.createElement(FeatureGrid, {
    features: SOS_FEATURES
  })), /*#__PURE__*/React.createElement(Testimonials, {
    subheading: "Real stories from people we've helped in critical moments.",
    items: SOS_TESTIMONIALS
  }), /*#__PURE__*/React.createElement(CTASection, {
    title: "Protection in 60 Seconds",
    subtitle: "Join thousands who trust us for fast, professional emergency care. Sign up in minutes for instant coverage and peace of mind.",
    primaryLabel: "Start Free Trial",
    secondaryLabel: "See How It Works",
    trust: [{
      icon: 'bi-shield-check',
      label: 'HIPAA Compliant'
    }, {
      icon: 'bi-award',
      label: 'ISO 27001 Certified'
    }, {
      icon: 'bi-clock',
      label: 'Always On: 24/7 Response'
    }]
  }));
}
function EhrView() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    trust: "HIPAA-compliant by default",
    headline: /*#__PURE__*/React.createElement(React.Fragment, null, "Your Health Records,", /*#__PURE__*/React.createElement("br", null)),
    headlineAccent: "One Secure Place",
    subtitle: "Every prescription, lab, scan, and visit \u2014 encrypted, portable, and yours. Share with a single tap; revoke just as easily.",
    stats: [{
      value: '256-bit',
      label: 'Encryption'
    }, {
      value: '< 1 sec',
      label: 'Share Speed'
    }, {
      value: '100%',
      label: 'Patient-owned'
    }],
    primaryCta: {
      label: 'Start a Free Vault',
      onClick: () => {}
    },
    secondaryCta: {
      label: 'Watch a Demo',
      onClick: () => {}
    },
    visual: /*#__PURE__*/React.createElement(EhrActivityCard, null)
  }), /*#__PURE__*/React.createElement("section", {
    className: "emd-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Built for the way care actually moves"), /*#__PURE__*/React.createElement("p", null, "Six jobs your records need to do \u2014 handled.")), /*#__PURE__*/React.createElement(FeatureGrid, {
    features: EHR_FEATURES
  })), /*#__PURE__*/React.createElement(Testimonials, {
    tone: "blue",
    heading: "Records that move with you",
    subheading: "From caregivers to specialists \u2014 the people whose work just got easier.",
    items: EHR_TESTIMONIALS
  }), /*#__PURE__*/React.createElement(CTASection, {
    tone: "blue",
    title: "Your medical history, finally yours",
    subtitle: "Free for life. Import your first records in five minutes. Share them with a doctor in one tap.",
    primaryLabel: "Create Your Vault",
    secondaryLabel: "See How Sharing Works",
    trust: [{
      icon: 'bi-shield-check',
      label: 'HIPAA Compliant'
    }, {
      icon: 'bi-lock-fill',
      label: 'Zero-knowledge encryption'
    }, {
      icon: 'bi-globe',
      label: '30+ countries supported'
    }]
  }));
}
function DoctorView() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    trust: "10,000+ licensed specialists",
    headline: /*#__PURE__*/React.createElement(React.Fragment, null, "Talk to a Doctor,", /*#__PURE__*/React.createElement("br", null)),
    headlineAccent: "Without the Wait",
    subtitle: "Book a same-day video, voice, or chat consultation. Notes sync to your records automatically; prescriptions arrive at your pharmacy.",
    stats: [{
      value: '~7 min',
      label: 'Avg. Wait'
    }, {
      value: '4.8★',
      label: 'Doctor Rating'
    }, {
      value: '24/7',
      label: 'Availability'
    }],
    primaryCta: {
      label: 'Find a Doctor',
      onClick: () => {}
    },
    secondaryCta: {
      label: 'How It Works',
      onClick: () => {}
    },
    visual: /*#__PURE__*/React.createElement(DoctorBookingCard, null)
  }), /*#__PURE__*/React.createElement("section", {
    className: "emd-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, "Consultation, without the friction"), /*#__PURE__*/React.createElement("p", null, "From booking to prescription, in fewer steps than picking up the phone.")), /*#__PURE__*/React.createElement(FeatureGrid, {
    features: DOCTOR_FEATURES
  })), /*#__PURE__*/React.createElement(Testimonials, {
    tone: "purple",
    heading: "Care that fits your life",
    subheading: "Doctors who love the platform; patients who actually get seen.",
    items: DOCTOR_TESTIMONIALS
  }), /*#__PURE__*/React.createElement(CTASection, {
    tone: "purple",
    title: "A doctor on call, not on hold",
    subtitle: "Your first consult is free. Match with a specialist in under five minutes. No insurance fight, no waiting room.",
    primaryLabel: "Book Your First Visit",
    secondaryLabel: "Browse Specialists",
    trust: [{
      icon: 'bi-patch-check-fill',
      label: 'Board-certified doctors'
    }, {
      icon: 'bi-translate',
      label: '30+ languages'
    }, {
      icon: 'bi-clock-fill',
      label: 'Same-day appointments'
    }]
  }));
}
function DietViewPlaceholder() {
  return null;
}
// (removed in favor of full MFC-style DietView in DietView.jsx)

// ---------- App shell ----------
function App() {
  const [view, setView] = React.useState('sos');
  const [theme, setTheme] = React.useState('light');
  const [lang, setLang] = React.useState('EN');
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(l => l === 'EN' ? l = 'HI' : l === 'HI' ? 'ES' : 'EN');
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, {
    currentView: view,
    onNavigate: setView,
    theme: theme,
    onToggleTheme: toggleTheme,
    lang: lang,
    onToggleLang: toggleLang
  }), view === 'sos' && /*#__PURE__*/React.createElement(SosView, {
    onNav: setView
  }), view === 'ehr' && /*#__PURE__*/React.createElement(EhrView, null), view === 'doctor' && /*#__PURE__*/React.createElement(DoctorView, null), view === 'diet' && /*#__PURE__*/React.createElement(DietView, null), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(EmergencyFAB, {
    onClick: () => setView('sos')
  }));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Button.jsx — canonical button variants
function Button({
  variant = 'primary',
  icon,
  iconRight,
  children,
  onClick,
  className = '',
  ...rest
}) {
  const cls = `emd-btn ${variant} ${className}`.trim();
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    onClick: onClick
  }, rest), icon ? /*#__PURE__*/React.createElement("i", {
    className: `bi ${icon}`
  }) : null, /*#__PURE__*/React.createElement("span", null, children), iconRight ? /*#__PURE__*/React.createElement("i", {
    className: `bi ${iconRight}`
  }) : null);
}
window.Button = Button;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/Button.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/CTASection.jsx
try { (() => {
// CTASection.jsx — full-bleed conversion section, tone-aware
function CTASection({
  tone = 'red',
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  trust
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: `emd-cta tone-${tone}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-cta-inner"
  }, /*#__PURE__*/React.createElement("h2", null, title), /*#__PURE__*/React.createElement("p", null, subtitle), /*#__PURE__*/React.createElement("div", {
    className: "emd-cta-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "emd-btn cta-primary",
    onClick: () => alert('(prototype) Sign up')
  }, primaryLabel), /*#__PURE__*/React.createElement("button", {
    className: "emd-btn cta-secondary",
    onClick: () => alert('(prototype) Watch demo')
  }, secondaryLabel)), trust && trust.length ? /*#__PURE__*/React.createElement("div", {
    className: "emd-cta-trust"
  }, trust.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi ${t.icon}`
  }), /*#__PURE__*/React.createElement("span", null, t.label)))) : null));
}
window.CTASection = CTASection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/CTASection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/DietView.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// DietView.jsx — Diet & Nutrition surface, designed in the MyFoodCraving aesthetic.
// Self-contained scoped styles so the MFC vocabulary doesn't bleed into the rest of the EMD app.
const {
  useState: useDvState
} = React;
const MFC_CRAVING_CHIPS = [{
  id: 'pasta',
  label: 'pasta'
}, {
  id: 'bowl',
  label: 'something fresh'
}, {
  id: 'spicy',
  label: 'spicy'
}, {
  id: 'sweet',
  label: 'sweet'
}, {
  id: 'cozy',
  label: 'cozy'
}, {
  id: 'light',
  label: 'light'
}];
const MFC_LIES = [{
  num: '01',
  text: /*#__PURE__*/React.createElement(React.Fragment, null, "Calorie counting ", /*#__PURE__*/React.createElement("s", null, "tracked your food"), ", but it never knew you were ", /*#__PURE__*/React.createElement("b", null, "iron-deficient"), ".")
}, {
  num: '02',
  text: /*#__PURE__*/React.createElement(React.Fragment, null, "Generic meal plans gave 47 million people ", /*#__PURE__*/React.createElement("b", null, "the same"), " 1,800-cal salad.")
}, {
  num: '03',
  text: /*#__PURE__*/React.createElement(React.Fragment, null, "Recipe apps showed you the dish but ", /*#__PURE__*/React.createElement("b", null, "never how to cook it"), " when you've never held a chef's knife.")
}, {
  num: '04',
  text: /*#__PURE__*/React.createElement(React.Fragment, null, "Cravings got framed as the enemy. They're ", /*#__PURE__*/React.createElement("b", null, "your body talking"), ". We translate.")
}];
const MFC_TARGETS = [{
  label: 'Iron',
  pct: 84,
  color: 'berry',
  v: '4.2mg'
}, {
  label: 'B12',
  pct: 76,
  color: 'matcha',
  v: '3.1µg'
}, {
  label: 'Fiber',
  pct: 72,
  color: 'butter',
  v: '12g'
}, {
  label: 'Sodium',
  pct: 72,
  color: 'orange',
  v: '380mg',
  inverted: true
}];
const MFC_STEPS = [{
  id: 1,
  title: 'Prep & rinse',
  detail: 'Rinse 1 cup quinoa under cold water until it runs clear. Drain well — this kills the bitter coating.'
}, {
  id: 2,
  title: 'Dice the crew',
  detail: 'Cucumber, cherry tomatoes, red onion — small dice, roughly the size of the quinoa.'
}, {
  id: 3,
  title: 'Simmer the grain',
  detail: 'Bring 2 cups water to a boil. Add quinoa, cover, reduce to low. Simmer 15 min until water is gone.'
}, {
  id: 4,
  title: 'Whisk the dressing',
  detail: 'Tahini, lemon juice, olive oil, garlic, salt. Whisk until creamy — add water if too thick.'
}, {
  id: 5,
  title: 'Toss & taste',
  detail: 'Combine fluffed quinoa with veg, dressing, parsley, and a handful of crumbled feta. Adjust salt.'
}];
const MFC_INGREDIENTS = [{
  name: 'Quinoa',
  amt: '1 cup',
  checked: true
}, {
  name: 'Cucumber',
  amt: '1 small',
  checked: true
}, {
  name: 'Cherry tomatoes',
  amt: '1.5 cups',
  checked: true
}, {
  name: 'Red onion',
  amt: '½ small',
  checked: false
}, {
  name: 'Tahini',
  amt: '3 tbsp',
  checked: false
}, {
  name: 'Lemon',
  amt: '1 large',
  checked: false
}, {
  name: 'Feta',
  amt: '⅓ cup',
  checked: false
}, {
  name: 'Parsley',
  amt: '1 bunch',
  checked: false
}];
function MfcRing({
  pct,
  color,
  label,
  v,
  inverted
}) {
  const r = 26,
    circ = 2 * Math.PI * r;
  const shown = inverted ? Math.max(0, 100 - pct) : pct;
  const off = circ * (1 - Math.min(100, shown) / 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "mfc-ring-cell"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "mfc-ring-svg",
    viewBox: "0 0 64 64"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "32",
    r: r,
    fill: "none",
    strokeWidth: "6",
    className: "mfc-ring-track"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "32",
    cy: "32",
    r: r,
    fill: "none",
    strokeWidth: "6",
    className: `mfc-ring-fill ${color}`,
    strokeDasharray: circ,
    strokeDashoffset: off
  })), /*#__PURE__*/React.createElement("div", {
    className: "mfc-ring-v"
  }, v), /*#__PURE__*/React.createElement("div", {
    className: "mfc-ring-lbl"
  }, label));
}
function DietView() {
  const [chip, setChip] = useDvState('bowl');
  const [stepIdx, setStep] = useDvState(1);
  return /*#__PURE__*/React.createElement("div", {
    className: "mfc-scope"
  }, /*#__PURE__*/React.createElement("section", {
    className: "mfc-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mfc-eyebrow-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-dot"
  }), "personalized \xB7 guided \xB7 delicious"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-scribble"
  }, "for real bodies \u2726")), /*#__PURE__*/React.createElement("h1", {
    className: "mfc-h1"
  }, "Eat what your body's", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "actually craving", /*#__PURE__*/React.createElement("svg", {
    className: "mfc-underline",
    viewBox: "0 0 240 14",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 8 Q 60 2 120 7 T 238 6",
    stroke: "#FF6D2E",
    strokeWidth: "3",
    fill: "none",
    strokeLinecap: "round"
  }))), "."), /*#__PURE__*/React.createElement("p", {
    className: "mfc-sub"
  }, "We read your health, fix the gaps, and guide your cooking."), /*#__PURE__*/React.createElement("div", {
    className: "mfc-craving"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-craving-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "mfc-craving-input",
    placeholder: "something with pasta, but make it healthy\u2026"
  }), /*#__PURE__*/React.createElement("button", {
    className: "mfc-craving-go",
    "aria-label": "Find meals"
  }, "\u2192")), /*#__PURE__*/React.createElement("div", {
    className: "mfc-chips"
  }, MFC_CRAVING_CHIPS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    className: `mfc-chip ${chip === c.id ? 'active' : ''}`,
    onClick: () => setChip(c.id)
  }, c.label)))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-mini"
  }, /*#__PURE__*/React.createElement("span", null, "\u2713 ", /*#__PURE__*/React.createElement("b", null, "12k+"), " meals personalized"), /*#__PURE__*/React.createElement("span", null, "\u2713 syncs with ", /*#__PURE__*/React.createElement("b", null, "Apple Health"), " + ", /*#__PURE__*/React.createElement("b", null, "Google Fit")))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-plate-stage"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-deco",
    style: {
      top: '-2%',
      left: '-4%',
      fontSize: 44
    }
  }, "\uD83C\uDF3F"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-deco",
    style: {
      top: '10%',
      right: '-2%',
      fontSize: 38
    }
  }, "\uD83C\uDF45"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-deco",
    style: {
      bottom: '8%',
      right: '-4%',
      fontSize: 40
    }
  }, "\uD83C\uDF4B"), /*#__PURE__*/React.createElement("div", {
    className: "mfc-plate"
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "diet-hero-plate",
    placeholder: "drop a dish photo"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mfc-sticker mfc-sticker-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-sticker-dot orange"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mfc-sticker-tag"
  }, "Lunch \xB7 suggested"), /*#__PURE__*/React.createElement("div", {
    className: "mfc-sticker-name"
  }, "Mediterranean Quinoa Bowl"))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-sticker mfc-sticker-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-sticker-dot matcha"
  }), /*#__PURE__*/React.createElement("span", null, "+47% iron")), /*#__PURE__*/React.createElement("div", {
    className: "mfc-sticker mfc-sticker-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-sticker-dot orange"
  }), /*#__PURE__*/React.createElement("span", null, "ready in 30 min")), /*#__PURE__*/React.createElement("div", {
    className: "mfc-macros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "480"), /*#__PURE__*/React.createElement("div", {
    className: "u"
  }, "kcal")), /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "32g"), /*#__PURE__*/React.createElement("div", {
    className: "u"
  }, "protein")), /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "48g"), /*#__PURE__*/React.createElement("div", {
    className: "u"
  }, "carbs")), /*#__PURE__*/React.createElement("div", {
    className: "m"
  }, /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, "18g"), /*#__PURE__*/React.createElement("div", {
    className: "u"
  }, "fat"))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-arrow"
  }, "your body asked for this \u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-marquee",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-marquee-track"
  }, [...Array(2)].map((_, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-marquee-item"
  }, "read your blood work"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-marquee-item"
  }, "cook with confidence"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-marquee-item"
  }, "no calorie counting"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-marquee-item"
  }, "close your nutrition gaps"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-marquee-item"
  }, "pasta is back on the menu"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-marquee-item"
  }, "crave smarter, not less")))))), /*#__PURE__*/React.createElement("section", {
    className: "mfc-manifesto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-manifesto-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "mfc-eyebrow inverse"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-dot"
  }), " the problem"), /*#__PURE__*/React.createElement("h2", {
    className: "mfc-h2"
  }, "Diets ", /*#__PURE__*/React.createElement("span", {
    className: "mfc-strike"
  }, "lied"), " to you.", /*#__PURE__*/React.createElement("br", null), "Recipe apps ", /*#__PURE__*/React.createElement("em", null, "guessed"), ".", /*#__PURE__*/React.createElement("br", null), "Your body deserved better.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mfc-lies"
  }, MFC_LIES.map(l => /*#__PURE__*/React.createElement("div", {
    className: "mfc-lie",
    key: l.num
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-lie-num"
  }, l.num), /*#__PURE__*/React.createElement("p", {
    className: "mfc-lie-text"
  }, l.text)))), /*#__PURE__*/React.createElement("blockquote", {
    className: "mfc-quote"
  }, "\"Three apps gave me the same plan. None of them knew my B12 was tanked. MFC figured it out in five minutes.\"", /*#__PURE__*/React.createElement("div", {
    className: "mfc-quote-attrib"
  }, "\u2014 Priya, design lead, six months on MFC")))))), /*#__PURE__*/React.createElement("section", {
    className: "mfc-personalize"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-personalize-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mfc-h2"
  }, "Built around", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "your blood work"), "."), /*#__PURE__*/React.createElement("p", {
    className: "mfc-lede"
  }, "Plug in your last lab report. We close the gaps, dish by dish \u2014 without ever asking you to count a calorie.")), /*#__PURE__*/React.createElement("div", {
    className: "mfc-personalize-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-metric-stack"
  }, [{
    name: 'Iron',
    sub: 'Below range',
    val: '9.2 g/dL',
    active: true
  }, {
    name: 'B12',
    sub: 'Within range',
    val: '412 pg/mL',
    active: true
  }, {
    name: 'Sodium watch',
    sub: 'Reduce intake',
    val: '−15%',
    active: true
  }, {
    name: 'Fiber goal',
    sub: 'Increase',
    val: '+25g',
    active: false
  }].map((m, i) => /*#__PURE__*/React.createElement("div", {
    className: `mfc-metric ${m.active ? 'active' : ''}`,
    key: i
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, m.name), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, m.sub)), /*#__PURE__*/React.createElement("div", {
    className: "val"
  }, m.val), /*#__PURE__*/React.createElement("div", {
    className: "toggle"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-rec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-rec-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-label-mono orange"
  }, "Today's recommendation"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-rec-time"
  }, "12:40 PM")), /*#__PURE__*/React.createElement("div", {
    className: "mfc-rec-meal"
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "diet-rec-meal",
    placeholder: "meal photo"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mfc-rec-name"
  }, "Mediterranean Quinoa Bowl"), /*#__PURE__*/React.createElement("div", {
    className: "mfc-rec-tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-rec-tag"
  }, "+47% iron"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-rec-tag"
  }, "low sodium"), /*#__PURE__*/React.createElement("span", {
    className: "mfc-rec-tag orange"
  }, "B12 boost")))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-rings"
  }, MFC_TARGETS.map((t, i) => /*#__PURE__*/React.createElement(MfcRing, _extends({
    key: i
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-why"
  }, /*#__PURE__*/React.createElement("b", null, "Why this dish?"), " Quinoa + spinach close ", /*#__PURE__*/React.createElement("b", null, "78% of your iron gap"), "; lemon-dressed greens add bioavailability; the salty crunch comes from feta, not soy sauce."))))), /*#__PURE__*/React.createElement("section", {
    className: "mfc-cooking"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-personalize-head"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mfc-h2"
  }, "Walks you through", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "every step"), "."), /*#__PURE__*/React.createElement("p", {
    className: "mfc-lede"
  }, "Step-by-step cooking with a built-in timer and ingredient check-off \u2014 for the times the recipe instinct hasn't kicked in yet.")), /*#__PURE__*/React.createElement("div", {
    className: "mfc-cook-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-cook-board"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-progress"
  }, MFC_STEPS.map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `mfc-pip ${i < stepIdx ? 'done' : i === stepIdx ? 'now' : ''}`
  }, i === stepIdx ? /*#__PURE__*/React.createElement("span", {
    style: {
      '--p': '45%'
    }
  }) : null))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-step-num"
  }, "Step ", stepIdx + 1, " of ", MFC_STEPS.length), /*#__PURE__*/React.createElement("div", {
    className: "mfc-step-title"
  }, MFC_STEPS[stepIdx].title), /*#__PURE__*/React.createElement("div", {
    className: "mfc-step-detail"
  }, MFC_STEPS[stepIdx].detail), /*#__PURE__*/React.createElement("div", {
    className: "mfc-timer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-timer-clock"
  }, "04:13"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mfc-timer-meta"
  }, "Step timer"), /*#__PURE__*/React.createElement("div", {
    className: "mfc-timer-sub"
  }, "running \xB7 until quinoa absorbs")), /*#__PURE__*/React.createElement("div", {
    className: "mfc-timer-ctrl"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mfc-ctrl",
    "aria-label": "Previous",
    onClick: () => setStep(Math.max(0, stepIdx - 1))
  }, "\u2039"), /*#__PURE__*/React.createElement("button", {
    className: "mfc-ctrl",
    "aria-label": "Next",
    onClick: () => setStep(Math.min(MFC_STEPS.length - 1, stepIdx + 1))
  }, "\u203A"))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-tabs"
  }, MFC_STEPS.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    className: `mfc-tab ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`,
    onClick: () => setStep(i)
  }, i < stepIdx ? '✓' : '', " ", s.title)))), /*#__PURE__*/React.createElement("div", {
    className: "mfc-ingredients"
  }, /*#__PURE__*/React.createElement("h4", null, "What you'll need"), /*#__PURE__*/React.createElement("div", {
    className: "mfc-ing-list"
  }, MFC_INGREDIENTS.map((i, n) => /*#__PURE__*/React.createElement("div", {
    key: n,
    className: `mfc-ing ${i.checked ? 'checked' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "mfc-ing-check"
  }, i.checked ? '✓' : ''), /*#__PURE__*/React.createElement("span", null, i.name), /*#__PURE__*/React.createElement("span", {
    className: "mfc-ing-amt"
  }, i.amt)))))))), /*#__PURE__*/React.createElement("section", {
    className: "mfc-cta-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mfc-cta"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mfc-cta-h"
  }, "Stop counting. Start ", /*#__PURE__*/React.createElement("em", null, "craving smarter"), "."), /*#__PURE__*/React.createElement("p", {
    className: "mfc-cta-sub"
  }, "Five minutes of setup. A meal plan that knows your body. Cooking instructions that don't assume you went to culinary school."), /*#__PURE__*/React.createElement("div", {
    className: "mfc-cta-row"
  }, /*#__PURE__*/React.createElement("input", {
    className: "mfc-cta-input",
    placeholder: "your email"
  }), /*#__PURE__*/React.createElement("button", {
    className: "mfc-btn-orange",
    onClick: () => window.open('https://myfoodcraving.com/', '_blank')
  }, "Open MyFoodCraving \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "mfc-fineprint"
  }, "Diet & nutrition is powered by our partner \xB7 MyFoodCraving \xB7 separate sign-up \xB7 syncs back to your EMD records")))));
}
window.DietView = DietView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/DietView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/DoctorBookingCard.jsx
try { (() => {
// DoctorBookingCard.jsx — appointment booking panel for Doctor hero visual
function DoctorBookingCard() {
  const slots = ['11:30 AM', '2:15 PM', '4:45 PM'];
  const selected = 1;
  return /*#__PURE__*/React.createElement("div", {
    className: "emd-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-panel-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-panel-avatar"
  }, "DR"), /*#__PURE__*/React.createElement("div", {
    className: "emd-panel-meta grow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "Dr. Rina Desai"), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, "Internal Medicine \xB7 12 yrs experience")), /*#__PURE__*/React.createElement("span", {
    className: "emd-panel-chip online"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-circle-fill"
  }), " Online")), /*#__PURE__*/React.createElement("div", {
    className: "emd-panel-eyebrow"
  }, "Today \xB7 3 slots"), /*#__PURE__*/React.createElement("div", {
    className: "emd-slots"
  }, slots.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: `emd-slot ${i === selected ? 'is-selected' : ''}`
  }, t))), /*#__PURE__*/React.createElement("button", {
    className: "emd-btn primary emd-panel-cta"
  }, "Book 2:15 PM ", /*#__PURE__*/React.createElement("i", {
    className: "bi bi-arrow-right-circle"
  })));
}
window.DoctorBookingCard = DoctorBookingCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/DoctorBookingCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/EhrActivityCard.jsx
try { (() => {
// EhrActivityCard.jsx — recent activity panel for EHR hero visual
function EhrActivityCard() {
  const rows = [{
    icon: 'bi-droplet-fill',
    title: 'Lab results · Lipid panel',
    sub: '2 hours ago',
    tone: 'blue'
  }, {
    icon: 'bi-capsule',
    title: 'Prescription refilled',
    sub: 'Yesterday',
    tone: 'green'
  }, {
    icon: 'bi-clipboard2-pulse-fill',
    title: 'Consult notes added',
    sub: '3 days ago',
    tone: 'purple'
  }, {
    icon: 'bi-heart-pulse',
    title: 'BP reading · 118/76',
    sub: 'Last week',
    tone: 'red'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "emd-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-panel-eyebrow"
  }, "Recent activity"), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `emd-panel-row ${i < rows.length - 1 ? 'has-divider' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `emd-panel-ico tone-${r.tone}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi ${r.icon}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "emd-panel-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, r.title), /*#__PURE__*/React.createElement("div", {
    className: "s"
  }, r.sub)))));
}
window.EhrActivityCard = EhrActivityCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/EhrActivityCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/EmergencyFAB.jsx
try { (() => {
// EmergencyFAB.jsx — the always-visible floating Emergency button
function EmergencyFAB({
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "emd-fab",
    onClick: onClick,
    "aria-label": "Emergency SOS"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-exclamation-triangle-fill"
  }), /*#__PURE__*/React.createElement("span", null, "Emergency"));
}
window.EmergencyFAB = EmergencyFAB;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/EmergencyFAB.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/FeatureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// FeatureCard.jsx + FeatureGrid.jsx — Thiings illustration pattern, theme-aware tone classes
function FeatureCard({
  tone = 'red',
  slotId,
  slotPlaceholder,
  surfaceTag,
  title,
  description,
  benefits = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `emd-fcard tone-${tone}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "illo"
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: slotId,
    placeholder: slotPlaceholder
  })), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, surfaceTag ? /*#__PURE__*/React.createElement("div", {
    className: "surface-tag"
  }, surfaceTag) : null, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, description), benefits.length ? /*#__PURE__*/React.createElement("ul", null, benefits.map((b, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-check-circle-fill"
  }), " ", b))) : null));
}
function FeatureGrid({
  features
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "emd-fgrid"
  }, features.map((f, i) => /*#__PURE__*/React.createElement(FeatureCard, _extends({
    key: f.slotId || i
  }, f))));
}
window.FeatureCard = FeatureCard;
window.FeatureGrid = FeatureGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/Footer.jsx
try { (() => {
// Footer.jsx — copyright + legal links
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "emd-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-footer-inner"
  }, /*#__PURE__*/React.createElement("p", null, "\xA9 ", new Date().getFullYear(), " Ease My Disease. All rights reserved."), /*#__PURE__*/React.createElement("nav", {
    className: "emd-footer-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms of Service"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "HIPAA Notice"))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/Header.jsx
try { (() => {
// Header.jsx — sticky navbar with logo, nav, theme/language toggles, auth buttons
const {
  useState
} = React;
function Header({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  lang,
  onToggleLang
}) {
  const navItems = [{
    id: 'sos',
    label: 'SOS Emergency',
    icon: 'bi-heart-pulse-fill'
  }, {
    id: 'ehr',
    label: 'Health Records',
    icon: 'bi-file-medical-fill'
  }, {
    id: 'doctor',
    label: 'Consult Doctor',
    icon: 'bi-chat-dots-fill'
  }, {
    id: 'diet',
    label: 'Diet & Nutrition',
    icon: 'bi-apple'
  }];
  return /*#__PURE__*/React.createElement("header", {
    className: "emd-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-header-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "emd-brand",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate('sos');
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "emd-brand-mark"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/logo-256.png",
    alt: "EaseMyDisease"
  })), /*#__PURE__*/React.createElement("span", {
    className: "emd-brand-word"
  }, "EaseMyDisease")), /*#__PURE__*/React.createElement("nav", {
    className: "emd-nav",
    role: "navigation",
    "aria-label": "Main"
  }, navItems.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    className: currentView === it.id ? 'active' : '',
    onClick: () => onNavigate(it.id),
    "aria-current": currentView === it.id ? 'page' : undefined
  }, it.label))), /*#__PURE__*/React.createElement("div", {
    className: "emd-header-controls"
  }, /*#__PURE__*/React.createElement("button", {
    className: "emd-toggle",
    onClick: onToggleTheme,
    "aria-label": "Toggle theme",
    title: "Toggle theme"
  }, /*#__PURE__*/React.createElement("i", {
    className: theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill',
    style: {
      color: theme === 'dark' ? '#60a5fa' : '#f59e0b'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "emd-lang",
    onClick: onToggleLang,
    "aria-label": "Language"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-translate"
  }), /*#__PURE__*/React.createElement("span", null, lang)), /*#__PURE__*/React.createElement("button", {
    className: "emd-auth-btn login",
    onClick: () => alert('(prototype) Sign in flow')
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-box-arrow-in-right"
  }), /*#__PURE__*/React.createElement("span", null, "Sign In")), /*#__PURE__*/React.createElement("button", {
    className: "emd-auth-btn signup",
    onClick: () => alert('(prototype) Sign up flow')
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-person-plus"
  }), /*#__PURE__*/React.createElement("span", null, "Sign Up")))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/Hero.jsx
try { (() => {
// Hero.jsx — two-column hero with headline, badge, stats, CTAs, phone visual
function Hero({
  trust,
  headline,
  headlineAccent,
  subtitle,
  stats,
  primaryCta,
  secondaryCta,
  visual
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "emd-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-hero-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "emd-hero-inner"
  }, /*#__PURE__*/React.createElement("div", null, trust ? /*#__PURE__*/React.createElement(TrustBadge, null, trust) : null, /*#__PURE__*/React.createElement("h1", null, headline, headlineAccent ? /*#__PURE__*/React.createElement("span", {
    className: "emd-hero-accent"
  }, headlineAccent) : null), /*#__PURE__*/React.createElement("p", {
    className: "emd-hero-subtitle"
  }, subtitle), stats ? /*#__PURE__*/React.createElement(StatCluster, {
    stats: stats
  }) : null, /*#__PURE__*/React.createElement("div", {
    className: "emd-btn-row"
  }, primaryCta ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconRight: "bi-arrow-right-circle",
    onClick: primaryCta.onClick
  }, primaryCta.label) : null, secondaryCta ? /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "bi-play-circle",
    onClick: secondaryCta.onClick
  }, secondaryCta.label) : null)), /*#__PURE__*/React.createElement("div", null, visual)));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/PhoneMockup.jsx
try { (() => {
// PhoneMockup.jsx — the iOS-style phone with the SOS interface. Hero visual.
function PhoneMockup({
  time = '11:45',
  appTitle = 'Emergency SOS',
  appSubtitle = 'Location: Downtown Medical Center'
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "emd-phone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-screen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-status"
  }, /*#__PURE__*/React.createElement("span", null, time), /*#__PURE__*/React.createElement("span", {
    className: "icons"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-reception-4"
  }), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-wifi"
  }), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-battery-full"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-head"
  }, /*#__PURE__*/React.createElement("h3", null, appTitle), /*#__PURE__*/React.createElement("p", null, appSubtitle)), /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-status-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ico"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-shield-check"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "t"
  }, "Emergency Ready"), /*#__PURE__*/React.createElement("p", {
    className: "s"
  }, "GPS Active \xB7 Contacts Set"))), /*#__PURE__*/React.createElement("div", {
    className: "emd-sos-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-sos-ring"
  }), /*#__PURE__*/React.createElement("div", {
    className: "emd-sos-ring delay"
  }), /*#__PURE__*/React.createElement("button", {
    className: "emd-sos",
    "aria-label": "SOS"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-telephone-fill"
  }), /*#__PURE__*/React.createElement("span", null, "SOS"))), /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-feats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-feat"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-geo-alt-fill"
  }), " Auto Location Sharing"), /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-feat"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-people-fill"
  }), " Instant Contact Alerts"), /*#__PURE__*/React.createElement("div", {
    className: "emd-phone-feat"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-headset"
  }), " 24/7 Emergency Line")))));
}
window.PhoneMockup = PhoneMockup;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/PhoneMockup.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/StatCluster.jsx
try { (() => {
// StatCluster.jsx — three-stat strip
function StatCluster({
  stats
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "emd-stats"
  }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "emd-stat",
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-stat-num"
  }, s.value), /*#__PURE__*/React.createElement("div", {
    className: "emd-stat-lab"
  }, s.label))));
}
window.StatCluster = StatCluster;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/StatCluster.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/Testimonials.jsx
try { (() => {
// Testimonials.jsx — tone-aware testimonial strip
function Testimonials({
  heading = 'Trusted by Healthcare Experts',
  subheading,
  items = [],
  tone = 'red'
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "emd-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "emd-section-head"
  }, /*#__PURE__*/React.createElement("h2", null, heading), subheading ? /*#__PURE__*/React.createElement("p", null, subheading) : null), /*#__PURE__*/React.createElement("div", {
    className: "emd-fgrid"
  }, items.map((t, i) => /*#__PURE__*/React.createElement("div", {
    className: `emd-tcard tone-${tone}`,
    key: i
  }, /*#__PURE__*/React.createElement("p", {
    className: "emd-tquote"
  }, "\"", t.quote, "\""), /*#__PURE__*/React.createElement("div", {
    className: "emd-tauthor"
  }, /*#__PURE__*/React.createElement("div", {
    className: `emd-tavatar tone-${tone}`
  }, t.initial), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, t.name), /*#__PURE__*/React.createElement("p", null, t.role)))))));
}
window.Testimonials = Testimonials;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/Testimonials.jsx", error: String((e && e.message) || e) }); }

// ui_kits/emd_web/TrustBadge.jsx
try { (() => {
// TrustBadge.jsx — pill at the top of the hero
function TrustBadge({
  icon = 'bi-shield-check',
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "emd-trust"
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi ${icon}`
  }), /*#__PURE__*/React.createElement("span", null, children));
}
window.TrustBadge = TrustBadge;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/emd_web/TrustBadge.jsx", error: String((e && e.message) || e) }); }

})();
