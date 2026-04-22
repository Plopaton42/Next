import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SplitButtonProps, SplitButtonItem } from './SplitButton.types';

export type { SplitButtonItem };

/**
 * SplitButton — React version. Mirrors SplitButton.vue prop-for-prop.
 *
 * Slots → props mapping:
 *   default slot → children
 *   #leading slot → leadingIcon (ReactNode)
 *
 * Teleport → ReactDOM.createPortal(menu, document.body).
 * Two-wrapper focus-ring strategy is preserved.
 */

interface SplitButtonReactProps extends SplitButtonProps {
  children?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  onSelect?: (item: SplitButtonItem) => void;
  className?: string;
}

const FONT_SIZE_SUFFIX: Record<string, string> = {
  sm: 'sm', md: 'sm', lg: 'base', xl: 'lg', xxl: 'xl',
};

function buildCssVars(
  type: string, size: string, disabled: boolean, rounded: boolean,
): Record<string, string> {
  const s          = size;
  const radiusKey  = rounded ? 'rounded' : s;

  if (disabled) {
    return {
      '--sbtn-bg':        'var(--ds-default-surface-disabled)',
      '--sbtn-bg-hover':  'var(--ds-default-surface-disabled)',
      '--sbtn-color':     'var(--ds-default-on-surface-disabled)',
      '--sbtn-shadow':    '0 0 0 0 transparent',
      '--sbtn-min-h':     `var(--ds-button-control-min-height-${s})`,
      '--sbtn-px':        `var(--ds-button-control-padding-px-${s})`,
      '--sbtn-py':        `var(--ds-button-control-padding-py-${s})`,
      '--sbtn-gap':       `var(--ds-button-control-space-between-${s})`,
      '--sbtn-radius':    `var(--ds-button-control-radius-${radiusKey})`,
      '--sbtn-icon-size': `var(--ds-button-control-icon-size-${s})`,
      '--sbtn-font-size': `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
    };
  }

  const bg      = `var(--ds-button-${type}-surface)`;
  const bgHover = `var(--ds-button-${type}-surface-hover, ${bg})`;

  let shadow: string;
  if (type === 'primary') {
    shadow = [
      '0px 1px 2px 0px rgba(10,13,18,0.05)',
      `inset 0 0 0 var(--ds-button-control-border-style-${s}, 2px) var(--ds-button-primary-border, rgba(255,255,255,0.12))`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.05)',
    ].join(', ');
  } else if (type === 'outlined') {
    shadow = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      `inset 0 0 0 var(--ds-button-control-border-default-${s}, 1px) var(--ds-button-outlined-border)`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
  } else {
    shadow = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      'inset 0 0 0 1px rgba(10,13,18,0.02)',
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
  }

  return {
    '--sbtn-bg':        bg,
    '--sbtn-bg-hover':  bgHover,
    '--sbtn-color':     `var(--ds-button-${type}-on-surface)`,
    '--sbtn-shadow':    shadow,
    '--sbtn-min-h':     `var(--ds-button-control-min-height-${s})`,
    '--sbtn-px':        `var(--ds-button-control-padding-px-${s})`,
    '--sbtn-py':        `var(--ds-button-control-padding-py-${s})`,
    '--sbtn-gap':       `var(--ds-button-control-space-between-${s})`,
    '--sbtn-radius':    `var(--ds-button-control-radius-${radiusKey})`,
    '--sbtn-icon-size': `var(--ds-button-control-icon-size-${s})`,
    '--sbtn-font-size': `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
  };
}

export function SplitButton({
  type         = 'primary',
  size         = 'md',
  disabled     = false,
  rounded      = false,
  items,
  triggerLabel = "Plus d'options",
  children,
  leadingIcon,
  onClick,
  onSelect,
  className,
}: SplitButtonReactProps) {
  const [open,     setOpen]     = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef    = useRef<HTMLUListElement>(null);

  const cssVars = buildCssVars(type, size, disabled, rounded);

  // ── Position menu ─────────────────────────────────────────────────────────
  function positionMenu() {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setMenuStyle({
      position: 'fixed',
      zIndex: 9999,
      top:      `${rect.bottom + 4}px`,
      right:    `${window.innerWidth - rect.right}px`,
      minWidth: `${rect.width}px`,
    });
  }

  // ── Toggle dropdown ───────────────────────────────────────────────────────
  async function toggleMenu() {
    if (disabled) return;
    if (!open) {
      positionMenu();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  // Focus first item when menu opens
  useEffect(() => {
    if (!open || !menuRef.current) return;
    const first = menuRef.current.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled])');
    first?.focus();
  }, [open]);

  // ── Close on outside click ────────────────────────────────────────────────
  const handleDocumentClick = useCallback((e: MouseEvent) => {
    const t = e.target as Node;
    if (!wrapperRef.current?.contains(t) && !menuRef.current?.contains(t)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [handleDocumentClick]);

  // ── Select item ───────────────────────────────────────────────────────────
  function selectItem(item: SplitButtonItem) {
    if (item.disabled) return;
    onSelect?.(item);
    setOpen(false);
    triggerRef.current?.focus();
  }

  // ── Keyboard navigation in menu ───────────────────────────────────────────
  function onMenuKeydown(e: React.KeyboardEvent) {
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled])') ?? [],
    );
    if (!menuItems.length) return;

    const idx = menuItems.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      menuItems[(idx + 1) % menuItems.length].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      menuItems[(idx - 1 + menuItems.length) % menuItems.length].focus();
    } else if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  }

  const wrapperClass = [
    'relative inline-block rounded-[var(--sbtn-radius)]',
    'transition-transform duration-100 active:scale-[0.97]',
    hasFocus
      ? 'outline outline-2 outline-offset-2 [outline-color:var(--ds-global-ring-focus,#9fbfff)]'
      : 'outline-none',
    disabled ? 'pointer-events-none cursor-not-allowed' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <div
        ref={wrapperRef}
        style={cssVars as React.CSSProperties}
        className={wrapperClass}
        onFocus={() => setHasFocus(true)}
        onBlur={(e) => {
          if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
            setHasFocus(false);
          }
        }}
      >
        {/* Visual wrapper */}
        <div
          className="inline-flex overflow-hidden rounded-[var(--sbtn-radius)]
                     [box-shadow:var(--sbtn-shadow)]
                     [min-height:var(--sbtn-min-h)]
                     [color:var(--sbtn-color)]
                     [font-family:var(--ds-font-family-sans)]
                     [font-size:var(--sbtn-font-size)]
                     [font-weight:var(--ds-font-weight-bold)]"
        >
          {/* ── Main action ─────────────────────────────────────────────── */}
          <button
            type="button"
            disabled={disabled || undefined}
            aria-disabled={disabled ? 'true' : undefined}
            className="inline-flex shrink-0 items-center justify-center
                       gap-[var(--sbtn-gap)]
                       px-[var(--sbtn-px)] py-[var(--sbtn-py)]
                       [background-color:var(--sbtn-bg)]
                       hover:[background-color:var(--sbtn-bg-hover)]
                       active:[background-color:var(--sbtn-bg-hover)]
                       transition-colors duration-150
                       focus-visible:outline-none
                       whitespace-nowrap select-none"
            onClick={onClick}
          >
            {leadingIcon && (
              <span
                aria-hidden="true"
                className="flex shrink-0 items-center justify-center"
                style={{ width: 'var(--sbtn-icon-size)', height: 'var(--sbtn-icon-size)' } as React.CSSProperties}
              >
                {leadingIcon}
              </span>
            )}
            {children}
          </button>

          {/* ── Divider ─────────────────────────────────────────────────── */}
          <span
            aria-hidden="true"
            className="w-px self-stretch my-2 shrink-0 opacity-20 [background-color:currentColor]"
          />

          {/* ── Dropdown trigger ────────────────────────────────────────── */}
          <button
            ref={triggerRef}
            type="button"
            disabled={disabled || undefined}
            aria-disabled={disabled ? 'true' : undefined}
            aria-expanded={open}
            aria-haspopup="menu"
            aria-label={triggerLabel}
            className="inline-flex shrink-0 items-center justify-center
                       [width:var(--sbtn-min-h)]
                       [background-color:var(--sbtn-bg)]
                       hover:[background-color:var(--sbtn-bg-hover)]
                       active:[background-color:var(--sbtn-bg-hover)]
                       transition-colors duration-150
                       focus-visible:outline-none
                       select-none"
            onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
          >
            <span
              className="flex items-center justify-center transition-transform duration-200"
              style={{
                width: 'var(--sbtn-icon-size)',
                height: 'var(--sbtn-icon-size)',
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              } as React.CSSProperties}
            >
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                   width="100%" height="100%" aria-hidden="true">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* ── Dropdown menu — portalled to <body> ─────────────────────────────── */}
      {open && createPortal(
        <ul
          ref={menuRef}
          role="menu"
          style={menuStyle}
          className="py-1 overflow-hidden
                     [background-color:var(--ds-default-surface)]
                     border [border-color:var(--ds-default-border)]
                     rounded-[var(--ds-button-control-radius-md)]
                     shadow-[0_8px_24px_rgba(10,13,18,0.12),0_2px_6px_rgba(10,13,18,0.06)]"
          onKeyDown={onMenuKeydown}
        >
          {items.map((item) => (
            <li
              key={item.value}
              role="menuitem"
              aria-disabled={item.disabled || undefined}
              tabIndex={item.disabled ? -1 : 0}
              className={[
                'flex items-center',
                'px-[var(--ds-button-control-padding-px-md)]',
                'py-[var(--ds-button-control-padding-py-sm)]',
                '[font-family:var(--ds-font-family-sans)]',
                '[font-size:var(--ds-font-size-sm)]',
                '[font-weight:var(--ds-font-weight-regular)]',
                'whitespace-nowrap select-none',
                'transition-colors duration-100',
                'focus-visible:outline-none',
                item.disabled
                  ? 'cursor-not-allowed [color:var(--ds-default-on-surface-disabled)]'
                  : 'cursor-pointer [color:var(--ds-default-on-surface)] hover:[background-color:var(--ds-default-surface-alt)] focus-visible:[background-color:var(--ds-default-surface-alt)]',
              ].join(' ')}
              onClick={() => selectItem(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  selectItem(item);
                }
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </>
  );
}

export default SplitButton;
