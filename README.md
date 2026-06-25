# EaseMyDisease — App Landing Page

A mobile-first marketing landing page for **EaseMyDisease** — a calm health app that
brings one-touch **emergency SOS**, an **end-to-end encrypted health vault**, an
**interactive body map**, **doctors on call** and **medication tracking** into one
place. HIPAA-compliant, built for the whole family.

The page is built directly on the **EaseMyDisease design system** (red-primary brand,
Plus Jakarta Sans + Inter, warm dark mode) and recreates the actual app screens as
faithful in-phone mockups — using the same component primitives and tokens as the
product itself, so the marketing site and the app look and feel like one thing.

## What the page covers

Every core flow is explained to an end user with a real mockup of that screen:

| Section | Flow / screens shown |
|---|---|
| **Hero** | Home dashboard + live SOS dispatch |
| **Dashboard** | Health score (82/100) with Heart · Move · Glucose rings, quick actions, today's meds & meal plan |
| **SOS Emergency** | Hold-to-dispatch button → "Help is on the way" with live ETA, responder & auto-shared medical data |
| **Body Map** | Tap-an-organ anatomy view with function & fitness scores and linked records |
| **Health Vault** | 247 encrypted records, categories, and OCR scan-to-vault auto-filing |
| **Doctors on call** | Doctor profile, fees, and an in-call video consult with live translation |
| **Medications** | 7-day adherence, refill alerts, and the diet/nutrition hand-off |
| **Family · Profile · Insurance** | Medical ID card, family vaults, digital insurance card |
| **Security** | End-to-end encryption, biometric lock, time-boxed sharing, FHIR/PDF export |
| **Every screen** | A swipe gallery: device verification (OTP), lab results, booking, chat, notifications, secure sharing |
| **How it works · Comparison · Testimonials · Pricing · FAQ · Download** | Supporting marketing flow |

Plus a light/dark theme toggle, responsive layout, scroll-reveal animations, and
accessible nav (skip link, keyboard-dismissable drawer).

## Repository layout

```
site/            The landing page (the deliverable)
  index.html       Full single-page site
  styles.css       Design tokens + in-phone mobile-kit primitives + marketing layout
  main.js          Theme toggle, drawer, scroll reveal, header & back-to-top
  assets/logos/    EaseMyDisease brand logos
design/          The exported EaseMyDisease design system (tokens, components, UI kits)
mockup/          The high-fidelity app prototype (per-feature screens + screenshots)
.github/workflows/deploy-pages.yml   Publishes site/ to GitHub Pages on push to main
```

`design/` and `mockup/` are the source-of-truth handoffs the landing page is built
from; the live site lives entirely in `site/`.

## Tech

Zero-dependency static site — plain **HTML + CSS + vanilla JS**.
Icons via [Bootstrap Icons](https://icons.getbootstrap.com/) (CDN); fonts via Google
Fonts (Plus Jakarta Sans, Inter, Outfit). With the network blocked, the layout still
renders and falls back to system fonts.

## Run locally

```bash
cd site
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

`/.github/workflows/deploy-pages.yml` publishes `site/` to **GitHub Pages** on every
push to `main`. Enable it once under **Settings → Pages → Build and deployment →
Source: "GitHub Actions"**.

## Note

This landing page is a product demonstration. The phone mockups recreate the
EaseMyDisease design system in HTML/CSS; they are not the shipping application.
EaseMyDisease does not provide medical advice — in an emergency, call your local
emergency number.
