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
 *   uses --ds-global-ring-focus (periwinkle-200) with a 3px white gap, matching
 *   the Figma button/focus effect style.
 *
 * Known deviations from Figma (see README.md):
 *   1. Ghost on-surface uses --ds-button-outlined-on-surface (dark text) to
 *      match the Figma visual; the semantic token button.ghost.on-surface
 *      is white and would be invisible on light backgrounds.
 *   2. Button shadows (button/default, button/default-alt) are not tokenised;
 *      raw rgba values are used with a documenting comment.
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
 * Mapping table (Figma intent × type → CSS token prefix):
 *   default      + primary    → primary
 *   default      + secondary  → secondary
 *   default      + tertiary   → tertiary
 *   default      + outlined   → outlined
 *   default      + ghost      → ghost
 *   default      + inverted   → inverted
 *   destructive  + primary    → destructive-primary
 *   destructive  + secondary  → destructive-outlined  (same visual treatment)
 *   destructive  + outlined   → destructive-outlined
 *   alternative  + primary    → alternative-primary
 *   alternative  + secondary  → alternative-secondary
 *   alternative  + tertiary   → alternative-brand      (Figma "tertiary" = token "brand")
 */
const tokenPrefix = computed(() => {
  if (props.intent === 'destructive') {
    if (props.type === 'primary') return 'destructive-primary';
    // Figma "destructive secondary" uses the same tokens as destructive outlined
    if (props.type === 'secondary' || props.type === 'outlined') return 'destructive-outlined';
  }
  if (props.intent === 'alternative') {
    if (props.type === 'primary') return 'alternative-primary';
    if (props.type === 'secondary') return 'alternative-secondary';
    // Figma "alternative tertiary" maps to the "brand" token group (orange)
    if (props.type === 'tertiary') return 'alternative-brand';
  }
  return props.type as string;
});

/**
 * Determine the shadow "family" for the current type + intent.
 * This controls which box-shadow pattern is applied (filled, outlined,
 * subtle, or none).
 */
type ShadowFamily = 'filled' | 'outlined' | 'subtle' | 'none';
const shadowFamily = computed<ShadowFamily>(() => {
  const pfx = tokenPrefix.value;
  if (pfx === 'ghost') return 'none';
  if (
    pfx === 'primary' || pfx === 'inverted' ||
    pfx === 'destructive-primary' ||
    pfx === 'alternative-primary'
  ) return 'filled';
  if (
    pfx === 'outlined' || pfx === 'destructive-outlined'
  ) return 'outlined';
  // secondary, tertiary, alternative-secondary, alternative-brand
  return 'subtle';
});

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
  // Figma: default/surface-disabled + default/on-surface-disabled.
  // No shadow visible in disabled state.
  if (props.disabled) {
    return {
      '--btn-bg':           'var(--ds-default-surface-disabled)',
      '--btn-bg-hover':     'var(--ds-default-surface-disabled)',
      '--btn-color':        'var(--ds-default-on-surface-disabled)',
      '--btn-shadow':       '0 0 0 0 transparent',
      '--btn-shadow-hover': '0 0 0 0 transparent',
      '--btn-focus-shadow': '0 0 0 0 transparent',
      '--btn-min-h':        `var(--ds-button-control-min-height-${s})`,
      '--btn-px':           `var(--ds-button-control-padding-${io ? 'icon-only-' : ''}px-${s})`,
      '--btn-py':           `var(--ds-button-control-padding-${io ? 'icon-only-' : ''}py-${s})`,
      '--btn-gap':          `var(--ds-button-control-space-between-${s})`,
      '--btn-radius':       `var(--ds-button-control-radius-${s})`,
      '--btn-icon-size':    `var(--ds-button-control-icon-size-${s})`,
      '--btn-font-size':    `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
    };
  }

  // ── Background (surface) ────────────────────────────────────────────────────
  const bg      = `var(--ds-button-${pfx}-surface)`;
  const bgHover = `var(--ds-button-${pfx}-surface-hover, ${bg})`;

  // ── Text / icon colour ──────────────────────────────────────────────────────
  // Ghost deviation: Figma renders ghost text as periwinkle-700 (outlined
  // on-surface), not white. We follow the visual rather than the token.
  const color = props.type === 'ghost'
    ? 'var(--ds-button-outlined-on-surface)'
    : `var(--ds-button-${pfx}-on-surface)`;

  // ── Box-shadow (drop + inset border) ────────────────────────────────────────
  // Shadow values are not tokenised. They map to two Figma effect styles:
  //   button/default     — filled types (primary, inverted, destructive-primary)
  //   button/default-alt — subtle types (secondary, tertiary, alternative-brand)
  // Outlined types get a visible colored border. Ghost has no shadow at rest.
  let shadowRest: string;
  let shadowHover: string;

  if (sf === 'filled') {
    const bw = `var(--ds-button-control-border-style-${s}, 2px)`;
    const borderColor = pfx === 'inverted'
      ? 'rgba(255,255,255,0.08)'
      : `var(--ds-button-primary-border, rgba(255,255,255,0.12))`;
    shadowRest  = [
      '0px 1px 2px 0px rgba(10,13,18,0.05)',
      `inset 0 0 0 ${bw} ${borderColor}`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.05)',
    ].join(', ');
    shadowHover = shadowRest;

  } else if (sf === 'outlined') {
    const bw = `var(--ds-button-control-border-default-${s}, 1px)`;
    shadowRest  = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      `inset 0 0 0 ${bw} var(--ds-button-${pfx}-border)`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
    shadowHover = shadowRest;

  } else if (sf === 'subtle') {
    // secondary, tertiary, alternative-secondary, alternative-brand
    const bwHover = `var(--ds-button-control-border-hover-${s}, 1.5px)`;
    const borderHoverToken = `var(--ds-button-${pfx}-border-hover, rgba(10,13,18,0.06))`;
    shadowRest  = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      'inset 0 0 0 1px rgba(10,13,18,0.02)',
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
    shadowHover = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      `inset 0 0 0 ${bwHover} ${borderHoverToken}`,
    ].join(', ');

  } else {
    // ghost — transparent at rest, border appears on hover
    // Use transparent shadow instead of 'none' to allow focus shadow composition
    shadowRest  = '0 0 0 0 transparent';
    const bwHover = `var(--ds-button-control-border-hover-${s}, 2px)`;
    shadowHover = `inset 0 0 0 ${bwHover} var(--ds-button-ghost-border-hover)`;
  }

  // ── Focus ring shadow ───────────────────────────────────────────────────────
  // Figma button/focus effect: 3px white gap + 3px ring at global/ring-focus.
  // Composed on top of the resting shadow so the border remains visible.
  const focusShadow = [
    shadowRest,
    '0 0 0 3px #ffffff',
    '0 0 0 6px var(--ds-global-ring-focus, #9fbfff)',
  ].join(', ');

  return {
    // Colours
    '--btn-bg':           bg,
    '--btn-bg-hover':     bgHover,
    '--btn-color':        color,
    // Shadows
    '--btn-shadow':       shadowRest,
    '--btn-shadow-hover': shadowHover,
    '--btn-focus-shadow': focusShadow,
    // Sizing — all delegated to design tokens
    '--btn-min-h':        `var(--ds-button-control-min-height-${s})`,
    '--btn-px':           `var(--ds-button-control-padding-${io ? 'icon-only-' : ''}px-${s})`,
    '--btn-py':           `var(--ds-button-control-padding-${io ? 'icon-only-' : ''}py-${s})`,
    '--btn-gap':          `var(--ds-button-control-space-between-${s})`,
    '--btn-radius':       `var(--ds-button-control-radius-${s})`,
    '--btn-icon-size':    `var(--ds-button-control-icon-size-${s})`,
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
           [box-shadow:var(--btn-shadow)] hover:[box-shadow:var(--btn-shadow-hover)]
           focus-visible:[box-shadow:var(--btn-focus-shadow)]
           transition-[background-color,box-shadow] duration-150
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
