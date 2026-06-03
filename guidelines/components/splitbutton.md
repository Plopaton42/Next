# SplitButton

A two-part button: a main action + a dropdown trigger for related secondary actions.

## Import

```tsx
import { SplitButton } from '@plopaton42/design-system/react'
import type { SplitButtonItem } from '@plopaton42/design-system/react'
import '@plopaton42/design-system/style.css'
```

## When to use SplitButton vs Button

```
Is there ONE primary action with multiple related variants?
│
├─ Yes → SplitButton
│  Examples:
│  "Save" + ["Save as draft", "Save and publish", "Save and close"]
│  "Send" + ["Send now", "Schedule send", "Save as template"]
│
└─ No → Button
   ├─ Single action with no variants → plain Button
   └─ Multiple equally important actions → Button + separate menu component
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
| `className` | `string` | — | Additional CSS classes |

## SplitButtonItem type

```ts
interface SplitButtonItem {
  label: string      // Display text in the dropdown
  value: string      // Unique identifier passed to onSelect
  disabled?: boolean // Disable individual item
}
```

## Usage examples

```tsx
{/* CORRECT — basic usage */}
const saveItems: SplitButtonItem[] = [
  { label: 'Save as draft', value: 'draft' },
  { label: 'Save and publish', value: 'publish' },
  { label: 'Save and close', value: 'close' },
]

<SplitButton
  items={saveItems}
  onClick={() => handleSave('default')}
  onSelect={(item) => handleSave(item.value)}
>
  Save
</SplitButton>

{/* CORRECT — secondary type */}
<SplitButton
  type="secondary"
  items={exportItems}
  onClick={handleExport}
  onSelect={(item) => handleExport(item.value)}
>
  Export
</SplitButton>

{/* CORRECT — with a disabled item in the dropdown */}
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

{/* WRONG — using SplitButton for unrelated actions */}
<SplitButton
  items={[
    { label: 'Delete', value: 'delete' },
    { label: 'Archive', value: 'archive' },
    { label: 'Share', value: 'share' },
  ]}
  onClick={handleClick}
  onSelect={handleSelect}
>
  Save
</SplitButton>
{/* These actions (delete, archive, share) are unrelated to "Save" — use separate Buttons */}
```

## Keyboard navigation

| Key | Action |
|-----|--------|
| `Tab` | Focus main button, then dropdown trigger |
| `Enter` / `Space` | Open dropdown when trigger is focused |
| `ArrowDown` / `ArrowUp` | Navigate items in open dropdown |
| `Enter` | Select focused dropdown item |
| `Escape` | Close dropdown without selecting |

## Design tokens used

| Token | Usage |
|-------|-------|
| `--ds-button-{type}-surface` | Button background |
| `--ds-button-{type}-on-surface` | Text and icon color |
| `--ds-button-{type}-outline` | Divider between button and trigger |
| `--ds-default-surface` | Dropdown menu background |
| `--ds-default-on-surface` | Dropdown item text color |
| `--ds-focus-ring` | Focus ring on keyboard navigation |
