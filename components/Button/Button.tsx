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
 * renderers produce the exact same tokens and visual output.
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

type ShadowFamily = 'filled' | 'outlined' | 'subtle' | 'none';

function resolveTokenPrefix(type: string, intent: string): string {
  if (intent === 'destructive') {
    if (type === 'primary') return 'destructive-primary';
    if (type === 'secondary' || type === 'outlined') return 'destructive-outlined';
  }
  if (intent === 'alternative') {
    if (type === 'primary') return 'alternative-primary';
    if (type === 'secondary') return 'alternative-secondary';
    if (type === 'tertiary') return 'alternative-brand';
  }
  return type;
}

function resolveShadowFamily(pfx: string): ShadowFamily {
  if (pfx === 'ghost') return 'none';
  if (
    pfx === 'primary' || pfx === 'inverted' ||
    pfx === 'destructive-primary' ||
    pfx === 'alternative-primary'
  ) return 'filled';
  if (pfx === 'outlined' || pfx === 'destructive-outlined') return 'outlined';
  return 'subtle';
}

function buildCssVars(
  type: string, intent: string, size: string,
  iconOnly: boolean, disabled: boolean, rounded: boolean,
): Record<string, string> {
  const pfx = resolveTokenPrefix(type, intent);
  const sf  = resolveShadowFamily(pfx);
  const s   = size;

  const radiusToken = (rounded || intent === 'alternative')
    ? 'var(--ds-button-control-radius-rounded)'
    : `var(--ds-button-control-radius-${s})`;

  if (disabled) {
    return {
      '--btn-bg':           'var(--ds-default-surface-disabled)',
      '--btn-bg-hover':     'var(--ds-default-surface-disabled)',
      '--btn-color':        'var(--ds-default-on-surface-disabled)',
      '--btn-shadow':       '0 0 0 0 transparent',
      '--btn-shadow-hover': '0 0 0 0 transparent',
      '--btn-focus-shadow': '0 0 0 0 transparent',
      '--btn-min-h':        `var(--ds-button-control-min-height-${s})`,
      '--btn-px':           `var(--ds-button-control-padding-${iconOnly ? 'icon-only-' : ''}px-${s})`,
      '--btn-py':           `var(--ds-button-control-padding-${iconOnly ? 'icon-only-' : ''}py-${s})`,
      '--btn-gap':          `var(--ds-button-control-space-between-${s})`,
      '--btn-radius':       radiusToken,
      '--btn-icon-size':    `var(--ds-button-control-icon-size-${s})`,
      '--btn-font-size':    `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
    };
  }

  const bg      = `var(--ds-button-${pfx}-surface)`;
  const bgHover = `var(--ds-button-${pfx}-surface-hover, ${bg})`;
  const color   = type === 'ghost'
    ? 'var(--ds-button-outlined-on-surface)'
    : `var(--ds-button-${pfx}-on-surface)`;

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
    const bwHover        = `var(--ds-button-control-border-hover-${s}, 1.5px)`;
    const borderHoverTok = `var(--ds-button-${pfx}-border-hover, rgba(10,13,18,0.06))`;
    shadowRest  = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      'inset 0 0 0 1px rgba(10,13,18,0.02)',
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
    shadowHover = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      `inset 0 0 0 ${bwHover} ${borderHoverTok}`,
    ].join(', ');
  } else {
    shadowRest  = '0 0 0 0 transparent';
    const bwHover = `var(--ds-button-control-border-hover-${s}, 2px)`;
    shadowHover = `inset 0 0 0 ${bwHover} var(--ds-button-ghost-border-hover)`;
  }

  const focusShadow = [
    shadowRest,
    '0 0 0 3px #ffffff',
    '0 0 0 6px var(--ds-global-ring-focus, #9fbfff)',
  ].join(', ');

  return {
    '--btn-bg':           bg,
    '--btn-bg-hover':     bgHover,
    '--btn-color':        color,
    '--btn-shadow':       shadowRest,
    '--btn-shadow-hover': shadowHover,
    '--btn-focus-shadow': focusShadow,
    '--btn-min-h':        `var(--ds-button-control-min-height-${s})`,
    '--btn-px':           `var(--ds-button-control-padding-${iconOnly ? 'icon-only-' : ''}px-${s})`,
    '--btn-py':           `var(--ds-button-control-padding-${iconOnly ? 'icon-only-' : ''}py-${s})`,
    '--btn-gap':          `var(--ds-button-control-space-between-${s})`,
    '--btn-radius':       radiusToken,
    '--btn-icon-size':    `var(--ds-button-control-icon-size-${s})`,
    '--btn-font-size':    `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
  };
}

export function Button({
  type       = 'primary',
  intent     = 'default',
  size       = 'md',
  disabled   = false,
  rounded    = false,
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
    () => buildCssVars(type, intent, size, iconOnly, disabled, rounded),
    [type, intent, size, iconOnly, disabled, rounded],
  );

  const Tag = tag as React.ElementType;

  const baseClass = [
    'relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden',
    '[background-color:var(--btn-bg)] hover:[background-color:var(--btn-bg-hover)]',
    '[box-shadow:var(--btn-shadow)] hover:[box-shadow:var(--btn-shadow-hover)]',
    'focus-visible:[box-shadow:var(--btn-focus-shadow)]',
    'transition-[background-color,box-shadow,transform] duration-100',
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
