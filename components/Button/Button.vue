<script setup lang="ts">
import { computed } from 'vue';

/**
 * Button — primary interactive element.
 *
 * Architecture note:
 *   All color and sizing tokens are fed through local CSS custom properties
 *   (--btn-*) set via :style, keeping every Tailwind class a static string
 *   that the build scanner can detect. Interactive states (hover) are handled
 *   by the `group` / `group-hover:` pattern on the child background layer and
 *   by `hover:` on the root for box-shadow transitions.
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
  /** Color intent — "destructive" only affects primary and outlined types */
  intent?: 'default' | 'destructive';
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
 * Destructive intent overrides primary → "destructive-primary"
 * and outlined → "destructive-outlined". All other types are unchanged.
 */
const tokenPrefix = computed(() => {
  if (props.intent === 'destructive') {
    if (props.type === 'primary')  return 'destructive-primary';
    if (props.type === 'outlined') return 'destructive-outlined';
  }
  return props.type as string;
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
  //   button/default     — used by primary & inverted (stronger)
  //   button/default-alt — used by secondary, tertiary, outlined (very subtle)
  // Ghost has no shadow.
  let shadowRest: string;
  let shadowHover: string;

  if (pfx === 'primary' || pfx === 'inverted' || pfx === 'destructive-primary') {
    // Decorative 2px semi-opaque white border + medium inner depth
    const bw = `var(--ds-button-control-border-style-${s}, 2px)`;
    shadowRest  = [
      '0px 1px 2px 0px rgba(10,13,18,0.05)',
      `inset 0 0 0 ${bw} var(--ds-button-primary-border, rgba(255,255,255,0.12))`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.05)',
    ].join(',');
    shadowHover = shadowRest; // shadow doesn't change on hover for these types

  } else if (pfx === 'outlined' || pfx === 'destructive-outlined') {
    // 1px coloured border, very subtle depth
    const bw = `var(--ds-button-control-border-default-${s}, 1px)`;
    shadowRest  = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      `inset 0 0 0 ${bw} var(--ds-button-${pfx}-border)`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(',');
    shadowHover = shadowRest;

  } else if (pfx === 'secondary') {
    const bwHover = `var(--ds-button-control-border-hover-${s}, 1.5px)`;
    shadowRest  = '0px 1px 2px 0px rgba(10,13,18,0.01),inset 0 0 0 1px rgba(10,13,18,0.02),inset 0 -2px 0 0 rgba(10,13,18,0.01)';
    shadowHover = `0px 1px 2px 0px rgba(10,13,18,0.01),inset 0 0 0 ${bwHover} var(--ds-button-secondary-border-hover)`;

  } else if (pfx === 'tertiary') {
    const bwHover = `var(--ds-button-control-border-hover-${s}, 1.5px)`;
    shadowRest  = '0px 1px 2px 0px rgba(10,13,18,0.01),inset 0 0 0 1px rgba(10,13,18,0.02),inset 0 -2px 0 0 rgba(10,13,18,0.01)';
    shadowHover = `0px 1px 2px 0px rgba(10,13,18,0.01),inset 0 0 0 ${bwHover} var(--ds-button-tertiary-border-hover)`;

  } else {
    // ghost — no shadow at rest, border appears on hover
    const bwHover = `var(--ds-button-control-border-hover-${s}, 2px)`;
    shadowRest  = 'none';
    shadowHover = `inset 0 0 0 ${bwHover} var(--ds-button-ghost-border-hover)`;
  }

  return {
    // Colours
    '--btn-bg':           bg,
    '--btn-bg-hover':     bgHover,
    '--btn-color':        color,
    // Shadows
    '--btn-shadow':       shadowRest,
    '--btn-shadow-hover': shadowHover,
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
    class="group relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden
           [box-shadow:var(--btn-shadow)] hover:[box-shadow:var(--btn-shadow-hover)]
           transition-[box-shadow] duration-150
           min-h-[var(--btn-min-h)] h-[var(--btn-min-h)]
           px-[var(--btn-px)] py-[var(--btn-py)]
           gap-[var(--btn-gap)]
           rounded-[var(--btn-radius)]
           [font-family:var(--ds-font-family-sans)]
           [font-weight:var(--ds-font-weight-bold)]
           text-[length:var(--btn-font-size)]
           text-[color:var(--btn-color)]
           whitespace-nowrap
           focus-visible:outline-none
           focus-visible:ring-[length:var(--ds-focus-ring-width,3px)]
           focus-visible:ring-[color:var(--ds-input-input-outline-variant,#004293)]
           focus-visible:ring-offset-2"
    :class="{ 'opacity-40 pointer-events-none': disabled }"
  >
    <!--
      Background layer — sits behind content in DOM order so it paints first.
      Surface colour transitions on group hover.
    -->
    <span
      aria-hidden="true"
      class="absolute inset-0 rounded-[inherit] pointer-events-none
             bg-[var(--btn-bg)] group-hover:bg-[var(--btn-bg-hover)]
             transition-colors duration-150"
    />

    <!-- ── Icon-only mode ─────────────────────────────────────────────────── -->
    <span
      v-if="iconOnly"
      class="relative z-[1] flex shrink-0 items-center justify-center"
      :style="{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' }"
    >
      <slot />
    </span>

    <!-- ── Standard mode: leading icon · label · trailing icon ───────────── -->
    <template v-else>
      <span
        v-if="$slots.leading"
        aria-hidden="true"
        class="relative z-[1] flex shrink-0 items-center justify-center"
        :style="{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' }"
      >
        <slot name="leading" />
      </span>

      <span class="relative z-[1] shrink-0 leading-[var(--ds-font-line-height-normal,1.5)]">
        <slot />
      </span>

      <span
        v-if="$slots.trailing"
        aria-hidden="true"
        class="relative z-[1] flex shrink-0 items-center justify-center"
        :style="{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' }"
      >
        <slot name="trailing" />
      </span>
    </template>
  </component>
</template>
