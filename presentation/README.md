# Visual aid and speaker notes

A static Astro site the trainer projects during class, plus Zenith speaker notes.
Both come from one file: [src/content/presentation-contract.json](src/content/presentation-contract.json).

## Commands

```bash
cd presentation
npm ci
npm run dev        # http://localhost:4321
npm run notes      # regenerate speaker-notes/course-notes.zen from the contract
npm run build      # build, then run the security and parity gates
```

Navigate with the section rail or `ArrowDown`, `PageDown`, `ArrowUp`, and `PageUp`.

## Gates

| Gate | Checks |
|---|---|
| `scripts/validate-security.mjs` | Header set and CSP in `dist/staticwebapp.config.json`, no inline scripts or styles in the build |
| `scripts/validate-presentation-parity.mjs` | Contract timing (180 minutes in session), and every title, time, cue, point, prompt, command, and source appears in both the site and the notes |

## Lineage

Adapted from the AIMTO Security for Vibecoders visual aid (Astro, CSP gate, Zenith notes with parity check).
This build drops Tailwind, GSAP, and web fonts: Astro is the only dependency.
