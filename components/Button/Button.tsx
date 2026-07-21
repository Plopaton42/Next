import { useMemo } from 'react';
import type { ButtonProps } from './Button.types';

/**
 * Button — React version. Mirrors Button.vue prop-for-prop.
 *
 * Slots → props mapping:
 *   default slot  → children
 *   #leading slot → leadingIcon (ReactNode)
 *   #trailing slot → trailingIcon (ReactNode)
 *
 * The CSS custom-property logic is identical to the Vue version so both
 * renderers produce the exact same tokens and visual output. See
 * Button.vue's header comment for the full token-mapping rationale.
 */

interface ButtonReactProps extends ButtonProps {
  children?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  href?: string;
  'aria-label'?: string;
  [key: string]: unknown;
}

const FONT_SIZE_SUFFIX: Record<string, string> = {
  sm: 'sm',
  md: 'sm',
  lg: 'base',
  xl: 'lg',
  xxl: 'xl',
};

type ShadowFamily = 'filled' | 'outlined' | 'ghost' | 'subtle';

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

function resolveTokenPrefix(type: string, intent: string): string {
  if (intent === 'destructive') {
    if (type === 'primary') return 'destructive-primary';
    if (type === 'secondary') return 'destructive-secondary';
  }
  if (intent === 'alternative') {
    // alternative+primary aliases the exact same action/primary/* tokens as
    // base primary (incl. hover/active) — Figma only gives it its own
    // surface/on-surface, so we borrow primary's interaction tokens.
    if (type === 'primary') return 'primary';
    if (type === 'secondary') return 'alternative-secondary';
    if (type === 'tertiary') return 'alternative-brand';
  }
  return type;
}

function resolveShadowFamily(pfx: string): ShadowFamily {
  if (pfx === 'ghost') return 'ghost';
  if (pfx === 'outlined') return 'outlined';
  if (pfx === 'primary' || pfx === 'destructive-primary') return 'filled';
  // secondary, tertiary, inverted, alternative-secondary, alternative-brand, destructive-secondary
  return 'subtle';
}

function buildCssVars(
  type: string, intent: string, size: string,
  iconOnly: boolean, disabled: boolean,
): Record<string, string> {
  const pfx = resolveTokenPrefix(type, intent);
  const sf  = resolveShadowFamily(pfx);
  const s   = size;

  // Figma: alternative intent always uses pill radius (button.control.radius.rounded).
  const radiusToken = intent === 'alternative'
    ? 'var(--ds-button-control-radius-rounded)'
    : `var(--ds-button-control-radius-${s})`;

  const paddingSegment = iconOnly ? 'icon-only' : 'default';

  if (disabled) {
    return {
      '--btn-bg':            'var(--ds-color-scene-default-surface-disabled)',
      '--btn-bg-hover':      'var(--ds-color-scene-default-surface-disabled)',
      '--btn-bg-active':     'var(--ds-color-scene-default-surface-disabled)',
      '--btn-color':         'var(--ds-color-scene-default-on-surface-disabled)',
      '--btn-shadow':        '0 0 0 0 transparent',
      '--btn-shadow-hover':  '0 0 0 0 transparent',
      '--btn-shadow-active': '0 0 0 0 transparent',
      '--btn-focus-shadow':  '0 0 0 0 transparent',
      '--btn-min-h':         `var(--ds-button-control-min-height-${s})`,
      '--btn-px':            `var(--ds-button-control-padding-${paddingSegment}-px-${s})`,
      '--btn-py':            `var(--ds-button-control-padding-${paddingSegment}-py-${s})`,
      '--btn-gap':           `var(--ds-button-control-space-between-${s})`,
      '--btn-radius':        radiusToken,
      '--btn-icon-size':     `var(--ds-button-control-icon-number-${s})`,
      '--btn-font-size':     `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
    };
  }

  const bg       = `var(--ds-button-${pfx}-surface)`;
  const bgHover  = `var(--ds-button-${pfx}-surface-hover, ${bg})`;
  // Only the "filled" family (primary, destructive-primary) has a dedicated
  // surface-active token — everything else keeps the hover fill on press and
  // shows a border ring instead (see shadowActive below).
  const bgActive = sf === 'filled'
    ? `var(--ds-button-${pfx}-surface-active, ${bgHover})`
    : bgHover;
  const color    = type === 'ghost'
    ? 'var(--ds-button-outlined-on-surface)'
    : `var(--ds-button-${pfx}-on-surface)`;

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

  const focusShadow = [
    shadowRest,
    '0 0 0 3px #ffffff',
    '0 0 0 6px var(--ds-color-focus-ring, #9fbfff)',
  ].join(', ');

  return {
    '--btn-bg':            bg,
    '--btn-bg-hover':      bgHover,
    '--btn-bg-active':     bgActive,
    '--btn-color':         color,
    '--btn-shadow':        shadowRest,
    '--btn-shadow-hover':  shadowHover,
    '--btn-shadow-active': shadowActive,
    '--btn-focus-shadow':  focusShadow,
    '--btn-min-h':         `var(--ds-button-control-min-height-${s})`,
    '--btn-px':            `var(--ds-button-control-padding-${paddingSegment}-px-${s})`,
    '--btn-py':            `var(--ds-button-control-padding-${paddingSegment}-py-${s})`,
    '--btn-gap':           `var(--ds-button-control-space-between-${s})`,
    '--btn-radius':        radiusToken,
    '--btn-icon-size':     `var(--ds-button-control-icon-number-${s})`,
    '--btn-font-size':     `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
  };
}

export function Button({
  type       = 'primary',
  intent     = 'default',
  size       = 'md',
  disabled   = false,
  iconOnly   = false,
  tag        = 'button',
  nativeType = 'button',
  children,
  leadingIcon,
  trailingIcon,
  onClick,
  className,
  href,
  ...rest
}: ButtonReactProps) {
  const cssVars = useMemo(
    () => buildCssVars(type, intent, size, iconOnly, disabled),
    [type, intent, size, iconOnly, disabled],
  );

  const Tag = tag as React.ElementType;

  const baseClass = [
    'relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden',
    '[background-color:var(--btn-bg)] hover:[background-color:var(--btn-bg-hover)]',
    'active:[background-color:var(--btn-bg-active)]',
    '[box-shadow:var(--btn-shadow)] hover:[box-shadow:var(--btn-shadow-hover)]',
    'active:[box-shadow:var(--btn-shadow-active)]',
    'focus-visible:[box-shadow:var(--btn-focus-shadow)]',
    'transition-[background-color,box-shadow,scale] duration-100',
    'active:scale-[0.97]',
    'min-h-[var(--btn-min-h)] h-[var(--btn-min-h)]',
    'px-[var(--btn-px)] py-[var(--btn-py)]',
    'gap-[var(--btn-gap)]',
    'rounded-[var(--btn-radius)]',
    '[font-family:var(--ds-font-family-sans)]',
    '[font-weight:var(--ds-font-weight-bold)]',
    'text-[length:var(--btn-font-size)]',
    'text-[color:var(--btn-color)]',
    'whitespace-nowrap',
    'focus-visible:outline-none',
    disabled ? 'pointer-events-none cursor-not-allowed' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  const tagProps: Record<string, unknown> = {
    style: cssVars as React.CSSProperties,
    className: baseClass,
    onClick: disabled ? undefined : onClick,
    ...rest,
  };

  if (tag === 'button') {
    tagProps['type']     = nativeType;
    tagProps['disabled'] = disabled;
  } else {
    tagProps['href']      = href;
    tagProps['tabIndex']  = disabled ? -1 : undefined;
    tagProps['aria-disabled'] = disabled ? 'true' : undefined;
  }

  return (
    <Tag {...tagProps}>
      {iconOnly ? (
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' } as React.CSSProperties}
        >
          {children}
        </span>
      ) : (
        <>
          {leadingIcon && (
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center justify-center"
              style={{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' } as React.CSSProperties}
            >
              {leadingIcon}
            </span>
          )}
          <span className="shrink-0 leading-[var(--ds-font-line-height-normal,1.5)]">
            {children}
          </span>
          {trailingIcon && (
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center justify-center"
              style={{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' } as React.CSSProperties}
            >
              {trailingIcon}
            </span>
          )}
        </>
      )}
    </Tag>
  );
}

export default Button;
