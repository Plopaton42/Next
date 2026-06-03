# Button

The primary interactive element. Use for any user action.

## Import

```tsx
import { Button } from '@plopaton42/design-system/react'
```

## When to use which type

```
What visual hierarchy does this button need?
├── Most important action on the page  → type="primary"
├── Secondary / less prominent action  → type="secondary"
├── Low-emphasis, inline action        → type="ghost" or type="tertiary"
├── Border-only style                  → type="outlined"
└── On a dark/colored background       → type="inverted"

Does the action destroy or remove data?
└── Yes → add intent="destructive" to any type

Is it an alternative brand action?
└── Yes → add intent="alternative"
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'primary' \| 'secondary' \| 'tertiary' \| 'outlined' \| 'ghost' \| 'inverted'` | `'primary'` | Visual style |
| `intent` | `'default' \| 'destructive' \| 'alternative'` | `'default'` | Semantic intent |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `rounded` | `boolean` | `false` | Pill shape (fully rounded) |
| `iconOnly` | `boolean` | `false` | Square proportions for icon-only use |
| `tag` | `'button' \| 'a'` | `'button'` | HTML element rendered |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type |
| `onClick` | `(e: React.MouseEvent) => void` | — | Click handler |
| `children` | `ReactNode` | — | Button label / content |
| `className` | `string` | — | Additional CSS classes |

## Examples

```tsx
// Primary (default) — most common
<Button onClick={handleSave}>Save changes</Button>

// Secondary
<Button type="secondary" onClick={handleCancel}>Cancel</Button>

// Ghost — low emphasis
<Button type="ghost">Learn more</Button>

// Destructive action
<Button type="primary" intent="destructive" onClick={handleDelete}>
  Delete account
</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra large</Button>

// Disabled
<Button disabled>Not available</Button>

// Pill shape
<Button rounded>Rounded button</Button>

// As a link
<Button tag="a" href="/dashboard">Go to dashboard</Button>

// Form submit
<Button nativeType="submit">Submit form</Button>
```

## Design tokens used

| Token | Usage |
|-------|-------|
| `--ds-button-{type}-surface` | Background color |
| `--ds-button-{type}-on-surface` | Text and icon color |
| `--ds-button-{type}-outline` | Border color |
| `--ds-border-radius-radius-8` | Corner radius (default) |
| `--ds-border-radius-radius-full` | Corner radius when `rounded` |
| `--ds-focus-ring` | Focus ring on keyboard navigation |
