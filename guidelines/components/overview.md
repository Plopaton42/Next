# Components overview

Use this file to select the right component before reading its detailed docs.

## Component catalog

| Component | Alt names | Purpose | Guideline |
|-----------|-----------|---------|-----------|
| Button | CTA, action | Any user action — submit, navigate, trigger | `button.md` |
| Checkbox | Toggle, check | Boolean on/off selection with label | `checkbox.md` |
| SplitButton | Dropdown button | Primary action + related secondary actions | `splitbutton.md` |

## Component selection decision tree

```
What does the user need to do?
│
├─ Trigger an action (submit, save, delete, navigate)
│  └─ → Button
│     ├─ One clear primary action? → type="primary"
│     ├─ Supporting / secondary action? → type="secondary" or type="ghost"
│     └─ Action destroys data? → add intent="destructive"
│
├─ Toggle a boolean setting (on/off, agree/disagree)
│  └─ → Checkbox
│
└─ Trigger an action with multiple related variants
   └─ → SplitButton
      Example: "Save" + ["Save as draft", "Save and publish"]
```

## Common props shared by all components

| Prop | Type | Applies to |
|------|------|-----------|
| `disabled` | `boolean` | Button, Checkbox, SplitButton |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | Button, SplitButton |
| `className` | `string` | All components |

## Import pattern (React)

```tsx
{/* CORRECT — import from /react subpath */}
import { Button, Checkbox, SplitButton } from '@plopaton42/design-system/react'

{/* WRONG — do not import from root */}
import { Button } from '@plopaton42/design-system'
```
