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

## Deploy

Live at https://kind-ground-0fdc76e00.3.azurestaticapps.net (Azure Static Web Apps, Free tier).

| Item | Value |
|---|---|
| azd environment | `ai4cyber-101-prod` |
| Subscription | `250f0a94-89ab-4965-a6e8-b3d6dc831eee` |
| Resource group | `rg-ai4cyber-101-prod` (East Asia), course-only |
| App | `stapp-ai4cyber-101-prod`, from [infra/main.bicep](infra/main.bicep) |
| Headers | [public/staticwebapp.config.json](public/staticwebapp.config.json) |

A subscription owner creates the resource group and grants Contributor on it. azd needs no subscription-level rights.

```bash
cd presentation
azd env select ai4cyber-101-prod
azd deploy         # builds, runs both gates, uploads dist/
```

A new environment also needs `azd env set AZURE_RESOURCE_GROUP rg-<env>`, `azd env set PUBLIC_SITE_URL <its URL>` for the canonical link, and `azd provision` once.

## Lineage

Adapted from the AIMTO Security for Vibecoders visual aid (Astro, CSP gate, Zenith notes with parity check, and its header set).
This build drops Tailwind, GSAP, and web fonts: Astro is the only dependency.
