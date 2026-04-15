# Button

Primary interactive element. Supports 6 visual types, 2 intents, 5 sizes,
leading/trailing icon slots, and an icon-only square layout.

**Figma:** [Button — node 17187:1090](https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17187-1090&m=dev)

---

## Usage

```vue
<!-- Basic -->
<Button>Label</Button>

<!-- With leading icon -->
<Button type="primary" size="lg">
  <template #leading><IconPlus /></template>
  Add item
</Button>

<!-- With trailing icon -->
<Button type="secondary">
  Continue
  <template #trailing><IconArrowRight /></template>
</Button>

<!-- Icon only (always provide aria-label) -->
<Button type="primary" :icon-only="true" aria-label="Add item">
  <IconPlus />
</Button>

<!-- Destructive primary -->
<Button type="primary" intent="destructive">Delete account</Button>

<!-- As anchor -->
<Button tag="a" href="/path">Go somewhere</Button>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'primary' \| 'secondary' \| 'tertiary' \| 'outlined' \| 'ghost' \| 'inverted'` | `'primary'` | Visual style — maps to Figma "type" prop |
| `intent` | `'default' \| 'destructive'` | `'default'` | Color intent — `destructive` only affects `primary` and `outlined` types |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'md'` | Size variant |
| `disabled` | `boolean` | `false` | Disabled state — visually dimmed, interaction blocked |
| `iconOnly` | `boolean` | `false` | Square icon-only layout; switches to icon-only padding |
| `tag` | `'button' \| 'a'` | `'button'` | Root HTML element |
| `nativeType` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native `<button>` type (ignored when `tag="a"`) |

---

## Emits

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Emitted on click (not emitted when disabled) |

---

## Slots

| Slot | Description |
|---|---|
| `default` | Button label text, or the centered icon when `iconOnly=true` |
| `leading` | Icon placed before the label |
| `trailing` | Icon placed after the label |

> **Icon-only:** Place the icon in the `default` slot and add `aria-label` to the button. The `leading`/`trailing` slots are ignored when `iconOnly=true`.

---

## Types

| Value | Description |
|---|---|
| `primary` | Filled — main CTA (blue surface) |
| `secondary` | Tinted light blue — secondary action |
| `tertiary` | Neutral light background — low emphasis |
| `outlined` | Transparent with periwinkle border |
| `ghost` | Transparent, no border at rest, border appears on hover |
| `inverted` | Dark (periwinkle-800) background — for use on dark surfaces |

## Intents

| Value | Affected types | Description |
|---|---|---|
| `default` | all | Standard brand palette |
| `destructive` | `primary`, `outlined` | Red palette for irreversible actions |

---

## Sizes

| Size | Height | Font | Icon |
|---|---|---|---|
| `sm` | 32px | 14px | 16px |
| `md` | 40px | 14px | 20px |
| `lg` | 48px | 16px | 24px |
| `xl` | 56px | 18px | 28px |
| `xxl` | 64px | 20px | 32px |

---

## Design Tokens Used

### Control (sizing)
| Token | CSS var |
|---|---|
| `button.control.min-height.*` | `--ds-button-control-min-height-{size}` |
| `button.control.padding-px.*` | `--ds-button-control-padding-px-{size}` |
| `button.control.padding-py.*` | `--ds-button-control-padding-py-{size}` |
| `button.control.padding-icon-only-px.*` | `--ds-button-control-padding-icon-only-px-{size}` |
| `button.control.padding-icon-only-py.*` | `--ds-button-control-padding-icon-only-py-{size}` |
| `button.control.space-between.*` | `--ds-button-control-space-between-{size}` |
| `button.control.radius.*` | `--ds-button-control-radius-{size}` |
| `button.control.icon-size.*` | `--ds-button-control-icon-size-{size}` |
| `button.control.border-default.*` | `--ds-button-control-border-default-{size}` |
| `button.control.border-hover.*` | `--ds-button-control-border-hover-{size}` |
| `button.control.border-style.*` | `--ds-button-control-border-style-{size}` |

### Colours (semantic, per type)
| Token | CSS var |
|---|---|
| `button.primary.surface` | `--ds-button-primary-surface` |
| `button.primary.surface-hover` | `--ds-button-primary-surface-hover` |
| `button.primary.on-surface` | `--ds-button-primary-on-surface` |
| `button.primary.border` | `--ds-button-primary-border` |
| `button.secondary.surface` | `--ds-button-secondary-surface` |
| `button.secondary.surface-hover` | `--ds-button-secondary-surface-hover` |
| `button.secondary.on-surface` | `--ds-button-secondary-on-surface` |
| `button.secondary.border-hover` | `--ds-button-secondary-border-hover` |
| `button.tertiary.surface` | `--ds-button-tertiary-surface` |
| `button.tertiary.surface-hover` | `--ds-button-tertiary-surface-hover` |
| `button.tertiary.on-surface` | `--ds-button-tertiary-on-surface` |
| `button.tertiary.border-hover` | `--ds-button-tertiary-border-hover` |
| `button.outlined.surface` | `--ds-button-outlined-surface` |
| `button.outlined.surface-hover` | `--ds-button-outlined-surface-hover` |
| `button.outlined.on-surface` | `--ds-button-outlined-on-surface` |
| `button.outlined.border` | `--ds-button-outlined-border` |
| `button.ghost.surface` | `--ds-button-ghost-surface` |
| `button.ghost.surface-hover` | `--ds-button-ghost-surface-hover` |
| `button.ghost.border-hover` | `--ds-button-ghost-border-hover` |
| `button.inverted.surface` | `--ds-button-inverted-surface` |
| `button.inverted.surface-hover` | `--ds-button-inverted-surface-hover` |
| `button.inverted.on-surface` | `--ds-button-inverted-on-surface` |
| `button.destructive.primary-surface` | `--ds-button-destructive-primary-surface` |
| `button.destructive.primary-surface-hover` | `--ds-button-destructive-primary-surface-hover` |
| `button.destructive.primary-on-surface` | `--ds-button-destructive-primary-on-surface` |
| `button.destructive.outlined-surface` | `--ds-button-destructive-outlined-surface` |
| `button.destructive.outlined-surface-hover` | `--ds-button-destructive-outlined-surface-hover` |
| `button.destructive.outlined-on-surface` | `--ds-button-destructive-outlined-on-surface` |
| `button.destructive.outlined-border` | `--ds-button-destructive-outlined-border` |

### Typography
| Token | CSS var |
|---|---|
| `font.family.sans` | `--ds-font-family-sans` |
| `font.weight.bold` | `--ds-font-weight-bold` |
| `font.size.sm` | `--ds-font-size-sm` (sm/md buttons) |
| `font.size.base` | `--ds-font-size-base` (lg buttons) |
| `font.size.lg` | `--ds-font-size-lg` (xl buttons) |
| `font.size.xl` | `--ds-font-size-xl` (xxl buttons) |
| `font.lineHeight.normal` | `--ds-font-line-height-normal` |

---

## Accessibility

- Uses semantic `<button>` by default; supports `<a>` via `tag="a"`.
- `disabled` on `<button>` blocks interaction natively; `<a>` uses `aria-disabled="true"`, `tabindex="-1"`, and `pointer-events: none`.
- Icon-only buttons **must** receive `aria-label` from the parent.
- Icon slots are wrapped with `aria-hidden="true"` to avoid redundant announcements.
- Focus ring uses `focus-visible` (keyboard-only) with `--ds-focus-ring-width` and `--ds-input-input-outline-variant` tokens.
- Colour is never the sole indicator of state — shape, text, and interactive affordances are always present.

---

## Known Deviations from Figma

| Item | Figma value | Implementation | Reason |
|---|---|---|---|
| Ghost on-surface | `--button/outlined/on-surface` (periwinkle-700) | `--ds-button-outlined-on-surface` | Semantic token `button.ghost.on-surface` = white; white text is invisible on light backgrounds. Figma visual confirms dark text. |
| Button shadows | `button/default` / `button/default-alt` effect styles | Hardcoded `rgba` values | Shadow effects are not yet tokenised in `tokens/source/shadows.json`. |
| Line-height | 20px (sm/md), 24px (lg/xl), 26px (xxl) | `--ds-font-line-height-normal` (1.5) | No button-specific line-height tokens exist. Height is controlled by `min-height` + padding tokens; visual impact is negligible. |

---

## Changelog

### 2026-04-15 — Initial implementation
- Added `Button` component with 6 types × 2 intents × 5 sizes
- States: default, hover, focus, disabled
- Slots: `default` (label / icon-only), `leading`, `trailing`
- Supports `tag="a"` for link buttons
- Icon-only mode via `iconOnly` prop
