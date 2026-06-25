# EaseMyDisease — Web app UI kit

A React recreation of the EMD marketing + landing surface. Components are
small, prop-driven, and reusable; they're cosmetic, not production logic.

## How to run

Open `index.html`. Everything is inline-loaded React 18 + Babel from CDN.

## Components

| File                  | What it is |
| --------------------- | --------- |
| `App.jsx`             | Top-level shell with view switcher between SOS / EHR / Doctor / Diet |
| `Header.jsx`          | Sticky navbar with logo, nav, theme toggle, language, auth buttons |
| `Footer.jsx`          | Bottom band with copyright + legal links |
| `EmergencyFAB.jsx`    | The signature floating "Emergency" button (bottom-right, always on) |
| `Button.jsx`          | `<Button variant="primary|secondary|outline|emergency">` |
| `TrustBadge.jsx`      | Pill badge with icon + count ("Trusted by 50,000+ families") |
| `StatCluster.jsx`     | The three-stat strip under every hero |
| `FeatureCard.jsx`     | Card with icon-in-tinted-circle, title, description, benefit list |
| `FeatureGrid.jsx`     | Responsive 3-column grid of feature cards |
| `PhoneMockup.jsx`     | iOS-style phone frame with SOS interface (the hero visual) |
| `Hero.jsx`            | Headline + subtitle + stats + CTAs + phone mockup, two-column |
| `CTASection.jsx`      | Full-bleed red "Protection in 60 Seconds" section |
| `Testimonials.jsx`    | 3-card testimonial strip |

## What's recreated vs. what's omitted

**Recreated** (pixel-close to production):
- Landing page for the SOS surface — header, hero, features, CTA, footer
- Lightweight versions of the EHR, Doctor, Diet surfaces (header + hero + feature grid only)
- Light/dark theme toggle (uses `data-bs-theme` on `<html>`)

**Omitted** (not present in source or out of scope):
- Authenticated dashboards (only `_guest.html` templates were polished)
- Form submission / actual auth flow
- Map view for SOS dispatch
- Doctor calendar / scheduling
- Diet recipe browser (handed off to MFC anyway)
