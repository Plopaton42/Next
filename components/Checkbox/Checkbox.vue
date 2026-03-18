<script setup lang="ts">
import { computed, ref, watch } from 'vue';

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

const emit = defineEmits<{
  'update:checked': [value: boolean];
  change: [value: boolean];
}>();

const isDisabled = computed(() => props.state === 'Disabled');

// Internal state — toggles on click, syncs when prop changes externally
const localChecked = ref(props.checked);
watch(() => props.checked, (val) => { localChecked.value = val; });

const isFilled = computed(() => localChecked.value || props.indeterminate);

const isPressed = ref(false);

function toggle() {
  if (isDisabled.value) return;
  localChecked.value = !localChecked.value;
  emit('update:checked', localChecked.value);
  emit('change', localChecked.value);
}

function onPointerDown() { if (!isDisabled.value) isPressed.value = true; }
function onPointerUp()   { isPressed.value = false; }

// ── Box background ─────────────────────────────────────────────────────────────
const boxBg = computed(() => {
  if (isDisabled.value)  return 'var(--ds-surface-surface-disabled, rgba(137,143,160,0.24))';
  if (isFilled.value)    return props.state === 'Hover'
    ? 'var(--ds-input-input-surface-variant, #004293)'
    : 'var(--ds-input-input-surface, #0071dc)';
  return 'var(--ds-surface-surface, #ffffff)';
});

// ── Box border ─────────────────────────────────────────────────────────────────
const boxBorder = computed(() => {
  if (isDisabled.value || isFilled.value) return 'transparent';
  if (props.state === 'Error')  return 'var(--ds-danger-danger-outline, #b2392b)';
  if (props.state === 'Hover')  return 'var(--ds-input-input-outline-variant, #004293)';
  return 'var(--ds-input-input-outline, #6d7488)';
});

// ── Icon color ─────────────────────────────────────────────────────────────────
const iconColor = computed(() =>
  isDisabled.value ? 'rgba(255,255,255,0.5)' : '#ffffff'
);
</script>

<template>
  <div class="inline-flex items-start" style="gap: 12px;">

    <!-- ── Checkbox hit area ───────────────────────────────────────────────── -->
    <button
      type="button"
      role="checkbox"
      :aria-checked="props.indeterminate ? 'mixed' : String(localChecked)"
      :aria-disabled="isDisabled ? 'true' : undefined"
      :disabled="isDisabled"
      class="relative flex shrink-0 cursor-pointer items-center bg-transparent p-0"
      style="border: none; outline: none;"
      :style="{ transform: isPressed ? 'scale(0.88)' : 'scale(1)', transition: 'transform 100ms ease' }"
      @click="toggle"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <!-- ── Visual box ────────────────────────────────────────────────────── -->
      <span
        class="relative flex shrink-0 items-center justify-center"
        style="
          width: 20px; height: 20px;
          border-radius: 4px;
          border-width: 1px; border-style: solid;
          box-sizing: border-box;
          transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
        "
        :style="{
          backgroundColor: boxBg,
          borderColor: boxBorder,
          boxShadow: isFilled && !isDisabled ? '0 0 0 0px var(--ds-input-input-surface, #0071dc)' : 'none',
        }"
      >
        <!-- Checkmark -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-50"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-50"
        >
          <svg
            v-if="localChecked && !props.indeterminate"
            key="check"
            width="12" height="10" viewBox="0 0 12 10"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style="display: block;"
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              :stroke="iconColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Transition>

        <!-- Dash (indeterminate) -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-x-0"
          enter-to-class="opacity-100 scale-x-100"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 scale-x-100"
          leave-to-class="opacity-0 scale-x-0"
        >
          <svg
            v-if="props.indeterminate"
            key="dash"
            width="10" height="2" viewBox="0 0 10 2"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style="display: block;"
          >
            <path
              d="M1 1H9"
              :stroke="iconColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </Transition>

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
      style="gap: 2px; cursor: pointer;"
      @click="toggle"
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
            user-select: none;
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
            user-select: none;
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
