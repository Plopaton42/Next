# Spacing

All spacing comes from `--ds-*` CSS custom properties. **Never use arbitrary pixel values.**

## Token categories

| Category | Prefix | Purpose |
|----------|--------|---------|
| Horizontal padding | `--ds-padding-px-px-{N}` | Left/right padding inside elements |
| Vertical padding | `--ds-padding-py-py-{N}` | Top/bottom padding inside elements |
| Gap between elements | `--ds-space-between-space-{N}` | Flexbox/grid gaps |
| Border radius | `--ds-border-radius-radius-{N}` | Rounded corners |

## Available values

**Padding horizontal:** `px-8`, `px-12`, `px-16`, `px-20`, `px-24`
**Padding vertical:** `py-8`, `py-12`, `py-16`, `py-20`, `py-24`
**Gap:** `space-4`, `space-8`, `space-12`, `space-16`, `space-20`, `space-24`

## Border radius scale

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-border-radius-radius-4` | 4px | Badges, tags, small chips |
| `--ds-border-radius-radius-8` | 8px | Buttons, inputs (default) |
| `--ds-border-radius-radius-12` | 12px | Cards, dropdowns |
| `--ds-border-radius-radius-16` | 16px | Large cards, modals, sheets |
| `--ds-border-radius-radius-full` | 9999px | Pill buttons, avatars, fully rounded |

## Spacing selection decision tree

```
What spacing do you need?
│
├─ Inside a component (padding)
│  ├─ Horizontal (left/right) → var(--ds-padding-px-px-{N})
│  └─ Vertical (top/bottom)   → var(--ds-padding-py-py-{N})
│
├─ Between sibling elements
│  └─ gap: var(--ds-space-between-space-{N})
│
└─ Corner rounding
   ├─ Small element (badge, chip)  → radius-4
   ├─ Standard (button, input)     → radius-8
   ├─ Card or popover              → radius-12
   ├─ Large modal                  → radius-16
   └─ Pill / fully rounded         → radius-full
```

## Usage example

```css
{/* CORRECT — design tokens */}
.custom-card {
  padding: var(--ds-padding-py-py-16) var(--ds-padding-px-px-20);
  border-radius: var(--ds-border-radius-radius-12);
  gap: var(--ds-space-between-space-8);
}

{/* WRONG — arbitrary values */}
.custom-card {
  padding: 14px 18px;
  border-radius: 10px;
  gap: 10px;
}
```
