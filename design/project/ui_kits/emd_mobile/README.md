# EaseMyDisease — Mobile / Responsive UI kit

A React recreation of EMD's mobile / PWA surface, sister to `ui_kits/emd_web/`.
Same tokens (`../../colors_and_type.css`), same brand voice, sized for thumbs.

## How to run

Open `index.html`. Everything is inline-loaded React 18 + Babel from CDN.

## What's inside

| Section | What it shows |
| --- | --- |
| **01 · Surfaces** | Home screens of the four product tabs — SOS, Records, Doctors, Profile. |
| **02 · Flows** | Onboarding, OTP, an active SOS dispatch, a record detail, a booking flow, an in-consult video call, and a bottom-sheet hand-off to the partner Diet app. |
| **03 · Atoms** | Mobile headers, bottom tab bar, buttons, chips, status pills, list rows, search, fields, OTP input, banners, toast, stat tiles, doctor card, the signature SOS button, FAB, icon buttons, and a bottom sheet. |
| **04 · Responsive** | Notes on the 768 / 1200 breakpoints and what swaps at each. |
| **05 · Dark** | Same screens in EMD's warm cream-on-brown dark theme. |

## Files

| File | What it is |
| --- | --- |
| `index.html` | Entry — loads React, Babel, and the four JSX modules in order. |
| `styles.css` | Mobile-specific styles. Imports `../../colors_and_type.css` for shared tokens. |
| `chrome.jsx` | `<Phone>`, `<PhoneCard>`, `<MHeader>`, `<MLargeHead>`, `<MIconBtn>`, `<TabBar>`. The shell. |
| `components.jsx` | Atomic mobile components — buttons, chips, list, search, fields, banners, toast, stat tile, doctor card, bottom sheet, FAB, big SOS button. |
| `screens.jsx` | Eleven full-screen mockups composed from the above. |
| `App.jsx` | Gallery page wiring it all together. |
| `ios-frame.jsx` | iOS 26 device frame (unused — kept for reference; EMD is a PWA, not a native app). |

## Conventions

- **Hit target floor: 48px.** All taps go through `.m-btn`, `.m-iconbtn`, `.m-list-row`, `.tab`, or `.m-chip`, each ≥ 44–48px.
- **One source of truth.** Color, type, spacing, radius, shadow tokens live in `../../colors_and_type.css`. Don't redefine.
- **Card radius is 20px on mobile, 24px on web.** Tighter on small screens to match smaller touch surfaces.
- **Dark mode is shipped, not opt-in.** Every component has a dark pairing — driven by `data-bs-theme="dark"` on a parent (and the `.dark` class on `.phone-screen` for nested phone frames).
- **SOS is always reachable.** Center-raised tab on the bottom bar, with the brand pulse ring. Never moved, never hidden.
- **No emoji in UI.** Bootstrap Icons cover everything. Flags in the language switcher are the only unicode glyphs.

## Not included

- Real maps (the SOS dispatch screen uses an SVG placeholder).
- Real video stream (the consult screen uses a tone-matched gradient).
- Auth back-end / form submission — these are pure UI mockups.
