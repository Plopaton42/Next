# @plopaton42/design-system

Token-driven, AI-first dual-framework (Vue 3 + React) component library.

Single source of truth flows from Figma → DTCG JSON tokens → CSS custom properties (`--ds-*`) → Tailwind v4 utility classes. Components are available for both Vue 3 and React.

---

## Install

```bash
npm install @plopaton42/design-system
```

## Import

```tsx
// React
import { Button } from '@plopaton42/design-system/react'
import '@plopaton42/design-system/style.css'
```

```vue
<!-- Vue -->
<script setup>
import { Button } from '@plopaton42/design-system'
import '@plopaton42/design-system/style.css'
</script>
```

```css
/* CSS tokens only (if you want to use --ds-* variables without components) */
@import '@plopaton42/design-system/tokens/variables.css';
@import '@plopaton42/design-system/tokens/semantic.css';
```

---

## Available components

| Component   | Vue | React | Description |
|-------------|:---:|:-----:|-------------|
| Button      | ✅  | ✅    | Primary, secondary, ghost variants — 3 sizes — loading/disabled states |
| Checkbox    | ✅  | ✅    | Controlled/uncontrolled — indeterminate state — label slot |
| SplitButton | ✅  | ✅    | Button + dropdown trigger — same variants as Button |

---

## MCP server (for AI agents)

This design system exposes an MCP server so AI agents can retrieve components and tokens directly.

**HTTP endpoint (public):** `https://next-production-316b.up.railway.app/mcp`

### Tools

| Tool | Description |
|------|-------------|
| `list_components` | Lists all available components with framework info |
| `get_component` | Returns full source code + copy instructions for a component |
| `get_token_styles` | Returns the built CSS (`--ds-*` variables) to paste into your project |
| `list_tokens` | Returns raw DTCG token JSON from `tokens/source/` |
| `get_conventions` | Returns the full design system conventions (CLAUDE.md) |

### Typical AI workflow using the MCP

```
1. list_components          → see what's available
2. get_component("Button")  → get source code + copy instructions
3. get_token_styles         → get the CSS variables to add to your project
```

### Configure in your project (`.mcp.json`)

```json
{
  "mcpServers": {
    "design-system": {
      "type": "http",
      "url": "https://next-production-316b.up.railway.app/mcp"
    }
  }
}
```

---

## Design tokens

All CSS custom properties are prefixed `--ds-*`. Two layers:

| File | Contents |
|------|----------|
| `tokens/variables.css` | Primitive scales: colors, spacing, radius, typography, shadows |
| `tokens/semantic.css` | Semantic tokens: button surfaces, text colors, borders, focus rings |

Token source files live in `tokens/source/` (DTCG JSON format). Run `npm run build:tokens` to regenerate.

---

## Architecture

```
tokens/source/**/*.json   (DTCG format — source of truth)
        │
        ▼  npm run build:tokens
tokens/build/
  ├── variables.css   → :root { --ds-* }
  ├── semantic.css    → :root { --ds-* }
  └── theme.ts        → typed TS object
        │
        ▼  imported in src/style.css
@theme inline { ... }  → Tailwind v4 utility classes
```

Each component follows this structure:

```
components/Button/
  ├── Button.vue           ← Vue 3 SFC
  ├── Button.tsx           ← React functional component
  ├── Button.types.ts      ← Shared TypeScript interfaces
  ├── Button.stories.ts    ← Vue Storybook stories (port 6009)
  ├── Button.react.stories.tsx  ← React Storybook stories (port 6010)
  ├── Button.figma.ts      ← Figma Code Connect mapping
  └── README.md            ← Props, tokens, a11y, changelog
```

---

## Contributing / local dev

```bash
npm install
npm run build:tokens   # required before anything else
npm run dev            # Vite dev server
npm run storybook:vue  # Vue Storybook — port 6009
npm run storybook:react  # React Storybook — port 6010
npm run mcp:http       # MCP HTTP server — port 3001
```

See [CLAUDE.md](./CLAUDE.md) for the full conventions guide: token naming, component architecture, Figma fidelity rules, git workflow, and self-review checklist.
