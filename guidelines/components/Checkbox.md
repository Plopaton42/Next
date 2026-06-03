# Checkbox

Interactive checkbox with label and helper text. Supports controlled/uncontrolled and indeterminate state.

## Import

```tsx
import { Checkbox } from '@plopaton42/design-system/react'
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Checked state |
| `indeterminate` | `boolean` | `false` | Indeterminate (partial selection) |
| `state` | `'Default' \| 'Hover' \| 'Focus' \| 'Disabled' \| 'Error'` | `'Default'` | Visual state |
| `label` | `string` | — | Primary label text |
| `secondaryLabel` | `string` | — | Secondary label (shown next to primary) |
| `showSecondaryLabel` | `boolean` | `false` | Show/hide secondary label |
| `helperText` | `string` | — | Helper text below the checkbox |
| `showHelper` | `boolean` | `false` | Show/hide helper text |
| `errorMessage` | `string` | — | Error message (used when `state="Error"`) |
| `withContent` | `boolean` | `false` | Whether label content is present |
| `onChange` | `(checked: boolean) => void` | — | Change handler |

## When to use which state

```
state="Default"   → normal, interactive checkbox
state="Disabled"  → user cannot interact (not just visually muted)
state="Error"     → form validation failed, show errorMessage
state="Hover"     → (usually managed by CSS, not set manually)
state="Focus"     → (usually managed by CSS, not set manually)
```

## Examples

```tsx
// Basic checkbox
<Checkbox
  label="I agree to the terms and conditions"
  onChange={(checked) => setAgreed(checked)}
/>

// With helper text
<Checkbox
  label="Subscribe to newsletter"
  helperText="Weekly digest, unsubscribe anytime"
  showHelper
  onChange={setSubscribed}
/>

// Error state
<Checkbox
  label="Accept terms"
  state="Error"
  errorMessage="You must accept the terms to continue"
  onChange={setValue}
/>

// Disabled
<Checkbox
  label="This option is unavailable"
  state="Disabled"
  checked={false}
/>

// Indeterminate — "select all" pattern
<Checkbox
  label="Select all items"
  indeterminate={someChecked && !allChecked}
  checked={allChecked}
  onChange={toggleSelectAll}
/>

// Secondary label
<Checkbox
  label="Priority"
  secondaryLabel="(optional)"
  showSecondaryLabel
  onChange={setPriority}
/>
```

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
