import type { Meta, StoryObj } from '@storybook/vue3';
import Button from './Button.vue';

const meta = {
  title: 'Components/Button',
  component: Button as any,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'outlined', 'ghost', 'inverted'],
      description: 'Visual style variant (maps to Figma "type" prop)',
    },
    intent: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Color intent — destructive only affects primary and outlined',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Square icon-only layout (place icon in default slot)',
    },
    tag: {
      control: 'select',
      options: ['button', 'a'],
      description: 'Root HTML element',
    },
    nativeType: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native <button> type attribute (only when tag="button")',
    },
  },
  args: {
    type: 'primary',
    intent: 'default',
    size: 'md',
    disabled: false,
    iconOnly: false,
    tag: 'button',
    nativeType: 'button',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17187-1090&m=dev',
    },
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────────────────────────
// All controls are interactive — use the Controls panel to explore every
// combination of type / intent / size / state.
export const Playground: Story = {
  render: (args) => ({
    components: { Button },
    setup: () => ({ args }),
    template: `<Button v-bind="args">Label</Button>`,
  }),
};

// ── Types ─────────────────────────────────────────────────────────────────────
export const Primary: Story = {
  render: () => ({
    components: { Button },
    template: `<Button type="primary">Primary</Button>`,
  }),
};

export const Secondary: Story = {
  render: () => ({
    components: { Button },
    template: `<Button type="secondary">Secondary</Button>`,
  }),
};

export const Tertiary: Story = {
  render: () => ({
    components: { Button },
    template: `<Button type="tertiary">Tertiary</Button>`,
  }),
};

export const Outlined: Story = {
  render: () => ({
    components: { Button },
    template: `<Button type="outlined">Outlined</Button>`,
  }),
};

export const Ghost: Story = {
  render: () => ({
    components: { Button },
    template: `<Button type="ghost">Ghost</Button>`,
  }),
};

export const Inverted: Story = {
  decorators: [
    () => ({
      template: `<div class="p-8 rounded-xl" style="background: var(--ds-button-inverted-surface, #202c46);"><story /></div>`,
    }),
  ],
  render: () => ({
    components: { Button },
    template: `<Button type="inverted">Inverted</Button>`,
  }),
};

// ── All types at once ─────────────────────────────────────────────────────────
export const AllTypes: Story = {
  name: 'All Types',
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button type="primary">Primary</Button>
        <Button type="secondary">Secondary</Button>
        <Button type="tertiary">Tertiary</Button>
        <Button type="outlined">Outlined</Button>
        <Button type="ghost">Ghost</Button>
        <div class="flex items-center rounded-xl px-4 py-3" style="background: var(--ds-button-inverted-surface, #202c46);">
          <Button type="inverted">Inverted</Button>
        </div>
      </div>
    `,
  }),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">X-Large</Button>
        <Button size="xxl">XX-Large</Button>
      </div>
    `,
  }),
};

// ── States ────────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button type="primary" disabled>Primary</Button>
        <Button type="secondary" disabled>Secondary</Button>
        <Button type="tertiary" disabled>Tertiary</Button>
        <Button type="outlined" disabled>Outlined</Button>
        <Button type="ghost" disabled>Ghost</Button>
      </div>
    `,
  }),
};

// ── Destructive intent ────────────────────────────────────────────────────────
export const Destructive: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button type="primary" intent="destructive">Delete</Button>
        <Button type="outlined" intent="destructive">Cancel</Button>
      </div>
    `,
  }),
};

// ── With icons ────────────────────────────────────────────────────────────────
export const WithLeadingIcon: Story = {
  name: 'With Leading Icon',
  render: () => ({
    components: { Button },
    template: `
      <Button type="primary">
        <template #leading>
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </template>
        Add Item
      </Button>
    `,
  }),
};

export const WithTrailingIcon: Story = {
  name: 'With Trailing Icon',
  render: () => ({
    components: { Button },
    template: `
      <Button type="primary">
        Continue
        <template #trailing>
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
      </Button>
    `,
  }),
};

export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Button type="primary" :icon-only="true" aria-label="Add item">
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </Button>
        <Button type="secondary" :icon-only="true" aria-label="Add item">
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </Button>
        <Button type="outlined" :icon-only="true" aria-label="Add item">
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </Button>
        <Button type="ghost" :icon-only="true" aria-label="Add item">
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </Button>
      </div>
    `,
  }),
};

// ── As link ───────────────────────────────────────────────────────────────────
export const AsLink: Story = {
  name: 'As Link (tag="a")',
  render: () => ({
    components: { Button },
    template: `<Button tag="a" href="#">Link Button</Button>`,
  }),
};
