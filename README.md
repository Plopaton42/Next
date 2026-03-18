# @mobivia/design-system

A token-driven, AI-first Vue 3 component library for the Mobivia Group brands — Norauto, Midas, ATU, Auto5, and Mobivia.

Single source of truth flows from Figma through DTCG design tokens into CSS custom properties and Tailwind v4 utility classes.

---

## Quick start

```bash
# Install dependencies
npm install

# Build tokens (required before any other step)
npm run build:tokens

# Start dev server
npm run dev

# Start Storybook (port 6009)
npm run storybook
```

---

## Architecture

### Multi-brand token system

The design system supports **5 brands**, each with **3 color modes** (light, dark, high-contrast):

| Brand    | Primitives file                  | Semantic file                  |
|----------|----------------------------------|--------------------------------|
| Norauto  | `tokens/source/primitives/norauto.json` | `tokens/source/semantic/norauto.json` |
| Midas    | `tokens/source/primitives/midas.json`   | `tokens/source/semantic/midas.json`   |
| ATU      | `tokens/source/primitives/atu.json`     | `tokens/source/semantic/atu.json`     |
| Auto5    | `tokens/source/primitives/auto5.json`   | `tokens/source/semantic/auto5.json`   |
| Mobivia  | `tokens/source/primitives/mobivia.json` | `tokens/source/semantic/mobivia.json` |

Global (brand-agnostic) tokens: `focus.json`, `radius.json`, `spacing.json`, `typography.json`, `shadows.json`.

### Token pipeline

```
Figma (source of truth)
  │
  ▼  manual update or plugin export
tokens/source/**/*.json   (DTCG format, committed to git)
  │
  ▼  npm run build:tokens  (style-dictionary.config.ts)
tokens/build/
  ├── variables.css          → :root { --ds-* }  primitive vars
  ├── semantic-light.css     → light mode semantic vars
  ├── semantic-dark.css      → dark mode semantic vars
  ├── semantic-contrast.css  → high-contrast semantic vars
  └── theme.ts               → typed TS object for JS usage
  │
  ▼  imported in src/style.css
@theme inline { ... }        → Tailwind v4 utility classes
```

> **Never edit `tokens/build/`** — it is gitignored and regenerated on every `build:tokens` run.

### Figma Code Connect

Each component has a `Component.figma.ts` file co-located with its implementation. These files record the Figma↔code mapping and are published to Figma Dev Mode via the Figma MCP server.

```
components/Checkbox/
  ├── Checkbox.vue          ← component implementation
  ├── Checkbox.stories.ts   ← Storybook stories
  ├── Checkbox.figma.ts     ← Figma Code Connect mapping
  └── README.md             ← props, tokens, a11y, changelog
```

---

## Available commands

| Command                  | Description                                              |
|--------------------------|----------------------------------------------------------|
| `npm run build:tokens`   | Rebuild `tokens/build/` from `tokens/source/`            |
| `npm run dev`            | Start Vite dev server (run `build:tokens` first)         |
| `npm run build`          | Full production build (tokens → type-check → vite)       |
| `npm run storybook`      | Start Storybook on port 6009                             |
| `npm run build-storybook`| Build static Storybook for deployment                    |
| `npm run mcp`            | Start MCP server exposing design system tools for AI     |

---

## MCP server

The design system exposes an MCP server (`npm run mcp`) with three tools for AI agents:

| Tool              | Description                                              |
|-------------------|----------------------------------------------------------|
| `list_tokens`     | Return all tokens by category from `tokens/source/`      |
| `get_component`   | Return `.vue` source + README for a named component      |
| `get_conventions` | Return the full `CLAUDE.md` conventions file             |

---

## Components

| Component  | Status | Storybook | Figma |
|------------|--------|-----------|-------|
| Checkbox   | ✅ Stable | [Stories](components/Checkbox/Checkbox.stories.ts) | [Figma](https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17015-4309) |

---

## Contributing

See [CLAUDE.md](./CLAUDE.md) for the complete conventions guide:
- Token naming and DTCG format
- Component structure and Vue conventions
- Figma fidelity rules
- Git workflow and commit format
- Self-review checklist
