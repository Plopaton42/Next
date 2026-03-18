# CheckboxRoad2

Figma: `https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17015-4309&m=dev`

Fresh implementation — checkmark/dash drawn with inline SVG (no external assets), CSS custom properties with hardcoded fallbacks so the component renders correctly even before `build:tokens` runs.

## Usage

```vue
<CheckboxRoad2 label="Newsletter" />
<CheckboxRoad2 label="Checked" :checked="true" />
<CheckboxRoad2 label="Error" state="Error" error-message="Required" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Checked state |
| `indeterminate` | `boolean` | `false` | Indeterminate state (overrides checked visually) |
| `state` | `"Default" \| "Hover" \| "Focus" \| "Disabled" \| "Error"` | `"Default"` | Visual state |
| `withContent` | `boolean` | `true` | Show label + helper area |
| `label` | `string` | `"Label"` | Primary label text |
| `showSecondaryLabel` | `boolean` | `false` | Show secondary label |
| `secondaryLabel` | `string` | `"(1)"` | Secondary label text |
| `showHelper` | `boolean` | `true` | Show helper text |
| `helperText` | `string` | `"Helper"` | Helper text content |
| `errorMessage` | `string` | `"Error"` | Error message (shown when `state="Error"`) |

## Emits

None — controlled externally via props.

## Design tokens used

| Token | CSS var | Fallback |
|---|---|---|
| Surface | `--ds-surface-surface` | `#ffffff` |
| Surface disabled | `--ds-surface-surface-disabled` | `rgba(137,143,160,0.24)` |
| On surface | `--ds-surface-on-surface` | `#11151d` |
| On surface weak | `--ds-surface-on-surface-weak` | `#51586c` |
| Input surface (fill) | `--ds-input-input-surface` | `#0071dc` |
| Input surface variant | `--ds-input-input-surface-variant` | `#004293` |
| Input outline | `--ds-input-input-outline` | `#6d7488` |
| Input outline variant | `--ds-input-input-outline-variant` | `#004293` |
| Danger outline | `--ds-danger-danger-outline` | `#b2392b` |
| On danger surface | `--ds-danger-on-danger-surface` | `#6b221a` |

## Accessibility

- `<button role="checkbox">` with `aria-checked` (`true` / `false` / `mixed`)
- `aria-disabled` set when `state="Disabled"`
- All icons have `aria-hidden="true"`

## Changelog

- **2026-03-18**: Initial implementation. Inline SVG icons, CSS var fallbacks, no external asset dependencies.

## Fidelity check

| Item | Figma | Implementation | Match |
|---|---|---|---|
| Box size | 20×20px | `width/height: 20px` | ✅ |
| Border radius | 4px | `border-radius: 4px` | ✅ |
| Gap checkbox↔content | 12px | `gap: 12px` | ✅ |
| Label size/weight/lh | 16px / 400 / 1.5 | inline style | ✅ |
| Helper size/weight/lh | 14px / 400 / 1.5 | inline style | ✅ |
| Content vertical gap | 2px | `gap: 2px` | ✅ |
| Focus ring size | 26×26px | `width/height: 26px` | ✅ |
| Focus ring radius | 7px | `border-radius: 7px` | ✅ |
| Unchecked border | `#6d7488` | `--ds-input-input-outline` | ✅ |
| Hover border | `#004293` | `--ds-input-input-outline-variant` | ✅ |
| Checked fill | `#0071dc` | `--ds-input-input-surface` | ✅ |
| Checked hover fill | `#004293` | `--ds-input-input-surface-variant` | ✅ |
| Disabled bg | `rgba(137,143,160,0.24)` | `--ds-surface-surface-disabled` | ✅ |
| Error border | `#b2392b` | `--ds-danger-danger-outline` | ✅ |
| Error text | `#6b221a` | `--ds-danger-on-danger-surface` | ✅ |
| Font | DM Sans | `font-family: 'DM Sans', sans-serif` | ✅ |
| Checkmark | White SVG | Inline SVG path | ✅ |
| Dash | White SVG | Inline SVG path | ✅ |
