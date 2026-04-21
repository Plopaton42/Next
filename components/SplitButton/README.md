# SplitButton

A two-part interactive element: a main action button on the left and a dropdown trigger (chevron) on the right. Both parts share the same visual style and are semantically grouped.

**Figma:** No Figma component yet — update once added to the library.

---

## Usage

```vue
<SplitButton
  type="primary"
  :items="[
    { label: 'Enregistrer comme brouillon', value: 'draft' },
    { label: 'Planifier', value: 'schedule' },
    { label: 'Archiver', value: 'archive', disabled: true },
  ]"
  @click="onPublish"
  @select="onMenuSelect"
>
  Publier
</SplitButton>

<!-- With leading icon -->
<SplitButton type="secondary" :items="items" @click="save" @select="onSelect">
  <template #leading><IconSave /></template>
  Enregistrer
</SplitButton>

<!-- Pill shape -->
<SplitButton type="primary" :rounded="true" :items="items">Publier</SplitButton>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'primary' \| 'secondary' \| 'tertiary' \| 'outlined'` | `'primary'` | Visual style (`ghost` exclu — le split serait visuellement ambigu sans bordure visible) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'md'` | Size variant |
| `disabled` | `boolean` | `false` | Disables both main action and dropdown trigger |
| `rounded` | `boolean` | `false` | Pill / fully-rounded corners |
| `items` | `SplitButtonItem[]` | — | Array of dropdown menu items |
| `triggerLabel` | `string` | `'Plus d\'options'` | Accessible label for the chevron trigger (`aria-label`) |

### SplitButtonItem

```ts
interface SplitButtonItem {
  label: string;    // Display text
  value: string;    // Unique identifier emitted on select
  disabled?: boolean;
}
```

---

## Emits

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Fired when the main action area is clicked |
| `select` | `SplitButtonItem` | Fired when a dropdown item is selected |

---

## Slots

| Slot | Description |
|---|---|
| `default` | Main action label text |
| `leading` | Icon placed before the label in the main action area |

---

## Architecture

```
<div> ← Outer wrapper: no overflow, shows outline focus ring
  <div> ← Inner wrapper: overflow:hidden + box-shadow border + border-radius
    <button> ← Main action
    <span>   ← 1px vertical divider (opacity 20%)
    <button> ← Dropdown trigger (chevron, width = min-height)
  </div>
</div>
<Teleport to="body">
  <ul role="menu"> ← Dropdown, fixed-positioned via getBoundingClientRect()
    <li role="menuitem"> ← Per item
  </ul>
</Teleport>
```

The two-wrapper strategy ensures the CSS `outline` focus ring is never clipped by `overflow:hidden`.

---

## Keyboard Navigation

| Key | Action |
|---|---|
| `Tab` | Move between main button and trigger |
| `Enter` / `Space` on trigger | Toggle dropdown |
| `ArrowDown` / `ArrowUp` | Navigate menu items |
| `Enter` / `Space` on item | Select item, close menu |
| `Escape` | Close menu, return focus to trigger |
| `Tab` (in menu) | Close menu |

---

## Design Tokens Used

### Control (sizing) — same as Button
| Token | CSS var |
|---|---|
| `button.control.min-height.*` | `--ds-button-control-min-height-{size}` |
| `button.control.padding-px.*` | `--ds-button-control-padding-px-{size}` |
| `button.control.padding-py.*` | `--ds-button-control-padding-py-{size}` |
| `button.control.space-between.*` | `--ds-button-control-space-between-{size}` |
| `button.control.radius.*` | `--ds-button-control-radius-{size\|rounded}` |
| `button.control.icon-size.*` | `--ds-button-control-icon-size-{size}` |

### Colours — same as Button
| Token | CSS var |
|---|---|
| `button.{type}.surface` | `--ds-button-{type}-surface` |
| `button.{type}.surface-hover` | `--ds-button-{type}-surface-hover` |
| `button.{type}.on-surface` | `--ds-button-{type}-on-surface` |
| `default.surface-disabled` | `--ds-default-surface-disabled` |
| `default.on-surface-disabled` | `--ds-default-on-surface-disabled` |

### Dropdown menu
| Token | CSS var |
|---|---|
| `default.surface` | `--ds-default-surface` |
| `default.border` | `--ds-default-border` |
| `default.on-surface` | `--ds-default-on-surface` |
| `default.surface-alt` | `--ds-default-surface-alt` |

### Focus ring
| Token | CSS var |
|---|---|
| `global.ring-focus` | `--ds-global-ring-focus` |

---

## Accessibility

- The two buttons are wrapped in a `<div>` which acts as the group container.
- The trigger has `aria-haspopup="menu"` and `aria-expanded`.
- The dropdown uses `role="menu"` with `role="menuitem"` per item.
- Disabled items have `aria-disabled="true"` and `tabindex="-1"`.
- The entire group shows a shared focus ring via `outline` on the outer wrapper.
- Keyboard navigation is fully implemented (arrows, enter, escape, tab).

---

## Changelog

### 2026-04-21 — Initial implementation
- Created SplitButton component with full keyboard navigation
- Supports all Button types (primary, secondary, tertiary, outlined, ghost)
- All 5 sizes, disabled state, rounded (pill) variant
- Leading icon slot on main action
- Dropdown teleported to `<body>` for correct stacking
- Focus ring via two-wrapper strategy (not clipped by overflow:hidden)
- Stories: Playground, AllTypes, AllSizes, WithLeadingIcon, Rounded, Disabled, WithDisabledItems
