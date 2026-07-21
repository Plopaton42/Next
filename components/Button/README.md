# Button

Primary interactive element. Supports 6 visual types, 3 intents, 5 sizes,
leading/trailing icon slots, and an icon-only square layout.

Available in **Vue 3** (`Button.vue`) and **React** (`Button.tsx`).

**Figma:** [Button — node 17187:1090](https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17187-1090&m=dev)

---

## Usage

### Vue

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

<!-- Destructive secondary -->
<Button type="secondary" intent="destructive">Cancel</Button>

<!-- Alternative brand (orange) -->
<Button type="tertiary" intent="alternative">Brand action</Button>

<!-- As anchor -->
<Button tag="a" href="/path">Go somewhere</Button>
```

### React

```tsx
import { Button } from '@next/design-system/react';

// Basic
<Button>Label</Button>

// With leading icon
<Button type="primary" size="lg" leadingIcon={<IconPlus />}>Add item</Button>

// With trailing icon
<Button type="secondary" trailingIcon={<IconArrowRight />}>Continue</Button>

// Icon only (always provide aria-label)
<Button type="primary" iconOnly aria-label="Add item"><IconPlus /></Button>

// Destructive
<Button type="primary" intent="destructive">Delete account</Button>

// As anchor
<Button tag="a" href="/path">Go somewhere</Button>
```

#### Vue → React API mapping

| Vue slot / API | React equivalent |
|---|---|
| `<slot>` (default) | `children` |
| `<slot name="leading">` | `leadingIcon` prop (`ReactNode`) |
| `<slot name="trailing">` | `trailingIcon` prop (`ReactNode`) |
| `@click` | `onClick` |
| All other props | Identical name and type |

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'primary' \| 'secondary' \| 'tertiary' \| 'outlined' \| 'ghost' \| 'inverted'` | `'primary'` | Visual style — maps to Figma "type" prop |
| `intent` | `'default' \| 'destructive' \| 'alternative'` | `'default'` | Color intent — see Intent mapping table below |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'md'` | Size variant |
| `disabled` | `boolean` | `false` | Disabled state — neutral gray appearance via `color.scene.default.surface-disabled` and `on-surface-disabled` tokens, interaction blocked |
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
| `destructive` | `primary`, `secondary` | Red palette for irreversible actions. `destructive` + `outlined`/`tertiary`/`ghost`/`inverted` have no Component tokens in Figma and fall back to the base type's default-intent styling. |
| `alternative` | `primary`, `secondary`, `tertiary` | Alternative palette — tertiary maps to brand/orange tokens. Always renders pill-shaped (forces `radius.rounded`). |

### Intent × Type → Token Mapping

| Intent | Type | Token prefix | Surface color |
|---|---|---|---|
| default | primary | `primary` | blue-700 |
| default | secondary | `secondary` | blue-50 |
| default | tertiary | `tertiary` | neutral-100 |
| default | outlined | `outlined` | transparent |
| default | ghost | `ghost` | transparent |
| default | inverted | `inverted` | periwinkle-800 |
| destructive | primary | `destructive-primary` | red-700 |
| destructive | secondary | `destructive-secondary` | red-50 (own tokens — no longer reuses outlined) |
| alternative | primary | `primary` (borrowed — see below) | blue-700 |
| alternative | secondary | `alternative-secondary` | blue-50 |
| alternative | tertiary | `alternative-brand` | orange (brand secondary) |

> `alternative` + `primary` aliases the exact same `action.primary.*` semantic
> tokens as base `primary`, including hover/active — Figma only gives it its
> own `surface`/`on-surface` component tokens, so the component borrows
> primary's interaction tokens rather than falling back to a flat rest state.

### Interaction states (hover / active)

Every non-outlined type now has a real Figma-authored **press** state, not an
approximated scale transform:

| Family | Types | Hover | Press (`:active`) |
|---|---|---|---|
| Filled | `primary`, `destructive-primary` (+ `alternative`+`primary`) | `surface-hover` fill | `surface-active` fill |
| Outlined | `outlined` | tint fill appears | same as hover (no distinct token) |
| Ghost | `ghost` | light fill appears | fill stays + `border-pressed` ring |
| Subtle | `secondary`, `tertiary`, `inverted`, `alternative-secondary`, `alternative-brand`, `destructive-secondary` | `surface-hover` fill | fill stays + `border-pressed`/`border-active` ring |

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

Tokens now flow through the 3-tier pipeline documented in
`tokens/source/{primitives,semantic,components}.json`:
Component (`button.*`) → Semantic (`action.*`) → Primitive. Never bind a
color directly to a Primitive from this component.

### Control (sizing) — `tokens/source/components.json` → `button.[control].*`
| Token | CSS var |
|---|---|
| `button.[control].min-height.*` | `--ds-button-control-min-height-{size}` |
| `button.[control].padding.default.px.*` | `--ds-button-control-padding-default-px-{size}` |
| `button.[control].padding.default.py.*` | `--ds-button-control-padding-default-py-{size}` |
| `button.[control].padding.icon-only.px.*` | `--ds-button-control-padding-icon-only-px-{size}` |
| `button.[control].padding.icon-only.py.*` | `--ds-button-control-padding-icon-only-py-{size}` |
| `button.[control].space-between.*` | `--ds-button-control-space-between-{size}` |
| `button.[control].radius.*` | `--ds-button-control-radius-{size}` |
| `button.[control].icon.number.*` | `--ds-button-control-icon-number-{size}` |
| `button.[control].border-size.default.*` | `--ds-button-control-border-size-default-{size}` |
| `button.[control].border-size.pressed.*` | `--ds-button-control-border-size-pressed-{size}` |
| `button.[control].border-size.style.*` | `--ds-button-control-border-size-style-{size}` |

### Colours (per type, aliasing `action.*` semantic tokens)
| Token | CSS var |
|---|---|
| `button.{type}.surface` | `--ds-button-{type}-surface` |
| `button.{type}.surface-hover` | `--ds-button-{type}-surface-hover` |
| `button.{type}.surface-active` (primary, destructive-primary only) | `--ds-button-{type}-surface-active` |
| `button.{type}.on-surface` | `--ds-button-{type}-on-surface` |
| `button.primary.border` | `--ds-button-primary-border` (shared by every "filled" family type) |
| `button.outlined.border` | `--ds-button-outlined-border` |
| `button.{type}.border-pressed` / `.border-active` | `--ds-button-{type}-border-pressed` / `-border-active` |
| `button.destructive.primary.*` | `--ds-button-destructive-primary-*` |
| `button.destructive.secondary.*` | `--ds-button-destructive-secondary-*` |
| `button.alternative.secondary.*` | `--ds-button-alternative-secondary-*` |
| `button.alternative.brand.*` | `--ds-button-alternative-brand-*` |

### Pill radius (`intent="alternative"` only — not a standalone prop)
| Token | CSS var |
|---|---|
| `button.[control].radius.rounded` | `--ds-button-control-radius-rounded` (999px) |

### Disabled state (universal, overrides any type)
| Token | CSS var |
|---|---|
| `color.scene.default.surface-disabled` | `--ds-color-scene-default-surface-disabled` |
| `color.scene.default.on-surface-disabled` | `--ds-color-scene-default-on-surface-disabled` |

### Focus ring
| Token | CSS var | Value |
|---|---|---|
| `color.focus.ring` | `--ds-color-focus-ring` | periwinkle-200 (#9fbfff) |

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
- Focus ring uses `focus-visible` (keyboard-only) with a 3px white gap + 3px periwinkle ring via box-shadow composition, matching the Figma `button/focus` effect style.
- Colour is never the sole indicator of state — shape, text, and interactive affordances are always present.

---

## Known Deviations from Figma

| Item | Figma value | Implementation | Reason |
|---|---|---|---|
| Ghost on-surface | `action.ghost.on-surface` (white) | `--ds-button-outlined-on-surface` (periwinkle-700) | Semantic token is white; white text is invisible on light backgrounds. Figma visual confirms dark text. |
| Button shadows | `utilities-style/button` / `utilities-style/button-alt` **Effect Styles** | Hardcoded `rgba` values | Effect Styles are not exposed via the Figma Variables API (different endpoint) — not yet exported by this token pipeline. |
| Line-height | 20px (sm/md), 24px (lg/xl), 26px (xxl) per `button/button-{size}` **Text Style** | `--ds-font-line-height-normal` (1.5) | Text Styles are not exposed via the Variables API either — same limitation as shadows. |

Fixed in this pass: `alternative` + `primary` hover/active now correctly
borrows `button.primary.surface-hover`/`surface-active` (previously fell back
to a flat rest surface, since Figma's own `button.alternative.primary` token
family only defines `surface`/`on-surface`).

---

## Changelog

### 2026-07-07 — Fix press animation, ghost rest border, inverted demo, drop non-Figma `rounded` prop
- Restored the `active:scale-[0.97]` tactile press feedback alongside the new
  color-driven `:active` state (was dropped by mistake in the token migration)
- Fixed `ghost` showing a faint hairline border at rest/hover — it now shares
  no shadow with the "subtle" family and stays fully transparent until `:active`
- Fixed the `Inverted` story decorator using the exact same surface token as
  the button itself, making the button invisible against its own demo
  backdrop — now uses `button.inverted.surface-hover` for contrast
- **Removed the `rounded` boolean prop** — it has no corresponding Figma
  variant (Button's real properties are `intent`/`size`/`type`/`state`/
  `icon only` only). Pill radius remains fully automatic via
  `intent="alternative"`; removed the `Rounded` story and `rounded` argType

### 2026-07-07 — Migrate to 3-tier token pipeline, real active states, drop destructive+outlined
- Retokenized from the flat `semantic/norauto.json` `button.*` block to the
  Component (`button.*`) → Semantic (`action.*`) → Primitive pipeline in
  `tokens/source/{primitives,semantic,components}.json`, extracted directly
  from the Figma Variables API (see repo-level token migration commit)
- `destructive` + `secondary` now has its own real tokens (light red fill) —
  no longer reuses `outlined` tokens
- `destructive` + `outlined` removed — no longer has Component tokens in
  Figma; falls back to the base type's default-intent styling
- Added a real `:active`/press visual state driven by Figma tokens
  (`surface-active` for primary/destructive-primary, `border-pressed`/
  `border-active` ring for every other interactive type) — replaces the
  approximated `active:scale-[0.97]` transform
- `alternative` + `primary` now borrows `primary`'s hover/active tokens
  instead of falling back to a flat rest surface (fixes a documented deviation)
- Renamed CSS custom properties to match the new Figma structure:
  `--ds-button-control-icon-size-*` → `--ds-button-control-icon-number-*`;
  `--ds-button-control-padding-{px,py}-*` → `--ds-button-control-padding-default-{px,py}-*`;
  `--ds-button-control-border-{default,style}-*` → `--ds-button-control-border-size-{default,style}-*`;
  `--ds-button-control-border-hover-*` → `--ds-button-control-border-size-pressed-*`;
  `--ds-default-surface-disabled`/`--ds-default-on-surface-disabled` → `--ds-color-scene-default-surface-disabled`/`-on-surface-disabled`;
  `--ds-global-ring-focus` → `--ds-color-focus-ring`
- Updated `SplitButton.vue`/`.tsx` to the same renamed CSS vars

### 2026-04-21 — Auto-round alternative intent (Figma-driven)
- `intent="alternative"` now automatically uses `button.control.radius.rounded` (999px / pill)
- No prop change needed — `rounded` prop still works as explicit override on any intent
- Updated Alternative story to show pill shape without `:rounded="true"`

### 2026-04-21 — Add rounded prop for pill radius
- Added `rounded` boolean prop that switches radius to `button.control.radius.rounded` (999px / `radius-full`)
- Works on any `type` × `intent` × `size` combination
- Preserved in disabled state
- Added `Rounded` story and `rounded` argType in Playground

### 2026-04-21 — Fix disabled state to use Figma tokens
- Replaced `opacity-40` on the root element with `default/surface-disabled` (background) and `default/on-surface-disabled` (text/icon) tokens
- Disabled state now renders as a brand-neutral gray regardless of `type` or `intent`, matching Figma exactly
- Shadow is removed in disabled state (Figma shows no shadow)
- Replaced `cursor-default` with `cursor-not-allowed` on disabled buttons

### 2026-04-16 — Fix token loading, add alternative intent, fix focus ring
- Fixed semantic CSS import (was pointing to non-existent files)
- Added `alternative` intent with 3 sub-types (primary, secondary, brand/tertiary)
- Added `destructive` + `secondary` mapping (reuses outlined tokens)
- Replaced broken focus ring (was using wrong token `--ds-input-input-outline-variant` = black) with correct `--ds-global-ring-focus` (periwinkle-200) via box-shadow composition
- Fixed ghost shadow from `none` to `0 0 0 0 transparent` to allow focus shadow composition
- Fixed inverted border color to distinct rgba value
- Updated stories with Alternative and Destructive Secondary
- Updated README with intent × type mapping table

### 2026-04-22 — Add React version
- Added `Button.tsx` — React component, prop-for-prop mirror of `Button.vue`
- Slots replaced by `children`, `leadingIcon`, `trailingIcon` React props
- Added `Button.types.ts` shared TypeScript interfaces for both frameworks
- Added `Button.react.stories.tsx` with full Storybook coverage (React Storybook)
- Registered in `components/react.ts`

### 2026-04-15 — Initial implementation
- Added `Button` component with 6 types × 2 intents × 5 sizes
- States: default, hover, focus, disabled
- Slots: `default` (label / icon-only), `leading`, `trailing`
- Supports `tag="a"` for link buttons
- Icon-only mode via `iconOnly` prop
