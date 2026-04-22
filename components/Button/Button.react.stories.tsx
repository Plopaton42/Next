import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'outlined', 'ghost', 'inverted'],
      description: 'Visual style variant (maps to Figma "type" prop)',
    },
    intent: {
      control: 'select',
      options: ['default', 'destructive', 'alternative'],
      description: 'Color intent — destructive affects primary/secondary/outlined, alternative affects primary/secondary/tertiary',
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
    rounded: {
      control: 'boolean',
      description: 'Pill / fully-rounded radius',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Square icon-only layout (place icon in children)',
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
    rounded: false,
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
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: { children: 'Label' },
};

// ── All Types ─────────────────────────────────────────────────────────────────
export const AllTypes: Story = {
  name: 'All Types — Default',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="primary">Primary</Button>
      <Button type="secondary">Secondary</Button>
      <Button type="tertiary">Tertiary</Button>
      <Button type="outlined">Outlined</Button>
      <Button type="ghost">Ghost</Button>
      <div className="flex items-center rounded-xl px-4 py-3" style={{ background: 'var(--ds-button-inverted-surface, #202c46)' }}>
        <Button type="inverted">Inverted</Button>
      </div>
    </div>
  ),
};

// ── Individual Types ──────────────────────────────────────────────────────────
export const Primary:  Story = { render: () => <Button type="primary">Primary</Button> };
export const Secondary: Story = { render: () => <Button type="secondary">Secondary</Button> };
export const Tertiary: Story = { render: () => <Button type="tertiary">Tertiary</Button> };
export const Outlined: Story = { render: () => <Button type="outlined">Outlined</Button> };
export const Ghost:    Story = { render: () => <Button type="ghost">Ghost</Button> };

export const Inverted: Story = {
  decorators: [
    (Story) => (
      <div className="p-8 rounded-xl" style={{ background: 'var(--ds-button-inverted-surface, #202c46)' }}>
        <Story />
      </div>
    ),
  ],
  render: () => <Button type="inverted">Inverted</Button>,
};

// ── Sizes ─────────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">X-Large</Button>
      <Button size="xxl">XX-Large</Button>
    </div>
  ),
};

// ── Disabled ──────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="primary"   disabled>Primary</Button>
      <Button type="secondary" disabled>Secondary</Button>
      <Button type="tertiary"  disabled>Tertiary</Button>
      <Button type="outlined"  disabled>Outlined</Button>
      <Button type="ghost"     disabled>Ghost</Button>
    </div>
  ),
};

// ── Rounded (pill) ────────────────────────────────────────────────────────────
export const Rounded: Story = {
  name: 'Rounded (pill)',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="primary"   rounded>Primary</Button>
      <Button type="secondary" rounded>Secondary</Button>
      <Button type="tertiary"  rounded>Tertiary</Button>
      <Button type="outlined"  rounded>Outlined</Button>
      <Button type="ghost"     rounded>Ghost</Button>
      <Button type="primary"   intent="alternative" rounded>Alternative</Button>
    </div>
  ),
};

// ── Destructive intent ────────────────────────────────────────────────────────
export const Destructive: Story = {
  name: 'Intent — Destructive',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="primary"  intent="destructive">Delete</Button>
      <Button type="secondary" intent="destructive">Cancel</Button>
      <Button type="outlined"  intent="destructive">Remove</Button>
    </div>
  ),
};

// ── Alternative intent ────────────────────────────────────────────────────────
export const Alternative: Story = {
  name: 'Intent — Alternative',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="primary"   intent="alternative">Primary</Button>
      <Button type="secondary" intent="alternative">Secondary</Button>
      <Button type="tertiary"  intent="alternative">Brand</Button>
      <Button type="primary"   intent="alternative" disabled>Disabled</Button>
    </div>
  ),
};

// ── All Intents × Primary ─────────────────────────────────────────────────────
export const AllIntents: Story = {
  name: 'All Intents (primary)',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="primary" intent="default">Default</Button>
      <Button type="primary" intent="destructive">Destructive</Button>
      <Button type="primary" intent="alternative">Alternative</Button>
    </div>
  ),
};

// ── With icons ────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WithLeadingIcon: Story = {
  name: 'With Leading Icon',
  render: () => (
    <Button type="primary" leadingIcon={<PlusIcon />}>Add Item</Button>
  ),
};

export const WithTrailingIcon: Story = {
  name: 'With Trailing Icon',
  render: () => (
    <Button type="primary" trailingIcon={<ChevronIcon />}>Continue</Button>
  ),
};

export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button type="primary"   iconOnly aria-label="Add item"><PlusIcon /></Button>
      <Button type="secondary" iconOnly aria-label="Add item"><PlusIcon /></Button>
      <Button type="outlined"  iconOnly aria-label="Add item"><PlusIcon /></Button>
      <Button type="ghost"     iconOnly aria-label="Add item"><PlusIcon /></Button>
    </div>
  ),
};

// ── As link ───────────────────────────────────────────────────────────────────
export const AsLink: Story = {
  name: 'As Link (tag="a")',
  render: () => <Button tag="a" href="#">Link Button</Button>,
};
