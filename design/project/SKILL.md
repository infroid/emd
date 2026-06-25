---
name: easemydisease-design
description: Use this skill to generate well-branded interfaces and assets for EaseMyDisease (EMD), the healthcare web application for emergency services, electronic health records, and medical consultations. Contains the EMD design tokens, type system, color palette, fonts, logos, and a React UI kit recreating the marketing surface. Use for production code, throwaway prototypes, slides, or any visual artifact that needs to look and feel like EMD.
user-invocable: true
---

# EaseMyDisease — design skill

## How to use this skill

1. **Read `README.md`** first. It documents the four product surfaces (SOS, EHR, Consult Doctor, Diet hand-off), the content voice ("calm urgency"), and the full visual foundations.
2. **Look at `colors_and_type.css`** for the canonical design tokens — colors, type scale, spacing, radii, shadows. These are CSS custom properties; copy or re-use them.
3. **Look at `preview/` cards** for a visual reference of every token group (palette, type specimens, components).
4. **Read `ui_kits/emd_web/`** for a working React recreation of EMD's marketing surface — Header, Hero, FeatureCard, PhoneMockup, CTASection, Footer, EmergencyFAB. Copy components from here rather than rebuilding.
5. **Copy assets** from `assets/logos/` and `assets/patterns/` into the output — don't reference them across project boundaries.

## What you're working with

- **Brand:** EaseMyDisease (EMD). Healthcare PWA. Four surfaces: SOS Emergency, Health Records, Consult Doctor, Diet & Nutrition (the last is a hand-off to partner app MyFoodCraving — out of scope for EMD designs).
- **Primary color:** red `#dc2626` (`--accent`); accent text `#991b1b` (`--accent-text`).
- **Type:** Plus Jakarta Sans for display / headings, Inter for body / UI.
- **Icons:** Bootstrap Icons 1.11.3 — class `bi bi-<name>`. No emoji in product UI.
- **Voice:** second-person, sentence case, stat-led headlines, imperative CTAs, never chirpy, never clinical.
- **Signature moves:** 24px card radius · two-ring SOS pulse animation · gradient-bodied buttons with brand-tinted halos · always-visible floating Emergency button (bottom-right) · radial color-blob hero background.

## Output decisions

If the user invokes this skill without specifics, ask:

- **What** to build? (Slide, landing page, prototype, screen, etc.)
- **Which surface?** (SOS, EHR, Doctor — Diet is the partner hand-off only)
- **Variation depth?** (Use the existing UI kit as-is, or explore divergent visuals?)
- **Theme:** light, dark, or both?

If the user wants a quick mock or slide, copy assets into a static HTML file and use the tokens directly. If the user wants production code, point at `colors_and_type.css` + `ui_kits/emd_web/` and act as an expert designer pair-programming with them.

## Source repos (read-only reference)

- Codebase: [github.com/infroid/emd](https://github.com/infroid/emd) (private, default branch `master`)
- Partner: [github.com/infroid/mfc](https://github.com/infroid/mfc) — only relevant for the diet hand-off.
- Pinned snapshots from commit `7294a11` live under `static/` and `templates/` in this skill folder for offline lookup.

## What's missing — flag these if a stakeholder asks

- The production logo (`static/images/logos/logo.svg`) is a 340 KB auto-traced raster of a teal cross + "EMD" text. **This skill ships the brand mark as a Thiings-style illustration** (a caregiver supporting an older person in a wheelchair) — `assets/logos/logo-primary.png` is the source, with light/dark × square/circle variants pre-composited. The illustration mark and the Thiings illustration system are one and the same: the brand IS the illustration vocabulary.
- No marketing illustrations, stock photography, or avatar set ship with the brand. Use placeholders or ask.
- The PWA manifest theme color (`#e74c3c`) is slightly off from the token (`#dc2626`). Use the token.
