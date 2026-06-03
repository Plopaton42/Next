# Button

The primary interactive element for any user action — submit, navigate, trigger.

## Import

```tsx
import { Button } from '@plopaton42/design-system/react'
import '@plopaton42/design-system/style.css'
```

## When to use which type

```
What visual weight does this button need?
│
├─ Most important action on the page → type="primary"
├─ Supporting / secondary action     → type="secondary"
├─ Border-only style                 → type="outlined"
├─ Low-emphasis, inline action       → type="ghost" or type="tertiary"
└─ On a dark or colored background   → type="inverted"

Does the action destroy or remove data?
└─ Yes → add intent="destructive" to any type above

Is it an alternative brand action?
└─ Yes → add intent="alternative"
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'primary' \| 'secondary' \| 'tertiary' \| 'outlined' \| 'ghost' \| 'inverted'` | `'primary'` | Visual style |
| `intent` | `'default' \| 'destructive' \| 'alternative'` | `'default'` | Semantic intent |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `rounded` | `boolean` | `false` | Pill shape (fully rounded corners) |
| `iconOnly` | `boolean` | `false` | Square proportions for icon-only use |
| `tag` | `'button' \| 'a'` | `'button'` | HTML element rendered |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type attribute |
| `onClick` | `(e: React.MouseEvent) => void` | — | Click handler |
| `children` | `ReactNode` | — | Button label / content |
| `className` | `string` | — | Additional CSS classes |

## Usage examples

```tsx
{/* CORRECT — primary action */}
<Button onClick={handleSave}>Save changes</Button>

{/* CORRECT — secondary action */}
<Button type="secondary" onClick={handleCancel}>Cancel</Button>

{/* CORRECT — destructive action */}
<Button type="primary" intent="destructive" onClick={handleDelete}>
  Delete account
</Button>

{/* CORRECT — ghost (low emphasis) */}
<Button type="ghost">Learn more</Button>

{/* CORRECT — pill shape */}
<Button rounded>Rounded button</Button>

{/* CORRECT — rendered as anchor tag */}
<Button tag="a" href="/dashboard">Go to dashboard</Button>

{/* CORRECT — form submit */}
<Button nativeType="submit">Submit form</Button>

{/* WRONG — two primary buttons side by side */}
<Button type="primary">Save</Button>
<Button type="primary">Cancel</Button>

{/* WRONG — hardcoded font size on button */}
<Button style={{ fontSize: '16px' }}>Save</Button>
```

## Rules

**Never place two `type="primary"` buttons at the same visual level.** One primary action per section — the second action must be `secondary`, `outlined`, or `ghost`.

**Never override button typography.** The Button component manages its own `font-size` and `font-weight` — do not add these via `style` or `className`.

**Always use `intent="destructive"` for delete/remove actions**, regardless of which `type` you choose.

## Design tokens used

| Token | Usage |
|-------|-------|
| `--ds-button-{type}-surface` | Background color |
| `--ds-button-{type}-on-surface` | Text and icon color |
| `--ds-button-{type}-outline` | Border color |
| `--ds-border-radius-radius-8` | Corner radius (default) |
| `--ds-border-radius-radius-full` | Corner radius when `rounded={true}` |
| `--ds-focus-ring` | Focus ring on keyboard navigation |
