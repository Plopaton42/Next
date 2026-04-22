import { useState, useEffect, useRef } from 'react';
import type { CheckboxProps } from './Checkbox.types';

/**
 * Checkbox — React version. Mirrors Checkbox.vue prop-for-prop.
 *
 * v-model (update:checked + change) → onChange callback.
 * Animations are CSS transitions on always-mounted icon elements,
 * equivalent to Vue <Transition> enter/leave behaviour.
 */

interface CheckboxReactProps extends CheckboxProps {
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  checked           = false,
  indeterminate     = false,
  state             = 'Default',
  label             = 'Label',
  secondaryLabel    = '(1)',
  showSecondaryLabel = false,
  helperText        = 'Helper',
  showHelper        = true,
  errorMessage      = 'Error',
  withContent       = true,
  onChange,
  className,
}: CheckboxReactProps) {
  const isDisabled   = state === 'Disabled';
  const [localChecked, setLocalChecked] = useState(checked);
  const [isPressed, setIsPressed]       = useState(false);

  // Sync external prop → internal state
  useEffect(() => { setLocalChecked(checked); }, [checked]);

  const isFilled = localChecked || indeterminate;

  function toggle() {
    if (isDisabled) return;
    const next = !localChecked;
    setLocalChecked(next);
    onChange?.(next);
  }

  // ── Box background ──────────────────────────────────────────────────────────
  const boxBg = isDisabled
    ? 'var(--ds-surface-surface-disabled, rgba(137,143,160,0.24))'
    : isFilled
      ? state === 'Hover'
        ? 'var(--ds-input-input-surface-variant, #004293)'
        : 'var(--ds-input-input-surface, #0071dc)'
      : 'var(--ds-surface-surface, #ffffff)';

  // ── Box border ──────────────────────────────────────────────────────────────
  const boxBorder = isDisabled || isFilled
    ? 'transparent'
    : state === 'Error'
      ? 'var(--ds-danger-danger-outline, #b2392b)'
      : state === 'Hover'
        ? 'var(--ds-input-input-outline-variant, #004293)'
        : 'var(--ds-input-input-outline, #6d7488)';

  const iconColor = isDisabled ? 'rgba(255,255,255,0.5)' : '#ffffff';

  // Icon visibility
  const showCheck = localChecked && !indeterminate;
  const showDash  = indeterminate;

  return (
    <div
      className={['inline-flex items-start', className].filter(Boolean).join(' ')}
      style={{ gap: '12px' }}
    >
      {/* ── Checkbox hit area ─────────────────────────────────────────────── */}
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : String(localChecked)}
        aria-disabled={isDisabled ? 'true' : undefined}
        disabled={isDisabled}
        className="relative flex shrink-0 cursor-pointer items-center bg-transparent p-0"
        style={{
          border: 'none',
          outline: 'none',
          transform: isPressed ? 'scale(0.88)' : 'scale(1)',
          transition: 'transform 100ms ease',
        }}
        onClick={toggle}
        onPointerDown={() => { if (!isDisabled) setIsPressed(true); }}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
      >
        {/* ── Visual box ──────────────────────────────────────────────────── */}
        <span
          className="relative flex shrink-0 items-center justify-center"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            borderWidth: '1px',
            borderStyle: 'solid',
            boxSizing: 'border-box',
            backgroundColor: boxBg,
            borderColor: boxBorder,
            boxShadow: isFilled && !isDisabled ? '0 0 0 0px var(--ds-input-input-surface, #0071dc)' : 'none',
            transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
          }}
        >
          {/* Checkmark — always mounted, animated via CSS */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: showCheck ? 1 : 0,
              transform: showCheck ? 'scale(1)' : 'scale(0.5)',
              transition: showCheck
                ? 'opacity 200ms ease-out, transform 200ms ease-out'
                : 'opacity 100ms ease-in, transform 100ms ease-in',
            }}
          >
            <svg
              width="12" height="10" viewBox="0 0 12 10"
              fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5L4.5 8.5L11 1.5"
                stroke={iconColor}
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {/* Dash (indeterminate) — always mounted, animated via CSS */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: showDash ? 1 : 0,
              transform: `scaleX(${showDash ? 1 : 0})`,
              transition: showDash
                ? 'opacity 200ms ease-out, transform 200ms ease-out'
                : 'opacity 100ms ease-in, transform 100ms ease-in',
            }}
          >
            <svg
              width="10" height="2" viewBox="0 0 10 2"
              fill="none" xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1H9"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>

          {/* Focus ring */}
          {state === 'Focus' && !isDisabled && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: '26px',
                height: '26px',
                borderRadius: '7px',
                border: '1px solid var(--ds-input-input-outline-variant, #004293)',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </span>
      </button>

      {/* ── Content (label + helper / error) ─────────────────────────────── */}
      {withContent && (
        <div
          className="flex flex-col items-start"
          style={{ gap: '2px', cursor: 'pointer' }}
          onClick={toggle}
        >
          {/* Labels row */}
          <div className="flex items-baseline" style={{ gap: '4px' }}>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'var(--ds-surface-on-surface, #11151d)',
                userSelect: 'none',
              }}
            >
              {label}
            </span>

            {showSecondaryLabel && (
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: 'var(--ds-surface-on-surface-weak, #51586c)',
                  userSelect: 'none',
                }}
              >
                {secondaryLabel}
              </span>
            )}
          </div>

          {/* Error message */}
          {state === 'Error' && (
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'var(--ds-danger-on-danger-surface, #6b221a)',
              }}
            >
              {errorMessage}
            </span>
          )}

          {/* Helper text */}
          {state !== 'Error' && showHelper && (
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'var(--ds-surface-on-surface-weak, #51586c)',
              }}
            >
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Checkbox;
