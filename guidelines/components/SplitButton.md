# SplitButton

Two-part button: a main action button + a dropdown trigger for related secondary actions. Use when a primary action has multiple related variants.

## Import

```tsx
import { SplitButton } from '@plopaton42/design-system/react'
import type { SplitButtonItem } from '@plopaton42/design-system/react'
```

## When to use

```
Is there ONE primary action with multiple secondary variants?
└── Yes → SplitButton

Examples:
  "Save" + ["Save as draft", "Save and publish", "Save and close"]
  "Send" + ["Send now", "Schedule send", "Save as template"]

Is there a list of equally important actions?
└── No → use a regular Button + separate menu component instead
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'primary' \| 'secondary' \| 'tertiary' \| 'outlined'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disables the entire component |
| `rounded` | `boolean` | `false` | Pill shape |
| `items` | `SplitButtonItem[]` | required | Dropdown menu items |
| `triggerLabel` | `string` | — | Accessible label for the dropdown trigger |
| `onClick` | `() => void` | — | Main button click handler |
| `onSelect` | `(item: SplitButtonItem) => void` | — | Called when a dropdown item is selected |
| `children` | `ReactNode` | — | Main button label |

## SplitButtonItem type

```ts
interface SplitButtonItem {
  label: string     // Display text in dropdown
  value: string     // Unique identifier passed to onSelect
  disabled?: boolean
}
```

## Examples

```tsx
const saveItems: SplitButtonItem[] = [
  { label: 'Save as draft', value: 'draft' },
  { label: 'Save and publish', value: 'publish' },
  { label: 'Save and close', value: 'close' },
]

// Basic usage
<SplitButton
  items={saveItems}
  onClick={() => handleSave('default')}
  onSelect={(item) => handleSave(item.value)}
>
  Save
</SplitButton>

// Secondary type
<SplitButton
  type="secondary"
  items={exportItems}
  onClick={handleExport}
  onSelect={(item) => handleExport(item.value)}
>
  Export
</SplitButton>

// Disabled
<SplitButton items={items} disabled onClick={handleAction}>
  Action unavailable
</SplitButton>

// With disabled item in dropdown
<SplitButton
  items={[
    { label: 'Available action', value: 'a' },
    { label: 'Unavailable', value: 'b', disabled: true },
  ]}
  onClick={handleClick}
  onSelect={handleSelect}
>
  Actions
</SplitButton>
```

## Keyboard navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus main button, then dropdown trigger |
| `Enter` / `Space` | Open dropdown (when trigger focused) |
| `ArrowDown` / `ArrowUp` | Navigate items in open dropdown |
| `Enter` | Select focused dropdown item |
| `Escape` | Close dropdown |

## Design tokens used

| Token | Usage |
|-------|-------|
| `--ds-button-{type}-surface` | Button background |
| `--ds-button-{type}-on-surface` | Text and icon color |
| `--ds-button-{type}-outline` | Divider between button and trigger |
| `--ds-default-surface` | Dropdown menu background |
| `--ds-default-on-surface` | Dropdown item text |
| `--ds-focus-ring` | Focus ring on keyboard navigation |
