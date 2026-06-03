# @next/design-system

A token-driven, AI-first dual-framework (Vue 3 + React) component library for the brand.

Single source of truth flows from Figma through DTCG design tokens into CSS custom properties and Tailwind v4 utility classes. Components are available for both Vue 3 and React.

---

## Quick start

```bash
# Install dependencies
npm install

# Build tokens (required before any other step)
npm run build:tokens

# Start dev server
npm run dev

# Start Vue Storybook (port 6009)
npm run storybook:vue

# Start React Storybook (port 6010)
npm run storybook:react
```

---

## Installation (consumers)

```bash
npm install @next/design-system
```

```ts
// Vue
import { Button } from '@next/design-system';

// React
import { Button } from '@next/design-system/react';

// CSS (include once at the app root)
import '@next/design-system/style.css';
```

---

## Architecture

### Token system

The design system uses a single-brand token architecture targeting.

| File | Contents |
|------|----------|
| `primitives/global-colors.json` | 12 universal color scales: blue, neutral, ambient, periwinkle, red, green, orange, rose, violet, indigo + global palette |
| `primitives/.json` |  brand scales (`brand/`, `brand/secondary`) |
| `semantic/.json` | Semantic tokens referencing primitives |
| `spacing.json` | Horizontal (`padding/px`), vertical (`padding/py`), gap (`space-between`) scales |
| `radius.json` | Border-radius scale (`radius-N` in px) |
| `sizing.json` | Component heights, icon sizes, stroke widths, opacity scale |
| `typography.json` | Font families, sizes, weights |
| `shadows.json` | Box-shadow tokens |
| `focus.json` | Focus ring tokens |

### Token pipeline

```
Figma (source of truth)
  │
  ▼  extracted via Figma MCP Plugin API
tokens/source/**/*.json   (DTCG format, committed to git)
  │
  ▼  npm run build:tokens  (style-dictionary.config.ts)
tokens/build/
  ├── variables.css   → :root { --ds-* }  all primitive vars
  ├── semantic.css    → :root { --ds-* }  all semantic vars
  └── theme.ts        → typed TS object for JS usage
  │
  ▼  imported in src/style.css
@theme inline { ... }   → Tailwind v4 utility classes
```

> **Never edit `tokens/build/`** — it is gitignored and regenerated on every `build:tokens` run.

### Dual-framework components

Each component is available in both Vue 3 and React:

```
components/Button/
  ├── Button.vue                    ← Vue 3 implementation
  ├── Button.tsx                    ← React implementation
  ├── Button.types.ts               ← Shared TypeScript interfaces
  ├── Button.stories.ts             ← Vue Storybook stories
  ├── Button.react.stories.tsx      ← React Storybook stories
  ├── Button.figma.ts               ← Figma Code Connect mapping
  └── README.md                     ← props, tokens, a11y, changelog
```

### Figma Code Connect

Each component has a `Component.figma.ts` file co-located with its implementation. These files record the Figma↔code mapping and are published to Figma Dev Mode via the Figma MCP server.

---

## Available commands

| Command                     | Description                                              |
|-----------------------------|----------------------------------------------------------|
| `npm run build:tokens`      | Rebuild `tokens/build/` from `tokens/source/`            |
| `npm run dev`               | Start Vite dev server (run `build:tokens` first)         |
| `npm run build`             | Full production build (tokens → type-check → vite)       |
| `npm run build:lib`         | Build the publishable npm package into `dist/`           |
| `npm run storybook:vue`     | Start Vue Storybook on port 6009                         |
| `npm run storybook:react`   | Start React Storybook on port 6010                       |
| `npm run build-storybook:vue`   | Build static Vue Storybook                           |
| `npm run build-storybook:react` | Build static React Storybook                         |
| `npm run mcp`               | Start MCP server exposing design system tools for AI     |

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

| Component   | Vue | React | Storybook | Figma |
|-------------|-----|-------|-----------|-------|
| Button      | ✅  | ✅    | [Vue](components/Button/Button.stories.ts) · [React](components/Button/Button.react.stories.tsx) | [Figma](https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17187-1090) |
| Checkbox    | ✅  | ✅    | [Vue](components/Checkbox/Checkbox.stories.ts) · [React](components/Checkbox/Checkbox.react.stories.tsx) | [Figma](https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17015-4309) |
| SplitButton | ✅  | ✅    | [Vue](components/SplitButton/SplitButton.stories.ts) · [React](components/SplitButton/SplitButton.react.stories.tsx) | — |

---

## Contributing

See [CLAUDE.md](./CLAUDE.md) for the complete conventions guide:
- Token naming and DTCG format
- Component structure and Vue/React conventions
- Figma fidelity rules
- Git workflow and commit format
- Self-review checklist
