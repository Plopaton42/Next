<script setup lang="ts">
import { computed } from 'vue';

/**
 * Button — primary interactive element.
 *
 * Architecture note:
 *   All color and sizing tokens are fed through local CSS custom properties
 *   (--btn-*) set via :style on the root element. Tailwind arbitrary property
 *   classes ([background-color:var(--btn-bg)], hover:[background-color:...])
 *   apply directly on the root so the vars are resolved on the same element —
 *   no child-span inheritance needed. Box-shadow handles the inset border.
 *
 *   Focus ring is implemented via box-shadow composition (--btn-focus-shadow)
 *   to avoid conflicts with the existing box-shadow border system. The ring
 *   uses --ds-color-focus-ring (periwinkle-200) with a 3px white gap, matching
 *   the Figma button/focus effect style.
 *
 *   Tokens now come from the 3-tier Component (button/*) -> Semantic
 *   (action/*) -> Primitive pipeline (tokens/source/{components,semantic,
 *   primitives}.json), matching the Figma Variables API 1:1. Interaction
 *   states (hover/active) use real Figma-authored tokens (surface-active for
 *   filled types, border-pressed/border-active for outlined-on-interaction
 *   types) layered on top of the existing scale(0.97) tactile press feedback.
 *
 * Known deviations from Figma (see README.md):
 *   1. Ghost on-surface uses --ds-button-outlined-on-surface (dark text) to
 *      match the Figma visual; the semantic token action.ghost.on-surface
 *      is white and would be invisible on light backgrounds.
 *   2. Button shadows (utilities-style/button, utilities-style/button-alt)
 *      and per-size button typography (button/button-{size} text styles) are
 *      Figma Styles, not Variables — not yet exported by this pipeline.
 *      Raw rgba shadow values and the generic font-size scale are used
 *      instead, as before.
 */

const props = withDefaults(defineProps<{
  /** Visual style — matches Figma "type" prop */
  type?: 'primary' | 'secondary' | 'tertiary' | 'outlined' | 'ghost' | 'inverted';
  /** Color intent — maps to Figma "intent" prop */
  intent?: 'default' | 'destructive' | 'alternative';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** Disabled state */
  disabled?: boolean;
  /** Square icon-only layout — switches to icon-only padding; place icon in default slot */
  iconOnly?: boolean;
  /** Root HTML element */
  tag?: 'button' | 'a';
  /** Native <button> type attribute (ignored when tag="a") */
  nativeType?: 'button' | 'submit' | 'reset';
}>(), {
  type: 'primary',
  intent: 'default',
  size: 'md',
  disabled: false,
  iconOnly: false,
  tag: 'button',
  nativeType: 'button',
});

defineEmits<{
  click: [event: MouseEvent];
}>();

// Maps button size → typography token suffix (font.size.*)
const FONT_SIZE_SUFFIX: Record<string, string> = {
  sm: 'sm',   // 14px
  md: 'sm',   // 14px
  lg: 'base', // 16px
  xl: 'lg',   // 18px
  xxl: 'xl',  // 20px
};

/**
 * Resolve the color-token namespace based on type + intent.
 *
 * Mapping table (Figma intent × type → CSS token prefix), matching the
 * Components collection 1:1 (tokens/source/components.json → button.*):
 *   default      + primary    → primary
 *   default      + secondary  → secondary
 *   default      + tertiary   → tertiary
 *   default      + outlined   → outlined
 *   default      + ghost      → ghost
 *   default      + inverted   → inverted
 *   destructive  + primary    → destructive-primary
 *   destructive  + secondary  → destructive-secondary   (real tokens now — no longer reuses outlined)
 *   alternative  + primary    → primary                 (button/alternative/primary/* aliases the
 *                                                          exact same action/primary/* semantic tokens
 *                                                          as base primary, incl. hover/active — Figma
 *                                                          only gives it its own surface/on-surface, so
 *                                                          we borrow primary's interaction tokens)
 *   alternative  + secondary  → alternative-secondary
 *   alternative  + tertiary   → alternative-brand        (Figma "tertiary" = token "brand")
 *
 * destructive + outlined/tertiary/ghost/inverted and alternative + outlined/
 * ghost/inverted have no Component tokens in Figma — falls through to the
 * base type's default-intent styling.
 */
const tokenPrefix = computed(() => {
  if (props.intent === 'destructive') {
    if (props.type === 'primary') return 'destructive-primary';
    if (props.type === 'secondary') return 'destructive-secondary';
  }
  if (props.intent === 'alternative') {
    if (props.type === 'primary') return 'primary';
    if (props.type === 'secondary') return 'alternative-secondary';
    if (props.type === 'tertiary') return 'alternative-brand';
  }
  return props.type as string;
});

/**
 * Determine the interaction "family" for the current token prefix — this
 * controls which box-shadow/border pattern is applied on hover and press.
 *
 *   filled   — primary, destructive-primary: bg changes on hover AND press
 *              (surface-hover / surface-active); a constant subtle white
 *              ring (button.primary.border) is always visible.
 *   outlined — outlined: a constant colored border is always visible;
 *              only the fill tints on hover, no distinct press state.
 *   ghost    — ghost: transparent at rest, a light fill appears on hover,
 *              a border ring appears only on press (border-pressed).
 *   subtle   — secondary, tertiary, inverted, alternative-secondary,
 *              alternative-brand, destructive-secondary: a colored fill at
 *              rest that tints further on hover; a border ring appears only
 *              on press (border-pressed/border-active).
 */
type ShadowFamily = 'filled' | 'outlined' | 'ghost' | 'subtle';
const shadowFamily = computed<ShadowFamily>(() => {
  const pfx = tokenPrefix.value;
  if (pfx === 'ghost') return 'ghost';
  if (pfx === 'outlined') return 'outlined';
  if (pfx === 'primary' || pfx === 'destructive-primary') return 'filled';
  // secondary, tertiary, inverted, alternative-secondary, alternative-brand, destructive-secondary
  return 'subtle';
});

// Component token that carries the border color shown only on :active, per
// token prefix — matches button.{variant}.border-pressed / border-active in
// tokens/source/components.json (both use the same border-size-pressed-{size}
// width scale regardless of which name Figma gave the color property).
const ACTIVE_BORDER_VAR: Record<string, string> = {
  secondary: 'secondary-border-pressed',
  tertiary: 'tertiary-border-pressed',
  ghost: 'ghost-border-pressed',
  inverted: 'inverted-border-active',
  'alternative-secondary': 'alternative-secondary-border-active',
  'alternative-brand': 'alternative-brand-border-active',
  'destructive-secondary': 'destructive-secondary-border-active',
};

/**
 * Compute all --btn-* CSS custom properties fed to the root element.
 * Tailwind classes reference these via var(--btn-*) — static strings
 * that are safe to purge.
 */
const cssVars = computed<Record<string, string>>(() => {
  const pfx = tokenPrefix.value;
  const s   = props.size;
  const io  = props.iconOnly;
  const sf  = shadowFamily.value;

  // ── Disabled state — universal gray tokens regardless of variant ───────────
  // Figma: color/scene/default/surface-disabled + on-surface-disabled.
  // No shadow visible in disabled state.
  // Figma: alternative intent always uses pill radius (button.control.radius.rounded).
  const radiusToken = props.intent === 'alternative'
    ? 'var(--ds-button-control-radius-rounded)'
    : `var(--ds-button-control-radius-${s})`;

  const paddingSegment = io ? 'icon-only' : 'default';

  if (props.disabled) {
    return {
      '--btn-bg':           'var(--ds-color-scene-default-surface-disabled)',
      '--btn-bg-hover':     'var(--ds-color-scene-default-surface-disabled)',
      '--btn-bg-active':    'var(--ds-color-scene-default-surface-disabled)',
      '--btn-color':        'var(--ds-color-scene-default-on-surface-disabled)',
      '--btn-shadow':       '0 0 0 0 transparent',
      '--btn-shadow-hover': '0 0 0 0 transparent',
      '--btn-shadow-active':'0 0 0 0 transparent',
      '--btn-focus-shadow': '0 0 0 0 transparent',
      '--btn-min-h':        `var(--ds-button-control-min-height-${s})`,
      '--btn-px':           `var(--ds-button-control-padding-${paddingSegment}-px-${s})`,
      '--btn-py':           `var(--ds-button-control-padding-${paddingSegment}-py-${s})`,
      '--btn-gap':          `var(--ds-button-control-space-between-${s})`,
      '--btn-radius':       radiusToken,
      '--btn-icon-size':    `var(--ds-button-control-icon-number-${s})`,
      '--btn-font-size':    `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
    };
  }

  // ── Background (surface) ────────────────────────────────────────────────────
  const bg       = `var(--ds-button-${pfx}-surface)`;
  const bgHover  = `var(--ds-button-${pfx}-surface-hover, ${bg})`;
  // Only the "filled" family (primary, destructive-primary) has a dedicated
  // surface-active token — everything else keeps the hover fill on press and
  // shows a border ring instead (see shadowActive below).
  const bgActive = sf === 'filled'
    ? `var(--ds-button-${pfx}-surface-active, ${bgHover})`
    : bgHover;

  // ── Text / icon colour ──────────────────────────────────────────────────────
  // Ghost deviation: Figma renders ghost text as periwinkle-700 (outlined
  // on-surface), not white. We follow the visual rather than the token.
  const color = props.type === 'ghost'
    ? 'var(--ds-button-outlined-on-surface)'
    : `var(--ds-button-${pfx}-on-surface)`;

  // ── Box-shadow (drop + inset border) ────────────────────────────────────────
  // Base drop-shadow/highlight is not tokenised (Figma exposes it as the
  // utilities-style/button(-alt) EFFECT STYLE, not a Variable — see header
  // comment). The border colors/widths ARE real Component/Semantic tokens.
  let shadowRest: string;
  let shadowHover: string;
  let shadowActive: string;

  if (sf === 'filled') {
    // primary, destructive-primary — a constant subtle white ring, bg does the work
    const bw = `var(--ds-button-control-border-size-style-${s}, 2px)`;
    const borderColor = `var(--ds-button-primary-border, rgba(255,255,255,0.12))`;
    shadowRest = [
      '0px 1px 2px 0px rgba(10,13,18,0.05)',
      `inset 0 0 0 ${bw} ${borderColor}`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.05)',
    ].join(', ');
    shadowHover = shadowRest;
    shadowActive = shadowRest;

  } else if (sf === 'outlined') {
    // outlined — a constant colored border, no distinct press state
    const bw = `var(--ds-button-control-border-size-default-${s}, 1px)`;
    shadowRest = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      `inset 0 0 0 ${bw} var(--ds-button-${pfx}-border)`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
    shadowHover = shadowRest;
    shadowActive = shadowRest;

  } else if (sf === 'ghost') {
    // ghost — fully invisible at rest AND hover (only the fill token change
    // signals hover); a colored border ring appears only on :active.
    shadowRest = '0 0 0 0 transparent';
    shadowHover = '0 0 0 0 transparent';

    const activeBorderVar = ACTIVE_BORDER_VAR[pfx];
    const bwActive = `var(--ds-button-control-border-size-pressed-${s}, 1.5px)`;
    shadowActive = activeBorderVar
      ? `inset 0 0 0 ${bwActive} var(--ds-button-${activeBorderVar})`
      : shadowHover;

  } else {
    // subtle (secondary, tertiary, inverted, alternative-secondary,
    // alternative-brand, destructive-secondary) — a faint hairline at
    // rest/hover, a colored border ring appears only on :active.
    shadowRest = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      'inset 0 0 0 1px rgba(10,13,18,0.02)',
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
    shadowHover = shadowRest;

    const activeBorderVar = ACTIVE_BORDER_VAR[pfx];
    const bwActive = `var(--ds-button-control-border-size-pressed-${s}, 1.5px)`;
    shadowActive = activeBorderVar
      ? `inset 0 0 0 ${bwActive} var(--ds-button-${activeBorderVar})`
      : shadowHover;
  }

  // ── Focus ring shadow ───────────────────────────────────────────────────────
  // Figma button/focus effect: 3px white gap + 3px ring at color/focus/ring.
  // Composed on top of the resting shadow so the border remains visible.
  const focusShadow = [
    shadowRest,
    '0 0 0 3px #ffffff',
    '0 0 0 6px var(--ds-color-focus-ring, #9fbfff)',
  ].join(', ');

  return {
    // Colours
    '--btn-bg':           bg,
    '--btn-bg-hover':     bgHover,
    '--btn-bg-active':    bgActive,
    '--btn-color':        color,
    // Shadows
    '--btn-shadow':        shadowRest,
    '--btn-shadow-hover':  shadowHover,
    '--btn-shadow-active': shadowActive,
    '--btn-focus-shadow':  focusShadow,
    // Sizing — all delegated to design tokens
    '--btn-min-h':        `var(--ds-button-control-min-height-${s})`,
    '--btn-px':           `var(--ds-button-control-padding-${paddingSegment}-px-${s})`,
    '--btn-py':           `var(--ds-button-control-padding-${paddingSegment}-py-${s})`,
    '--btn-gap':          `var(--ds-button-control-space-between-${s})`,
    '--btn-radius':       radiusToken,
    '--btn-icon-size':    `var(--ds-button-control-icon-number-${s})`,
    '--btn-font-size':    `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
  };
});
</script>

<template>
  <component
    :is="tag"
    :type="tag === 'button' ? nativeType : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled && tag !== 'button' ? -1 : undefined"
    :style="cssVars"
    class="relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden
           [background-color:var(--btn-bg)] hover:[background-color:var(--btn-bg-hover)]
           active:[background-color:var(--btn-bg-active)]
           [box-shadow:var(--btn-shadow)] hover:[box-shadow:var(--btn-shadow-hover)]
           active:[box-shadow:var(--btn-shadow-active)]
           focus-visible:[box-shadow:var(--btn-focus-shadow)]
           transition-[background-color,box-shadow,transform] duration-100
           active:scale-[0.97]
           min-h-[var(--btn-min-h)] h-[var(--btn-min-h)]
           px-[var(--btn-px)] py-[var(--btn-py)]
           gap-[var(--btn-gap)]
           rounded-[var(--btn-radius)]
           [font-family:var(--ds-font-family-sans)]
           [font-weight:var(--ds-font-weight-bold)]
           text-[length:var(--btn-font-size)]
           text-[color:var(--btn-color)]
           whitespace-nowrap
           focus-visible:outline-none"
    :class="{ 'pointer-events-none cursor-not-allowed': disabled }"
  >
    <!-- ── Icon-only mode ─────────────────────────────────────────────────── -->
    <span
      v-if="iconOnly"
      class="flex shrink-0 items-center justify-center"
      :style="{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' }"
    >
      <slot />
    </span>

    <!-- ── Standard mode: leading icon · label · trailing icon ───────────── -->
    <template v-else>
      <span
        v-if="$slots.leading"
        aria-hidden="true"
        class="flex shrink-0 items-center justify-center"
        :style="{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' }"
      >
        <slot name="leading" />
      </span>

      <span class="shrink-0 leading-[var(--ds-font-line-height-normal,1.5)]">
        <slot />
      </span>

      <span
        v-if="$slots.trailing"
        aria-hidden="true"
        class="flex shrink-0 items-center justify-center"
        :style="{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' }"
      >
        <slot name="trailing" />
      </span>
    </template>
  </component>
</template>
