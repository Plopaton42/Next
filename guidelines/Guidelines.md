# @plopaton42/design-system — Guidelines

Token-driven dual-framework component library (Vue 3 + React). All theming uses `--ds-*` CSS custom properties — never hardcoded values.

## MUST READ first (always loaded)

- `setup.md` — install, CSS imports, required configuration
- `foundations/color.md` — color tokens and decision tree
- `components/overview.md` — component catalog and selection guide

## Read on demand (load when relevant)

- `foundations/spacing.md` — spacing tokens and layout rules
- `foundations/typography.md` — font sizes, weights, families
- `components/button.md` — Button API and usage rules
- `components/checkbox.md` — Checkbox API and states
- `components/splitbutton.md` — SplitButton API and keyboard nav

## Non-negotiable rules

**Always follow these — no exceptions:**

1. **Never hardcode colors.** Use `--ds-*` CSS variables. Never use `#hex`, `rgb()`, or Tailwind color classes like `bg-blue-500`.
2. **Always import CSS.** Every file using components must have `import '@plopaton42/design-system/style.css'` at the root.
3. **Use semantic tokens, not primitives.** Use `--ds-button-primary-surface`, not `--ds-brand-brand-700`.
4. **React imports from `/react`.** Always `from '@plopaton42/design-system/react'`, not from the root.
5. **No arbitrary spacing values.** Use `--ds-padding-*` and `--ds-space-between-*` tokens.

## Available components

| Component | Purpose | File |
|-----------|---------|------|
| Button | All interactive actions | `components/button.md` |
| Checkbox | Boolean input with label | `components/checkbox.md` |
| SplitButton | Primary action + dropdown | `components/splitbutton.md` |

## Design philosophy

Single source of truth: Figma → DTCG JSON tokens → CSS custom properties → components. Every visual value in every component traces back to a named token.
