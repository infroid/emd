# EaseMyDisease — App Landing Page

A mobile-first marketing landing page for **EaseMyDisease**, a calm health app that
brings one-touch **emergency SOS**, an **end-to-end encrypted health vault**, an
**interactive body map**, **doctors on call**, and **medication management** into one
place — built for the whole family and HIPAA-compliant.

The page walks an end user through every core flow of the app using detailed,
hand-built phone mockups (pure HTML/CSS — no images of screens required):

| Section | Flow it explains |
|---|---|
| **Onboarding** | Getting set up in a few taps |
| **SOS** | One-press emergency dispatch, live location, responder ETA |
| **Body Map** | Tap any organ to see its latest labs, vitals & fitness score |
| **Vault** | Encrypted records, OCR scan-to-vault, secure time-limited sharing |
| **Doctors** | Book appointments and consult over secure chat/video |
| **Meds** | Reminders, refills and adherence tracking |
| **Family** | Manage profiles and care for dependents |
| **Security** | End-to-end encryption, HIPAA compliance |
| **Every screen** | A gallery covering the remaining app screens |

## Tech

Zero-dependency static site — plain **HTML + CSS + vanilla JS**.

- `site/index.html` — the full single-page landing page
- `site/styles.css` — design system, responsive layout, light/dark themes
- `site/main.js` — theme toggle, mobile drawer, scroll-reveal (with no-JS/older-browser fallbacks)
- `site/assets/` — brand logos
- Icons via [Bootstrap Icons](https://icons.getbootstrap.com/) (CDN) and fonts via Google Fonts (CDN)

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

## Notes

- The page loads Bootstrap Icons and Google Fonts from CDNs; with the network blocked
  the layout still renders, falling back to system fonts.
- `assets/logo-circle-*.png` and `assets/logo-primary.png` are additional brand
  variants kept for future use (favicons, social/OG images); the live page currently
  references `logo-128.png` and `logo-256.png`.
