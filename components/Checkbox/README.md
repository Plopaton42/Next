# Checkbox

Figma: `https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17015-4309&m=dev`

Checkbox interactif avec état interne et micro-interactions. Clique sur la box ou le label pour basculer l'état. Supporte les modes contrôlé et autonome.

Available in **Vue 3** (`Checkbox.vue`) and **React** (`Checkbox.tsx`).

## Usage

### Vue

```vue
<!-- Autonome (état interne) -->
<Checkbox label="Newsletter" />

<!-- Contrôlé -->
<Checkbox label="Checked" :checked="true" @update:checked="val => myRef = val" />

<!-- États spéciaux -->
<Checkbox label="Erreur" state="Error" error-message="Champ requis" />
<Checkbox label="Désactivé" state="Disabled" />
<Checkbox label="Indéterminé" :indeterminate="true" />
```

### React

```tsx
import { Checkbox } from '@mobivia/design-system/react';

// Uncontrolled
<Checkbox label="Newsletter" />

// Controlled
<Checkbox label="Checked" checked={true} onChange={(val) => setChecked(val)} />

// Special states
<Checkbox label="Erreur" state="Error" errorMessage="Champ requis" />
<Checkbox label="Désactivé" state="Disabled" />
<Checkbox label="Indéterminé" indeterminate />
```

#### Vue → React API mapping

| Vue | React equivalent |
|---|---|
| `@update:checked` / `@change` | `onChange` callback |
| All props | Identical name and type |

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | État initial coché |
| `indeterminate` | `boolean` | `false` | État indéterminé (écrase visuellement `checked`) |
| `state` | `"Default" \| "Hover" \| "Focus" \| "Disabled" \| "Error"` | `"Default"` | État visuel |
| `withContent` | `boolean` | `true` | Afficher la zone label + helper |
| `label` | `string` | `"Label"` | Texte principal |
| `showSecondaryLabel` | `boolean` | `false` | Afficher le label secondaire |
| `secondaryLabel` | `string` | `"(1)"` | Texte du label secondaire |
| `showHelper` | `boolean` | `true` | Afficher le texte helper |
| `helperText` | `string` | `"Helper"` | Contenu du helper |
| `errorMessage` | `string` | `"Error"` | Message d'erreur (affiché quand `state="Error"`) |

## Emits

| Événement | Payload | Description |
|---|---|---|
| `update:checked` | `boolean` | Nouvelle valeur après toggle |
| `change` | `boolean` | Idem, alias sémantique |

## Micro-interactions

| Interaction | Animation |
|---|---|
| Click / press | Scale `0.88` → `1` sur le bouton (100ms ease) |
| Checkmark apparaît | Fade + scale `0.5` → `1` (200ms ease-out) |
| Checkmark disparaît | Fade + scale `1` → `0.5` (100ms ease-in) |
| Dash indéterminé | Fade + scaleX `0` → `1` (200ms ease-out) |
| Couleur box | Transition `background-color` + `border-color` 150ms ease |
| Click sur label | Toggle identique au click sur la box |

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

- `<button role="checkbox">` avec `aria-checked` (`true` / `false` / `mixed`)
- `aria-disabled` défini quand `state="Disabled"`
- Click sur le label déclenche aussi le toggle
- Tous les icônes ont `aria-hidden="true"`
- `user-select: none` sur les labels pour éviter la sélection de texte au click

## Fidelity check

| Item | Figma | Implémentation | Match |
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

## Changelog

- **2026-04-22**: Added `Checkbox.tsx` React version (prop-for-prop mirror). CSS transitions replace Vue `<Transition>` for enter/leave icon animations. Added `Checkbox.types.ts` and `Checkbox.react.stories.tsx`.
- **2026-03-18**: Initial implementation. Inline SVG icons, CSS var fallbacks, no external asset dependencies.
- **2026-03-18**: Renommé `CheckboxRoad2` → `Checkbox`. Ajout des micro-interactions : toggle au click, animation checkmark (scale + fade), press effect (scale 0.88), transitions couleur 150ms. Click sur le label déclenche aussi le toggle.
