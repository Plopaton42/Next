import type { Meta, StoryObj } from '@storybook/vue3';
import SplitButton from './SplitButton.vue';
import type { SplitButtonItem } from './SplitButton.vue';

const defaultItems: SplitButtonItem[] = [
  { label: 'Enregistrer comme brouillon', value: 'draft' },
  { label: 'Planifier', value: 'schedule' },
  { label: 'Archiver', value: 'archive', disabled: true },
];

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton as any,
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
    triggerLabel: 'Plus d\'options',
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────────────────────────
export const Playground: Story = {
  render: (args) => ({
    components: { SplitButton },
    setup: () => ({ args }),
    template: `<SplitButton v-bind="args">Publier</SplitButton>`,
  }),
};

// ── All Types ─────────────────────────────────────────────────────────────────
export const AllTypes: Story = {
  name: 'All Types',
  render: () => ({
    components: { SplitButton },
    setup: () => ({ items: defaultItems }),
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <SplitButton type="primary"   :items="items">Publier</SplitButton>
        <SplitButton type="secondary" :items="items">Publier</SplitButton>
        <SplitButton type="tertiary"  :items="items">Publier</SplitButton>
        <SplitButton type="outlined"  :items="items">Publier</SplitButton>
      </div>
    `,
  }),
};

// ── All Sizes ─────────────────────────────────────────────────────────────────
export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => ({
    components: { SplitButton },
    setup: () => ({ items: defaultItems }),
    template: `
      <div class="flex flex-wrap items-end gap-4">
        <SplitButton size="sm"  :items="items">Publier</SplitButton>
        <SplitButton size="md"  :items="items">Publier</SplitButton>
        <SplitButton size="lg"  :items="items">Publier</SplitButton>
        <SplitButton size="xl"  :items="items">Publier</SplitButton>
        <SplitButton size="xxl" :items="items">Publier</SplitButton>
      </div>
    `,
  }),
};

// ── With Leading Icon ─────────────────────────────────────────────────────────
export const WithLeadingIcon: Story = {
  name: 'With Leading Icon',
  render: () => ({
    components: { SplitButton },
    setup: () => ({ items: defaultItems }),
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <SplitButton type="primary" :items="items">
          <template #leading>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </template>
          Créer
        </SplitButton>
        <SplitButton type="secondary" :items="items">
          <template #leading>
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <polyline points="7 3 7 8 15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </template>
          Enregistrer
        </SplitButton>
      </div>
    `,
  }),
};

// ── Rounded ───────────────────────────────────────────────────────────────────
export const Rounded: Story = {
  name: 'Rounded (pill)',
  render: () => ({
    components: { SplitButton },
    setup: () => ({ items: defaultItems }),
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <SplitButton type="primary"   :rounded="true" :items="items">Publier</SplitButton>
        <SplitButton type="secondary" :rounded="true" :items="items">Publier</SplitButton>
        <SplitButton type="outlined"  :rounded="true" :items="items">Publier</SplitButton>
      </div>
    `,
  }),
};

// ── Disabled ──────────────────────────────────────────────────────────────────
export const Disabled: Story = {
  render: () => ({
    components: { SplitButton },
    setup: () => ({ items: defaultItems }),
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <SplitButton type="primary"   :disabled="true" :items="items">Publier</SplitButton>
        <SplitButton type="secondary" :disabled="true" :items="items">Publier</SplitButton>
        <SplitButton type="outlined"  :disabled="true" :items="items">Publier</SplitButton>
      </div>
    `,
  }),
};

// ── With Disabled Items ───────────────────────────────────────────────────────
export const WithDisabledItems: Story = {
  name: 'With Disabled Dropdown Items',
  render: () => ({
    components: { SplitButton },
    setup: () => ({
      items: [
        { label: 'Enregistrer', value: 'save' },
        { label: 'Planifier', value: 'schedule', disabled: true },
        { label: 'Supprimer', value: 'delete', disabled: true },
      ] as SplitButtonItem[],
    }),
    template: `<SplitButton type="primary" :items="items">Publier</SplitButton>`,
  }),
};
