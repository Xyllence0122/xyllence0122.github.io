# xyllence0122.github.io

Personal portfolio of **Chao Lin Chen (Max)** — Intelligent Automation Engineering student at NTUT (National Taipei University of Technology) and President of NPC, the NTUT Programming Club. I build embedded robots, edge-computing systems, and machine-learning projects.

**🌐 Live site:** https://xyllence0122.github.io

## ✨ Features

- **3D node-network hero** — an animated point/line network rendered on a plain `<canvas>` with a few KB of math (no Three.js, no dependencies), reacting to mouse and scroll
- **Auto-synced projects** — featured projects are curated by hand, and the rest of my public GitHub repos are pulled live from the GitHub API (session-cached, graceful fallback)
- **Terminal easter egg** — press <kbd>`</kbd> or click `>_` in the nav, then type `help` 👀
- **Light / dark theme** — persistent, flash-free on reload, synced to the hero canvas palette
- **Typewriter hero line** — cycles through my focus areas
- **Decode animation** — section titles scramble into place as you scroll
- **Scroll UX** — scroll-spy nav highlighting, progress bar, reveal animations
- **Hidden admin panel** — password-gated panel (dot at the bottom-left) for drafting content changes in `localStorage` before publishing them
- **Little touches** — visitor counter, live Taipei clock in the contact section, copy-email button with toast, console greeting for fellow devs
- **Accessible & respectful** — `prefers-reduced-motion` support everywhere, skip link, keyboard-friendly controls, semantic markup
- **SEO ready** — structured data (JSON-LD), Open Graph tags, `sitemap.xml`, `robots.txt`, themed `404.html`

## 🛠 Stack

Hand-written **HTML / CSS / vanilla JavaScript**. No frameworks, no build step, no dependencies — clone it and open `index.html`.

## 📁 Structure

| File | Purpose |
| --- | --- |
| `index.html` | Single-page layout & content |
| `style.css` | Design tokens, themes, all component styles |
| `script.js` | Canvas background, scroll UI, GitHub sync, admin panel, terminal |
| `404.html` | Custom not-found page (used automatically by GitHub Pages) |
| `sitemap.xml` / `robots.txt` | Search-engine plumbing |

## ✏️ Editing content

Site content (featured projects, contact methods, resume link) lives in `DEFAULT_DATA` near the bottom of `script.js`.

- **Draft:** open the admin panel (small dot, bottom-left) — changes save to your own browser only.
- **Publish:** copy the values into `DEFAULT_DATA` and push.

## 🚀 Run locally

Any static file server works:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

© 2026 Chao Lin Chen — feel free to browse the code, but the content is mine.
