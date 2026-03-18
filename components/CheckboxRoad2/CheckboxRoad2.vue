<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  checked?: boolean;
  indeterminate?: boolean;
  state?: 'Default' | 'Hover' | 'Focus' | 'Disabled' | 'Error';
  label?: string;
  secondaryLabel?: string;
  showSecondaryLabel?: boolean;
  helperText?: string;
  showHelper?: boolean;
  errorMessage?: string;
  withContent?: boolean;
}>(), {
  checked: false,
  indeterminate: false,
  state: 'Default',
  label: 'Label',
  secondaryLabel: '(1)',
  showSecondaryLabel: false,
  helperText: 'Helper',
  showHelper: true,
  errorMessage: 'Error',
  withContent: true,
});

const isDisabled = computed(() => props.state === 'Disabled');
const isFilled   = computed(() => props.checked || props.indeterminate);

// ── Box background ────────────────────────────────────────────────────────────
const boxBg = computed(() => {
  if (isDisabled.value)  return 'var(--ds-surface-surface-disabled, rgba(137,143,160,0.24))';
  if (isFilled.value)    return props.state === 'Hover'
    ? 'var(--ds-input-input-surface-variant, #004293)'
    : 'var(--ds-input-input-surface, #0071dc)';
  return 'var(--ds-surface-surface, #ffffff)';
});

// ── Box border ────────────────────────────────────────────────────────────────
const boxBorder = computed(() => {
  if (isDisabled.value || isFilled.value) return 'transparent';
  if (props.state === 'Error')  return 'var(--ds-danger-danger-outline, #b2392b)';
  if (props.state === 'Hover')  return 'var(--ds-input-input-outline-variant, #004293)';
  return 'var(--ds-input-input-outline, #6d7488)';
});

// ── Icon color inside the box ─────────────────────────────────────────────────
const iconColor = computed(() =>
  isDisabled.value ? 'rgba(255,255,255,0.5)' : '#ffffff'
);
</script>

<template>
  <div class="inline-flex items-start" style="gap: 12px;">

    <!-- ── Checkbox hit area ────────────────────────────────────────────────── -->
    <button
      type="button"
      role="checkbox"
      :aria-checked="props.indeterminate ? 'mixed' : String(props.checked)"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :disabled="isDisabled"
      class="relative flex shrink-0 cursor-pointer items-center bg-transparent p-0"
      style="border: none; outline: none;"
    >
      <!-- ── Visual box ───────────────────────────────────────────────────── -->
      <span
        class="relative flex shrink-0 items-center justify-center"
        style="width: 20px; height: 20px; border-radius: 4px; border-width: 1px; border-style: solid; box-sizing: border-box;"
        :style="{
          backgroundColor: boxBg,
          borderColor: boxBorder,
        }"
      >

        <!-- Checkmark (checked, not indeterminate) -->
        <svg
          v-if="props.checked && !props.indeterminate"
          width="12" height="10" viewBox="0 0 12 10"
          fill="none" xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 5L4.5 8.5L11 1.5"
            :stroke="iconColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <!-- Dash (indeterminate) -->
        <svg
          v-else-if="props.indeterminate"
          width="10" height="2" viewBox="0 0 10 2"
          fill="none" xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 1H9"
            :stroke="iconColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <!-- Focus ring -->
        <span
          v-if="props.state === 'Focus' && !isDisabled"
          class="absolute"
          style="
            width: 26px; height: 26px;
            border-radius: 7px;
            border: 1px solid var(--ds-input-input-outline-variant, #004293);
            left: 50%; top: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
          "
          aria-hidden="true"
        />
      </span>
    </button>

    <!-- ── Content (label + helper / error) ───────────────────────────────── -->
    <div
      v-if="props.withContent"
      class="flex flex-col items-start"
      style="gap: 2px;"
    >

      <!-- Labels row -->
      <div class="flex items-baseline" style="gap: 4px;">
        <span
          style="
            font-family: 'DM Sans', sans-serif;
            font-size: 16px;
            font-weight: 400;
            line-height: 1.5;
            color: var(--ds-surface-on-surface, #11151d);
          "
        >{{ props.label }}</span>

        <span
          v-if="props.showSecondaryLabel"
          style="
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.5;
            color: var(--ds-surface-on-surface-weak, #51586c);
          "
        >{{ props.secondaryLabel }}</span>
      </div>

      <!-- Error message -->
      <span
        v-if="props.state === 'Error'"
        style="
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          color: var(--ds-danger-on-danger-surface, #6b221a);
        "
      >{{ props.errorMessage }}</span>

      <!-- Helper text -->
      <span
        v-else-if="props.showHelper"
        style="
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          color: var(--ds-surface-on-surface-weak, #51586c);
        "
      >{{ props.helperText }}</span>

    </div>
  </div>
</template>
