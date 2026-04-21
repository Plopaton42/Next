<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

export interface SplitButtonItem {
  label: string;
  value: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<{
  /** Visual style — ghost excluded (invisible border makes the split ambiguous) */
  type?: 'primary' | 'secondary' | 'tertiary' | 'outlined';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  /** Disables both main action and dropdown trigger */
  disabled?: boolean;
  /** Pill / fully-rounded corners */
  rounded?: boolean;
  /** Dropdown menu items */
  items: SplitButtonItem[];
  /** Accessible label for the dropdown trigger button */
  triggerLabel?: string;
}>(), {
  type: 'primary',
  size: 'md',
  disabled: false,
  rounded: false,
  triggerLabel: 'Plus d\'options',
});

const emit = defineEmits<{
  /** Fired when the main action area is clicked */
  click: [event: MouseEvent];
  /** Fired when a dropdown item is selected */
  select: [item: SplitButtonItem];
}>();

const open        = ref(false);
const hasFocus    = ref(false);
const wrapperRef  = ref<HTMLElement | null>(null);
const triggerRef  = ref<HTMLButtonElement | null>(null);
const menuRef     = ref<HTMLUListElement | null>(null);
const menuStyle   = ref<Record<string, string>>({});

const FONT_SIZE_SUFFIX: Record<string, string> = {
  sm: 'sm', md: 'sm', lg: 'base', xl: 'lg', xxl: 'xl',
};

const cssVars = computed<Record<string, string>>(() => {
  const pfx       = props.type;
  const s         = props.size;
  const radiusKey = props.rounded ? 'rounded' : s;

  if (props.disabled) {
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

  const bg      = `var(--ds-button-${pfx}-surface)`;
  const bgHover = `var(--ds-button-${pfx}-surface-hover, ${bg})`;

  let shadow: string;
  if (pfx === 'primary') {
    shadow = [
      '0px 1px 2px 0px rgba(10,13,18,0.05)',
      `inset 0 0 0 var(--ds-button-control-border-style-${s}, 2px) var(--ds-button-primary-border, rgba(255,255,255,0.12))`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.05)',
    ].join(', ');
  } else if (pfx === 'outlined') {
    shadow = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      `inset 0 0 0 var(--ds-button-control-border-default-${s}, 1px) var(--ds-button-outlined-border)`,
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
  } else {
    // secondary, tertiary
    shadow = [
      '0px 1px 2px 0px rgba(10,13,18,0.01)',
      'inset 0 0 0 1px rgba(10,13,18,0.02)',
      'inset 0 -2px 0 0 rgba(10,13,18,0.01)',
    ].join(', ');
  }

  return {
    '--sbtn-bg':        bg,
    '--sbtn-bg-hover':  bgHover,
    '--sbtn-color':     `var(--ds-button-${pfx}-on-surface)`,
    '--sbtn-shadow':    shadow,
    '--sbtn-min-h':     `var(--ds-button-control-min-height-${s})`,
    '--sbtn-px':        `var(--ds-button-control-padding-px-${s})`,
    '--sbtn-py':        `var(--ds-button-control-padding-py-${s})`,
    '--sbtn-gap':       `var(--ds-button-control-space-between-${s})`,
    '--sbtn-radius':    `var(--ds-button-control-radius-${radiusKey})`,
    '--sbtn-icon-size': `var(--ds-button-control-icon-size-${s})`,
    '--sbtn-font-size': `var(--ds-font-size-${FONT_SIZE_SUFFIX[s]})`,
  };
});

// ── Focus tracking ────────────────────────────────────────────────────────────
// The outer wrapper shows the focus ring. overflow:hidden is on the inner visual
// wrapper only, so the CSS outline on the outer wrapper is never clipped.

function onFocusIn() {
  hasFocus.value = true;
}

function onFocusOut(e: FocusEvent) {
  if (!wrapperRef.value?.contains(e.relatedTarget as Node)) {
    hasFocus.value = false;
  }
}

// ── Dropdown ──────────────────────────────────────────────────────────────────

async function toggleMenu() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    await nextTick();
    positionMenu();
    const first = menuRef.value?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled])');
    first?.focus();
  }
}

function closeMenu() {
  open.value = false;
}

function positionMenu() {
  if (!wrapperRef.value) return;
  const rect = wrapperRef.value.getBoundingClientRect();
  // Align the menu's right edge with the button group's right edge.
  menuStyle.value = {
    top:      `${rect.bottom + 4}px`,
    right:    `${window.innerWidth - rect.right}px`,
    minWidth: `${rect.width}px`,
  };
}

function selectItem(item: SplitButtonItem) {
  if (item.disabled) return;
  emit('select', item);
  closeMenu();
  triggerRef.value?.focus();
}

function onMenuKeydown(e: KeyboardEvent) {
  const items = Array.from(
    menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled])') ?? [],
  );
  if (!items.length) return;

  const idx = items.indexOf(document.activeElement as HTMLElement);

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    items[(idx + 1) % items.length].focus();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    items[(idx - 1 + items.length) % items.length].focus();
  } else if (e.key === 'Escape') {
    closeMenu();
    triggerRef.value?.focus();
  } else if (e.key === 'Tab') {
    closeMenu();
  }
}

function onDocumentClick(e: MouseEvent) {
  const t = e.target as Node;
  if (!wrapperRef.value?.contains(t) && !menuRef.value?.contains(t)) {
    closeMenu();
  }
}

onMounted(()  => document.addEventListener('click', onDocumentClick));
onUnmounted(() => document.removeEventListener('click', onDocumentClick));
</script>

<template>
  <!--
    Two-wrapper strategy:
    - Outer (wrapperRef): no overflow, shows CSS outline focus ring
    - Inner: overflow:hidden to clip children to border-radius + carries box-shadow border
  -->
  <div
    ref="wrapperRef"
    :style="cssVars"
    class="relative inline-block rounded-[var(--sbtn-radius)]
           transition-transform duration-100 active:scale-[0.97]"
    :class="[
      hasFocus
        ? 'outline outline-2 outline-offset-2 [outline-color:var(--ds-global-ring-focus,#9fbfff)]'
        : 'outline-none',
      disabled ? 'pointer-events-none cursor-not-allowed' : '',
    ]"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <!-- Visual wrapper -->
    <div
      class="inline-flex overflow-hidden rounded-[var(--sbtn-radius)]
             [box-shadow:var(--sbtn-shadow)]
             [min-height:var(--sbtn-min-h)]
             [color:var(--sbtn-color)]
             [font-family:var(--ds-font-family-sans)]
             [font-size:var(--sbtn-font-size)]
             [font-weight:var(--ds-font-weight-bold)]"
    >

      <!-- ── Main action ───────────────────────────────────────────────────── -->
      <button
        type="button"
        :disabled="disabled || undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        class="inline-flex shrink-0 items-center justify-center
               gap-[var(--sbtn-gap)]
               px-[var(--sbtn-px)] py-[var(--sbtn-py)]
               [background-color:var(--sbtn-bg)]
               hover:[background-color:var(--sbtn-bg-hover)]
               active:[background-color:var(--sbtn-bg-hover)]
               transition-colors duration-150
               focus-visible:outline-none
               whitespace-nowrap select-none"
        @click="emit('click', $event)"
      >
        <span
          v-if="$slots.leading"
          aria-hidden="true"
          class="flex shrink-0 items-center justify-center"
          :style="{ width: 'var(--sbtn-icon-size)', height: 'var(--sbtn-icon-size)' }"
        >
          <slot name="leading" />
        </span>
        <slot />
      </button>

      <!-- ── Divider ───────────────────────────────────────────────────────── -->
      <span
        aria-hidden="true"
        class="w-px self-stretch my-2 shrink-0 opacity-20 [background-color:currentColor]"
      />

      <!-- ── Dropdown trigger ──────────────────────────────────────────────── -->
      <button
        ref="triggerRef"
        type="button"
        :disabled="disabled || undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-expanded="open"
        aria-haspopup="menu"
        :aria-label="triggerLabel"
        class="inline-flex shrink-0 items-center justify-center
               [width:var(--sbtn-min-h)]
               [background-color:var(--sbtn-bg)]
               hover:[background-color:var(--sbtn-bg-hover)]
               active:[background-color:var(--sbtn-bg-hover)]
               transition-colors duration-150
               focus-visible:outline-none
               select-none"
        @click.stop="toggleMenu"
      >
        <span
          class="flex items-center justify-center transition-transform duration-200"
          :class="{ 'rotate-180': open }"
          :style="{ width: 'var(--sbtn-icon-size)', height: 'var(--sbtn-icon-size)' }"
        >
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
               width="100%" height="100%" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>

    </div>
  </div>

  <!-- ── Dropdown menu ────────────────────────────────────────────────────────
       Teleported to <body> to avoid clipping from parent overflow:hidden.
       Positioned with fixed coords derived from wrapperRef.getBoundingClientRect().
  -->
  <Teleport to="body">
    <ul
      v-if="open"
      ref="menuRef"
      role="menu"
      :style="{ position: 'fixed', zIndex: '9999', ...menuStyle }"
      class="py-1 overflow-hidden
             [background-color:var(--ds-default-surface)]
             border [border-color:var(--ds-default-border)]
             rounded-[var(--ds-button-control-radius-md)]
             shadow-[0_8px_24px_rgba(10,13,18,0.12),0_2px_6px_rgba(10,13,18,0.06)]"
      @keydown="onMenuKeydown"
    >
      <li
        v-for="item in items"
        :key="item.value"
        role="menuitem"
        :aria-disabled="item.disabled || undefined"
        :tabindex="item.disabled ? -1 : 0"
        class="flex items-center
               px-[var(--ds-button-control-padding-px-md)]
               py-[var(--ds-button-control-padding-py-sm)]
               [font-family:var(--ds-font-family-sans)]
               [font-size:var(--ds-font-size-sm)]
               [font-weight:var(--ds-font-weight-regular)]
               whitespace-nowrap select-none
               transition-colors duration-100
               focus-visible:outline-none"
        :class="item.disabled
          ? 'cursor-not-allowed [color:var(--ds-default-on-surface-disabled)]'
          : 'cursor-pointer [color:var(--ds-default-on-surface)] hover:[background-color:var(--ds-default-surface-alt)] focus-visible:[background-color:var(--ds-default-surface-alt)]'"
        @click="selectItem(item)"
        @keydown.enter.prevent="selectItem(item)"
        @keydown.space.prevent="selectItem(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </Teleport>
</template>
