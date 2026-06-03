# Design tokens

All tokens are CSS custom properties prefixed `--ds-*`. Import them via `@plopaton42/design-system/style.css`.

## Two-layer architecture

```
Layer 1 — Primitives (variables.css)
  Raw scales: color palettes, spacing values, font sizes, border radii
  Example: --ds-brand-brand-700, --ds-neutral-neutral-900

Layer 2 — Semantic (semantic.css)
  Purpose-based aliases that reference primitives
  Example: --ds-button-primary-surface → maps to brand-700
```

Always prefer **semantic tokens** over primitives in components.

## Token categories

| Category | CSS prefix | Purpose |
|----------|-----------|---------|
| Button surfaces | `--ds-button-{type}-*` | Button backgrounds, text, borders |
| Control surfaces | `--ds-control-*` | Checkbox, radio, input fields |
| Default surfaces | `--ds-default-*` | Page backgrounds, general text |
| Brand colors | `--ds-brand-brand-{50-900}` | Raw brand color scale |
| Neutral colors | `--ds-neutral-neutral-{50-900}` | Grays |
| Border radius | `--ds-border-radius-radius-{N}` | Rounded corners |
| Spacing — padding X | `--ds-padding-px-px-{N}` | Horizontal padding |
| Spacing — padding Y | `--ds-padding-py-py-{N}` | Vertical padding |
| Spacing — gap | `--ds-space-between-space-{N}` | Flexbox/grid gaps |
| Typography | `--ds-typography-*` | Font sizes, weights, families |
| Shadows | `--ds-shadows-shadow-*` | Box shadows |
| Focus | `--ds-focus-*` | Focus ring color/width |

## Naming pattern

```
--ds-{category}-{subcategory}-{variant}
```

Examples:
- `--ds-button-primary-surface` → primary button background
- `--ds-border-radius-radius-8` → 8px border radius
- `--ds-padding-px-px-16` → 16px horizontal padding

## Token selection decision tree

```
Need a color?
├── For a button background → --ds-button-{type}-surface
├── For button text/icon   → --ds-button-{type}-on-surface
├── For checkbox/input     → --ds-control-surface / --ds-control-outline
├── For page background    → --ds-default-surface
├── For body text          → --ds-default-on-surface
└── For secondary text     → --ds-default-on-surface-variant

Need spacing?
├── Horizontal padding     → --ds-padding-px-px-{8|12|16|20|24}
├── Vertical padding       → --ds-padding-py-py-{8|12|16|20|24}
└── Gap between elements   → --ds-space-between-space-{4|8|12|16}

Need border radius?
├── Small (chips, badges)  → --ds-border-radius-radius-4
├── Standard (buttons)     → --ds-border-radius-radius-8
├── Large (cards, modals)  → --ds-border-radius-radius-12
└── Pill / fully rounded   → --ds-border-radius-radius-full
```

## Using tokens in custom CSS

```css
.my-custom-card {
  background: var(--ds-default-surface);
  color: var(--ds-default-on-surface);
  border-radius: var(--ds-border-radius-radius-12);
  padding: var(--ds-padding-py-py-16) var(--ds-padding-px-px-20);
  box-shadow: var(--ds-shadows-shadow-md);
}
```
