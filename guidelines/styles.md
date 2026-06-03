# Styles reference

All CSS custom properties are injected under `:root` when you import `@plopaton42/design-system/style.css`.

## Button tokens

| Token | Usage |
|-------|-------|
| `--ds-button-primary-surface` | Primary button background |
| `--ds-button-primary-on-surface` | Primary button text and icon color |
| `--ds-button-primary-outline` | Primary button border |
| `--ds-button-secondary-surface` | Secondary button background |
| `--ds-button-secondary-on-surface` | Secondary button text and icon color |
| `--ds-button-secondary-outline` | Secondary button border |
| `--ds-button-tertiary-surface` | Tertiary button background |
| `--ds-button-tertiary-on-surface` | Tertiary button text color |
| `--ds-button-ghost-surface` | Ghost button background (usually transparent) |
| `--ds-button-ghost-on-surface` | Ghost button text color |
| `--ds-button-outlined-surface` | Outlined button background |
| `--ds-button-outlined-on-surface` | Outlined button text color |
| `--ds-button-outlined-outline` | Outlined button border color |
| `--ds-button-inverted-surface` | Inverted button background (for dark backgrounds) |
| `--ds-button-inverted-on-surface` | Inverted button text color |

## Control tokens (Checkbox, inputs)

| Token | Usage |
|-------|-------|
| `--ds-control-surface` | Checkbox/radio background |
| `--ds-control-on-surface` | Checkmark/indicator color |
| `--ds-control-outline` | Checkbox/radio border |
| `--ds-control-disabled-surface` | Disabled state background |
| `--ds-control-disabled-on-surface` | Disabled state indicator color |
| `--ds-control-disabled-outline` | Disabled state border |
| `--ds-control-error-surface` | Error state background |
| `--ds-control-error-outline` | Error state border |

## Default surface tokens

| Token | Usage |
|-------|-------|
| `--ds-default-surface` | Page/card background |
| `--ds-default-surface-variant` | Slightly elevated surface |
| `--ds-default-on-surface` | Primary text color |
| `--ds-default-on-surface-variant` | Secondary/muted text color |
| `--ds-default-outline` | Default border color |
| `--ds-default-outline-variant` | Subtle border color |

## Focus ring

| Token | Usage |
|-------|-------|
| `--ds-focus-ring` | Focus ring color (applied on keyboard navigation) |

## Border radius scale

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-border-radius-radius-4` | 4px | Small elements (badges, chips) |
| `--ds-border-radius-radius-8` | 8px | Buttons, inputs (default) |
| `--ds-border-radius-radius-12` | 12px | Cards, popovers |
| `--ds-border-radius-radius-16` | 16px | Large cards, modals |
| `--ds-border-radius-radius-full` | 9999px | Pill buttons, avatars |

## Spacing scale

Horizontal padding (`--ds-padding-px-px-{N}`): 8, 12, 16, 20, 24
Vertical padding (`--ds-padding-py-py-{N}`): 8, 12, 16, 20, 24
Gap (`--ds-space-between-space-{N}`): 4, 8, 12, 16, 20, 24

## Custom component example

```css
/* Building a custom alert using design tokens */
.alert {
  background: var(--ds-default-surface-variant);
  color: var(--ds-default-on-surface);
  border: 1px solid var(--ds-default-outline);
  border-radius: var(--ds-border-radius-radius-12);
  padding: var(--ds-padding-py-py-12) var(--ds-padding-px-px-16);
  display: flex;
  gap: var(--ds-space-between-space-8);
}
```
