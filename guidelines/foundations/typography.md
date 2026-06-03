# Typography

Typography values come from `--ds-typography-*` CSS custom properties.

## Font families

| Token | Usage |
|-------|-------|
| `--ds-typography-family-sans` | Primary UI font (body, labels, buttons) |
| `--ds-typography-family-mono` | Code, monospace content |

## Type scale

| Token | Approx size | Weight | Usage |
|-------|------------|--------|-------|
| `--ds-typography-size-xs` | ~11px | Regular | Captions, footnotes only |
| `--ds-typography-size-sm` | ~12px | Regular | Small labels, helper text |
| `--ds-typography-size-md` | ~14px | Regular | Body text, form labels |
| `--ds-typography-size-lg` | ~16px | Medium | Subheadings, emphasized body |
| `--ds-typography-size-xl` | ~20px | Semibold | Section headings |
| `--ds-typography-size-2xl` | ~24px | Bold | Page titles |

## Typography selection decision tree

```
What text element is this?
│
├─ Button label → handled by component, do not override
├─ Form label   → size-md, weight regular
├─ Helper text  → size-sm, weight regular, color on-surface-variant
├─ Error text   → size-sm, weight regular, color control-error
├─ Body text    → size-md, weight regular
├─ Subheading   → size-lg, weight medium
├─ Section heading → size-xl, weight semibold
├─ Page title   → size-2xl, weight bold
└─ Caption      → size-xs (ONLY for captions, never body text)
```

## Rules

**Do not use `xs` text for anything except captions.** Small text reduces readability and fails accessibility contrast requirements.

**Do not override button text size.** The Button component manages its own typography — do not add `font-size` or `font-weight` to button elements.

## Usage example

```css
{/* CORRECT */}
.form-label {
  font-size: var(--ds-typography-size-md);
  color: var(--ds-default-on-surface);
}

{/* WRONG — hardcoded values */}
.form-label {
  font-size: 14px;
  color: #333;
}
```
