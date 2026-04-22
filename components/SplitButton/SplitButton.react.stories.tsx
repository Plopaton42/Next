import type { Meta, StoryObj } from '@storybook/react';
import { SplitButton } from './SplitButton';
import type { SplitButtonItem } from './SplitButton.types';

const defaultItems: SplitButtonItem[] = [
  { label: 'Enregistrer comme brouillon', value: 'draft' },
  { label: 'Planifier',                   value: 'schedule' },
  { label: 'Archiver',                    value: 'archive', disabled: true },
];

const PlusIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'outlined'],
      description: 'Visual style variant (same as Button)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'xxl'],
      description: 'Size variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables both main action and dropdown trigger',
    },
    rounded: {
      control: 'boolean',
      description: 'Pill / fully-rounded corners',
    },
    items: {
      control: 'object',
      description: 'Array of dropdown items ({ label, value, disabled? })',
    },
    triggerLabel: {
      control: 'text',
      description: 'Accessible label for the chevron trigger button',
    },
  },
  args: {
    type: 'primary',
    size: 'md',
    disabled: false,
    rounded: false,
    items: defaultItems,
    triggerLabel: "Plus d'options",
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: { children: 'Publier' },
};

// ── All Types ─────────────────────────────────────────────────────────────────
export const AllTypes: Story = {
  name: 'All Types',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SplitButton type="primary"   items={defaultItems}>Publier</SplitButton>
      <SplitButton type="secondary" items={defaultItems}>Publier</SplitButton>
      <SplitButton type="tertiary"  items={defaultItems}>Publier</SplitButton>
      <SplitButton type="outlined"  items={defaultItems}>Publier</SplitButton>
    </div>
  ),
};

// ── All Sizes ─────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <SplitButton size="sm"  items={defaultItems}>Publier</SplitButton>
      <SplitButton size="md"  items={defaultItems}>Publier</SplitButton>
      <SplitButton size="lg"  items={defaultItems}>Publier</SplitButton>
      <SplitButton size="xl"  items={defaultItems}>Publier</SplitButton>
      <SplitButton size="xxl" items={defaultItems}>Publier</SplitButton>
    </div>
  ),
};

// ── With Leading Icon ─────────────────────────────────────────────────────────
export const WithLeadingIcon: Story = {
  name: 'With Leading Icon',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SplitButton type="primary"   items={defaultItems} leadingIcon={<PlusIcon />}>Créer</SplitButton>
      <SplitButton type="secondary" items={defaultItems} leadingIcon={<SaveIcon />}>Enregistrer</SplitButton>
    </div>
  ),
};

// ── Rounded ───────────────────────────────────────────────────────────────────
export const Rounded: Story = {
  name: 'Rounded (pill)',
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SplitButton type="primary"   rounded items={defaultItems}>Publier</SplitButton>
      <SplitButton type="secondary" rounded items={defaultItems}>Publier</SplitButton>
      <SplitButton type="outlined"  rounded items={defaultItems}>Publier</SplitButton>
    </div>
  ),
};

// ── Disabled ──────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SplitButton type="primary"   disabled items={defaultItems}>Publier</SplitButton>
      <SplitButton type="secondary" disabled items={defaultItems}>Publier</SplitButton>
      <SplitButton type="outlined"  disabled items={defaultItems}>Publier</SplitButton>
    </div>
  ),
};

// ── With Disabled Items ───────────────────────────────────────────────────────
export const WithDisabledItems: Story = {
  name: 'With Disabled Dropdown Items',
  render: () => (
    <SplitButton
      type="primary"
      items={[
        { label: 'Enregistrer', value: 'save' },
        { label: 'Planifier',   value: 'schedule', disabled: true },
        { label: 'Supprimer',   value: 'delete',   disabled: true },
      ]}
    >
      Publier
    </SplitButton>
  ),
};
