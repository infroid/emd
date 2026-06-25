# EaseMyDisease — Design System

> _"Ease everything for the user having any disease."_

This folder packages the visual, content, and interaction vocabulary of
**EaseMyDisease (EMD)** — a healthcare web application covering emergency
services, electronic health records (EHR), and medical consultations.

Use this design system whenever you're designing, mocking, or building
something that should look and feel like EMD: marketing pages, in-product
screens, slides, throwaway prototypes, anything in between.

---

## 1. About the product

**EaseMyDisease** is a Django + Bootstrap 5 healthcare platform with four
top-level surfaces, mapped one-to-one to the four nav items:

| Surface           | What it does                                                |
| ----------------- | ----------------------------------------------------------- |
| **SOS Emergency** | GPS-enabled emergency assistance; one-tap dispatch.         |
| **Health Records**| Secure electronic health record (EHR) management.           |
| **Consult Doctor**| Appointment scheduling + telemedicine consultations.        |
| **Diet & Nutrition** | Hand-off entry to the partner app **MyFoodCraving (MFC)**. |

The product is built as a PWA — installable, offline-capable, supports
EN / ES / HI, has a hard dependency on dark mode parity, and ships
a sticky "Emergency" CTA on every page.

> **Out of scope for this design system:** MyFoodCraving (mfc) is a
> _partner_ application and has its own brand. Treat any nutrition
> content here as a hand-off surface, not as a destination.

### Sources used

- **Codebase:** [github.com/infroid/emd](https://github.com/infroid/emd) (private; default branch `master`)
  - `static/css/unified-design.css` — canonical design tokens
  - `static/css/guest.css` — marketing/landing visual language
  - `static/css/main.css` — Bootstrap-layered brand overrides
  - `templates/base.html`, `templates/_partials/header.html`, `templates/_partials/footer.html` — chrome
  - `templates/index/sos_guest.html` (and `*_guest.html` siblings) — full feature pages
  - `static/images/logos/logo.svg` — the EMD mark
  - `static/manifest.json` — PWA identity (theme color `#e74c3c`, name "Ease My Disease")
- **Partner repo (not used here):** [github.com/infroid/mfc](https://github.com/infroid/mfc)
- Pulling the latest? `infroid/emd` is private — you'll need access to the
  org. The files mirrored under `static/` and `templates/` in this project
  are pinned snapshots from commit `7294a11`.

---

## 2. Content fundamentals

### Voice — "calm urgency"

EMD's copy is **stat-led, reassuring, and second-person**. It's a healthcare
product, so it never sounds chirpy — but it's also a consumer product, so it
never reads as clinical or insurance-bureaucracy. The tone lives in the band
between "your hospital" and "your favorite consumer app."

| Trait        | How EMD does it                                                 |
| ------------ | --------------------------------------------------------------- |
| Person       | **Second person**: "Your location", "your contacts", "your family." |
| Casing       | **Sentence case** in body. **Title Case** in nav, buttons, badges. |
| Sentence len | Short. Two clauses max. Lead with the verb or the stat.         |
| Numerals     | Always digits — "5 min", "400+", "24/7", "60 seconds", "<5 min." Conveys precision. |
| Punctuation  | Em-dashes for asides ("anytime, anywhere — for the fastest care"). Sparingly. No exclamation marks. |
| Trust framing| Lead with a "trusted by X" or "X lives saved" badge before the H1. |
| CTA verbs    | **Imperative**: "Get Protected Now", "Start Free Trial", "See How It Works." Never "Click here." |

### Headline pattern

> Pattern: `[outcome], [breakdown of how]`

- "Medical Help, Instantly · Just One Tap Away"
- "Protection in 60 Seconds"
- "Trusted by 50,000+ families"

The second half of the headline always renders in the brand red
(`--accent-text`) on a separate line, accented to **800 weight**.

### Emoji usage

- **In product UI: no.** Bootstrap Icons cover everything.
- **In language switcher: yes** — country flags (🇺🇸 🇮🇳 🇪🇸).
- **In repo docs / READMEs: yes, sparingly** — 🏥 for the brand, 🚨 SOS,
  📋 records, 👨‍⚕️ doctor, 🥗 diet. **Don't** carry these into pixels.

### Worked examples (lifted verbatim from production)

- _Hero subtitle, SOS:_ "Connect to certified emergency responders in
  seconds. Your location and critical info are shared automatically for the
  fastest, safest care — anytime, anywhere."
- _Feature card title:_ "Medical-Grade Security"
- _Trust strip:_ "HIPAA Compliant · ISO 27001 Certified · Always On: 24/7 Response"
- _Stat card:_ `<5 min` / "Avg. Response"
- _Footer tag:_ "Empowering your health journey with comprehensive digital
  healthcare solutions."

---

## 3. Visual foundations

### Color

EMD is a **red-on-near-white** brand. The red is the emergency / CTA color
and is used assertively but not gratuitously: full-bleed only on the final
CTA section and the SOS button itself. Everywhere else, red appears as
**accent on neutral** — a 1px outline, a 10% tint on a trust badge,
a hover-state border.

- **Primary:** `#dc2626` (`--accent`, hero CTA + SOS button)
- **Primary hover:** `#b91c1c`
- **Primary text (WCAG-AA on white):** `#991b1b` (`--accent-text`)
- **Coral gradient (legacy `main.css`):** `linear-gradient(135deg, #ff3b3b, #ff6b6b)`
  — used for the emergency floating button and signup CTA only.
- **Neutrals:** a 10-stop gray scale `--emd-gray-50…900`.
- **Status:** green `#16a34a` (success/diet), amber `#f59e0b` (warning),
  blue `#3b82f6` (info/EHR). Each of the four feature areas gets a soft
  accent: SOS=red, EHR=blue, Doctor=purple `#7c3aed`, Diet=green.

> **The logo is teal.** Yes — the EMD mark itself uses cyan/teal (#6dd3cf
> → #2bbbbd) on a white cross. This is an intentional visual contrast: the
> brand says "calm" with its mark and "urgent" with its UI. **Don't** pull
> teal into product surfaces; let the logo carry it alone.

### Type

- **Display + headings:** `Plus Jakarta Sans` — 600/700/800. Tight tracking
  (`-0.025em`). Used for H1–H4, hero, stat numbers.
- **Body + UI:** `Inter` — 400/500/600. The workhorse.
- **Marketing body (legacy):** `Outfit` — 400/500. Used in `main.css` for
  Bootstrap-rendered marketing copy. Inter is the going-forward default.
- **No mono on the surface** — but a `--font-mono` token exists for code blocks.
- Type is **fluid** via `clamp()`: every heading scales smoothly from
  mobile to desktop. See `colors_and_type.css` for the full scale.

### Spacing & layout

- **4-pt grid** (`--space-1` = 4px through `--space-20` = 80px).
- Container: 1200px max-width, 24px gutter on desktop, 16px on tablet, 12px on phone.
- Section vertical rhythm: `--space-16` (64px) between major sections;
  `--space-8` between sub-blocks; `--space-4` between cards in a grid.
- Grids: `repeat(auto-fit, minmax(120px, 1fr))` for stat strips,
  `repeat(3, 1fr)` for feature cards, collapsing to 1 column at <768px.

### Radii

EMD is **softly rounded** — never circular, never square.

- `8px` for inputs and dense controls
- `12px` for default buttons and primary CTAs (`--radius-lg`, the most common value)
- `16px` for toasts
- **`24px` for card surfaces** — this is the signature value; cards feel
  pillowy. Used on `.card`, `.guest-feature-card`, `.stat-card`.
- `9999px` (full pill) for trust badges, theme/language toggles,
  avatar surrounds, and the profile dropdown button.

### Shadows & elevation

A 5-step shadow scale, all neutral (`rgb(0 0 0 / 0.05…0.25)`). Plus two
brand-tinted shadows for the SOS surface:

```
--shadow-sm  → hairline lift (inputs, chips)
--shadow-md  → resting card
--shadow-lg  → hovered card
--shadow-xl  → modal / dropdown
--shadow-2xl → hero stage

--shadow-emergency:        0 4px 20px rgba(255,59,59,.25)   /* SOS at rest */
--shadow-emergency-hover:  0 6px 25px rgba(255,59,59,.35)   /* SOS hover */
```

### Backgrounds

- **Hero backgrounds** are subtle: a soft gradient
  (`linear-gradient(135deg, var(--bg-2) 0%, var(--bg-1) 100%)`) layered
  with three faint **radial color blobs** at 5% opacity — red top-left,
  blue top-right, green bottom-center. Adds depth without being loud.
- **CTA section** is the one place red goes full-bleed —
  `background: var(--accent)` with white type on top.
- **Auth pages** layer the dot pattern (`assets/patterns/auth-bg-pattern.svg`)
  at 10% opacity over the gradient header.
- **No** stock photography in the codebase. **No** illustrations. Imagery is
  carried by the device mockup component and Bootstrap icons. If you need a
  hero image, use the device mockup pattern (`mobile-mockup.css`).

### Borders

- 1px hairline at `--border-1` (#e5e7eb light, #374151 dark) is the default.
- 2px on inputs and the theme/language toggles (signals tappability).
- Cards: 1px hairline + soft shadow. On hover the **border shifts to the
  brand red** in addition to the shadow growing — this is a signature move.

### Hover / press / focus

- **Hover:** lift + shadow + color hint. Specifically:
  `transform: translateY(-1px to -4px)`, shadow steps up one tier,
  border-color → `--accent`. Cards lift `-4px`, feature cards lift `-8px`.
- **Press:** `transform: scale(0.98)` on touch devices, or simply
  `translateY(0)` to neutralize hover lift on click.
- **Focus:** 2px solid `--accent` ring with 2px offset, plus a soft
  `0 0 0 4px rgba(220,38,38,.10)` halo. Visible on keyboard nav only
  (`:focus-visible`).

### Animation

- Default easing: `ease` / `ease-in-out`. Marketing card hover uses
  `cubic-bezier(0.4, 0, 0.2, 1)` for a slightly snappier feel.
- Default duration: `0.15s` (controls), `0.3s` (cards), `0.4s` (phone mockup).
- The SOS button has a **two-ring radial pulse** at 2s + 2s-delayed
  intervals — the brand's only signature loop animation.
- Toasts slide in from the right (`transform: translateX(100%) → 0`, 0.3s).
- Respect `prefers-reduced-motion`: all animations short-circuit to `0.01ms`.

### Transparency & blur

- Trust badges: 10% red tint with a 20% red border.
- Hover states: lift to a 5–10% tint of the neutral or accent.
- `backdrop-filter: blur(10px)` on the profile dropdown menu and language
  picker — adds depth when surfaces overlap.
- **No glassmorphism** in product surfaces — that's a marketing-page-only effect.

### Cards (the canonical pattern)

```
background:   #fff
border:       1px solid #e5e7eb
border-radius: 24px (--radius-2xl)
padding:      32px (--space-8)
shadow:       --shadow-sm at rest, --shadow-md on hover
hover:        translateY(-4px), border-color → --accent
```

### Layout rules

- One fixed element: the **floating "Emergency" button** anchored
  `bottom-right` of every page (red gradient, 16px from edges, `z-index: 9998`).
- Sticky top: the **navbar** (`sticky-top`, 1px bottom border).
- Skip-link: top-left, visually hidden until focused (accessibility).

---

## 4. Iconography & illustration

### Bootstrap Icons (UI iconography)

EMD uses **Bootstrap Icons 1.11.3** for in-product iconography, loaded from CDN
(`cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css`).
They're font-icons, classed `bi bi-<name>`. Use these for nav items, status
indicators, inline arrows, form affordances — anything small and structural.

### Thiings (illustration system)

For richer surfaces — hero, feature cards, empty states, onboarding — EMD
layers in **Thiings**, the open AI-generated 3D icon collection at
[thiings.co/things](https://www.thiings.co/things). These are warm, clay-like,
slightly playful 3D objects — the perfect counter to the brand's sober
editorial type. The contrast (clean Plus Jakarta Sans + soft 3D objects) is
what makes EMD feel _different_ from generic healthcare UIs.

**Rules**
- **One per card.** Never decorative; the illustration should anchor the message.
- **Center, on a soft tinted background.** Use the surface accent at 10% as the wash, with a radial highlight in the top-right.
- **Drop on a slot, never inline.** Use `<image-slot>` (`assets/image-slot.js`) so the asset persists and is easy to swap.
- **License:** free for personal + commercial use. No credit required.

Suggested matches per surface: _pill / heart / alarm_ for SOS; _folder /
file / shield_ for EHR; _stethoscope / doctor / clipboard_ for Doctor; _apple
/ leaf_ for the Diet hand-off.

### Patterns

- **Filled variants** (`-fill` suffix) inside circular tinted backgrounds
  for feature cards: `bi-lightning-charge-fill`, `bi-shield-fill-check`,
  `bi-heart-pulse-fill`.
- **Outlined variants** for inline UI: `bi-arrow-right-circle`,
  `bi-shield-check`, `bi-clock`, `bi-people`.
- **Color**: inherits `currentColor` by default; tinted to `--accent` inside
  feature-icon circles (which lift the icon to white on hover).

### The four nav icons

| Surface         | Icon                       |
| --------------- | -------------------------- |
| SOS Emergency   | `bi-heart-pulse-fill`      |
| Health Records  | `bi-file-medical-fill`     |
| Consult Doctor  | `bi-chat-dots-fill`        |
| Diet & Nutrition| `bi-apple`                 |

### Emoji & unicode

- Used **only** in the language switcher for flags (`🇺🇸 🇮🇳 🇪🇸`).
- No other unicode glyphs as icons anywhere in product UI.

### Assets in this folder

- `assets/logos/logo-primary.png` — **the brand mark**: a Thiings-style 3D illustration of a caregiver supporting an older person in a wheelchair. 1024²1024, transparent background. The canonical source.
- `assets/logos/logo-512.png`, `logo-256.png`, `logo-128.png` — pre-downsized for web. Use the smallest that's sharp at the rendered size.
- `assets/logos/logo-square-light.png` — illustration on a cream squircle. iOS-style app icon, light surfaces.
- `assets/logos/logo-square-dark.png` — illustration on warm brown-black squircle. Dark-mode app icon, dark surfaces.
- `assets/logos/logo-circle-light.png` — illustration in a cream circle. Avatars, favicons, badge contexts on light backgrounds.
- `assets/logos/logo-circle-dark.png` — illustration in a warm dark circle. Avatars on dark backgrounds.
- `assets/logos/logo.svg` — **legacy production mark** (teal cross + “EMD” text, 340 KB auto-traced). Kept for reference only.
- `assets/logos/favicon.svg` — same as legacy logo, used as favicon in production.
- `assets/patterns/auth-bg-pattern.svg` — repeating dots for auth headers.
- `assets/logos/logo.svg` — **legacy production mark** (teal cross + “EMD” text, 340 KB auto-traced). Kept for reference; prefer `logo-v2`.
- `assets/logos/favicon.svg` — same as legacy logo, used as favicon in production.
- `assets/patterns/auth-bg-pattern.svg` — repeating dots for auth headers.
- `assets/patterns/pattern.svg` — alternate dot pattern.

> **Substitution note:** the production logo is the only brand asset that
> ships in the codebase. There are no marketing illustrations, no stock
> photography, no avatar set. If you need any of those, request real assets
> or use placeholders (greyboxes, initials in pill avatars).

---

## 5. Index — what's in this folder

```
.
├── README.md               ← you are here
├── SKILL.md                ← Claude Code-compatible skill metadata
├── colors_and_type.css     ← canonical design tokens + base type
├── assets/
│   ├── logos/              ← EMD mark (SVG + PNG fallback + favicon)
│   └── patterns/           ← auth dot pattern + index dot pattern
├── preview/                ← Design System review cards (one per token group)
├── ui_kits/
│   └── emd_web/            ← EMD web app UI kit (React, single page)
│       ├── index.html
│       └── *.jsx
└── static/, templates/     ← pinned snapshots from infroid/emd
                              (canonical source of truth — read these
                              if you need to verify any token or class)
```

To get oriented quickly: open `preview/index-color-primary.html` and
`ui_kits/emd_web/index.html` side-by-side.

---

## 6. Caveats & known gaps

- **Logo redesign.** The production logo (`assets/logos/logo.svg`) is a
  340KB auto-traced teal mark that contradicted the red UI. **This system
  ships the brand mark as a Thiings-style illustration** — a caregiver
  helping an older person in a wheelchair — unifying the brand mark and the
  illustration system into a single visual identity. Use `logo-primary.png`
  as the canonical source; render-ready variants for light/dark and
  square/circle ship pre-composited in `assets/logos/`.
- **Outfit font** is loaded but not actively used in the going-forward
  unified design — kept because `main.css` (legacy Bootstrap layer) still
  references it. Treat `Inter` as the source of truth.
- **No marketing illustrations exist** — all visual interest is carried by
  the device mockup, Bootstrap icons, and the radial color blobs in the hero.
- **PWA theme color (`#e74c3c`) differs slightly** from the design-token red
  (`#dc2626`). The manifest value is older and not updated; UI should use
  the token.
