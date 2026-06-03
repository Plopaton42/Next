# Checkbox

Boolean on/off input with a label. Supports controlled/uncontrolled, indeterminate, helper text, and error state.

## Import

```tsx
import { Checkbox } from '@plopaton42/design-system/react'
import '@plopaton42/design-system/style.css'
```

## When to use which state

```
What is the checkbox's current condition?
│
├─ Normal, user can interact → state="Default" (omit prop — it's the default)
├─ Form validation failed    → state="Error" + provide errorMessage prop
├─ User cannot interact      → state="Disabled"
├─ Hover (pointer over it)   → managed by CSS, do NOT set manually
└─ Keyboard focused          → managed by CSS, do NOT set manually

Is it a "select all" with partial selection?
└─ Yes → set indeterminate={true}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state |
| `indeterminate` | `boolean` | `false` | Indeterminate (partial selection) |
| `state` | `'Default' \| 'Hover' \| 'Focus' \| 'Disabled' \| 'Error'` | `'Default'` | Visual state |
| `label` | `string` | — | Primary label text |
| `secondaryLabel` | `string` | — | Secondary label shown next to primary |
| `showSecondaryLabel` | `boolean` | `false` | Show/hide secondary label |
| `helperText` | `string` | — | Helper text below the checkbox |
| `showHelper` | `boolean` | `false` | Show/hide helper text |
| `errorMessage` | `string` | — | Error message (shown when `state="Error"`) |
| `withContent` | `boolean` | `false` | Whether label content is present |
| `onChange` | `(checked: boolean) => void` | — | Change handler |

## Usage examples

```tsx
{/* CORRECT — basic checkbox */}
<Checkbox
  label="I agree to the terms and conditions"
  onChange={(checked) => setAgreed(checked)}
/>

{/* CORRECT — with helper text */}
<Checkbox
  label="Subscribe to newsletter"
  helperText="Weekly digest, unsubscribe anytime"
  showHelper
  onChange={setSubscribed}
/>

{/* CORRECT — error state with message */}
<Checkbox
  label="Accept terms"
  state="Error"
  errorMessage="You must accept the terms to continue"
  onChange={setValue}
/>

{/* CORRECT — disabled */}
<Checkbox
  label="This option is unavailable"
  state="Disabled"
  checked={false}
/>

{/* CORRECT — indeterminate for "select all" */}
<Checkbox
  label="Select all items"
  indeterminate={someChecked && !allChecked}
  checked={allChecked}
  onChange={toggleSelectAll}
/>

{/* WRONG — setting hover state manually */}
<Checkbox label="Terms" state="Hover" onChange={setValue} />

{/* WRONG — setting focus state manually */}
<Checkbox label="Terms" state="Focus" onChange={setValue} />
```

## Rules

**Never set `state="Hover"` or `state="Focus"` in code.** These states are managed by CSS pseudo-classes and the component's internal event handlers — setting them manually produces incorrect visual state that does not respond to user interaction.

**Always provide `errorMessage` when using `state="Error"`.** Without the message, the error state has no accessible description.

**Use `indeterminate` for partial selection, not a custom UI.** The indeterminate state is built into the component — do not approximate it with custom styling.

## Design tokens used

| Token | Usage |
|-------|-------|
| `--ds-control-surface` | Checkbox background |
| `--ds-control-outline` | Checkbox border |
| `--ds-control-on-surface` | Checkmark color |
| `--ds-control-disabled-surface` | Background when disabled |
| `--ds-control-disabled-outline` | Border when disabled |
| `--ds-control-error-surface` | Background in error state |
| `--ds-control-error-outline` | Border in error state |
| `--ds-focus-ring` | Focus ring on keyboard navigation |
