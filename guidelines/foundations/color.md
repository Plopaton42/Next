# Color

All colors come from `--ds-*` CSS custom properties. **Never use hardcoded hex or Tailwind color utilities.**

## Color token categories

| Category | Prefix | Usage frequency | Purpose |
|----------|--------|----------------|---------|
| Button surfaces | `--ds-button-{type}-surface` | High | Button backgrounds |
| Button text | `--ds-button-{type}-on-surface` | High | Button labels and icons |
| Control surfaces | `--ds-control-*` | Medium | Checkbox, radio, inputs |
| Default surfaces | `--ds-default-surface` | High | Page and card backgrounds |
| Default text | `--ds-default-on-surface` | High | Body text |
| Brand primitives | `--ds-brand-brand-{50-900}` | Low | Only for custom brand elements |
| Neutral primitives | `--ds-neutral-neutral-{50-900}` | Low | Only for custom gray elements |

## Color selection decision tree

```
What element needs a color?
│
├─ A button
│  ├─ Background → var(--ds-button-{type}-surface)
│  ├─ Text/icon  → var(--ds-button-{type}-on-surface)
│  └─ Border     → var(--ds-button-{type}-outline)
│
├─ A checkbox or input
│  ├─ Background → var(--ds-control-surface)
│  ├─ Border     → var(--ds-control-outline)
│  ├─ Checkmark  → var(--ds-control-on-surface)
│  ├─ Error      → var(--ds-control-error-surface)
│  └─ Disabled   → var(--ds-control-disabled-surface)
│
├─ Page/section background
│  ├─ Main surface      → var(--ds-default-surface)
│  └─ Elevated surface  → var(--ds-default-surface-variant)
│
├─ Text
│  ├─ Primary body text    → var(--ds-default-on-surface)
│  └─ Secondary/muted text → var(--ds-default-on-surface-variant)
│
└─ Border / divider
   ├─ Default border   → var(--ds-default-outline)
   └─ Subtle border    → var(--ds-default-outline-variant)
```

## Naming pattern

```
--ds-{category}-{role}
```

Examples:
- `--ds-button-primary-surface` → primary button background
- `--ds-control-error-outline` → checkbox border in error state
- `--ds-default-on-surface-variant` → muted text color

## Common mistakes

```tsx
{/* WRONG — hardcoded hex */}
<div style={{ background: '#005ab8' }} />

{/* WRONG — Tailwind color class */}
<div className="bg-blue-700" />

{/* WRONG — primitive token in a component */}
<div style={{ background: 'var(--ds-brand-brand-700)' }} />

{/* CORRECT — semantic token */}
<div style={{ background: 'var(--ds-button-primary-surface)' }} />
```

## Focus ring

All interactive elements use `--ds-focus-ring` for the keyboard focus indicator. This is already applied by the component library — do not override it.
