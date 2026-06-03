# @plopaton42/design-system

Token-driven dual-framework component library (Vue 3 + React). All components use CSS custom properties (`--ds-*`) for theming — no hardcoded colors or sizes anywhere.

## Available components

| Component | Description | React import |
|-----------|-------------|-------------|
| `Button` | Primary action button — 6 types, 3 intents, 5 sizes | `import { Button } from '@plopaton42/design-system/react'` |
| `Checkbox` | Checkbox with label and helper text — controlled/uncontrolled | `import { Checkbox } from '@plopaton42/design-system/react'` |
| `SplitButton` | Button + dropdown for multiple related actions | `import { SplitButton } from '@plopaton42/design-system/react'` |

## Setup (required before using any component)

```tsx
// In your root file (main.tsx or App.tsx)
import '@plopaton42/design-system/style.css'
```

See `setup.md` for full configuration details.

## Reading order

1. `setup.md` — install and configure
2. `tokens.md` — understand the `--ds-*` token system
3. `styles.md` — CSS custom properties reference
4. `components/Button.md` — Button API
5. `components/Checkbox.md` — Checkbox API
6. `components/SplitButton.md` — SplitButton API

## Critical rules

- **Never hardcode colors** — always use `--ds-*` CSS variables
- **Always import CSS** — `import '@plopaton42/design-system/style.css'`
- **React imports**: from `@plopaton42/design-system/react`
- **Vue imports**: from `@plopaton42/design-system`
