import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['Default', 'Hover', 'Focus', 'Disabled', 'Error'],
      description: 'Visual state of the checkbox',
    },
    checked: {
      control: 'boolean',
      description: 'Initial checked state',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state (visually overrides checked)',
    },
    withContent: {
      control: 'boolean',
      description: 'Show label and helper area',
    },
    label: {
      control: 'text',
      description: 'Primary label text',
    },
    showSecondaryLabel: {
      control: 'boolean',
      description: 'Show secondary label',
    },
    secondaryLabel: {
      control: 'text',
      description: 'Secondary label text',
    },
    showHelper: {
      control: 'boolean',
      description: 'Show helper text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text content',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (shown when state="Error")',
    },
  },
  args: {
    state: 'Default',
    checked: false,
    indeterminate: false,
    withContent: true,
    label: 'Label',
    showSecondaryLabel: false,
    secondaryLabel: '(1)',
    showHelper: true,
    helperText: 'Helper',
    errorMessage: 'Error',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17015-4309&m=dev',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────────────────────────
export const Playground: Story = {};

// ── States ────────────────────────────────────────────────────────────────────
export const Default:  Story = {};
export const Hover:    Story = { args: { state: 'Hover' } };
export const Focus:    Story = { args: { state: 'Focus' } };
export const Disabled: Story = { args: { state: 'Disabled' } };
export const Error:    Story = { args: { state: 'Error' } };

// ── Checked ───────────────────────────────────────────────────────────────────
export const Checked:         Story = { args: { checked: true } };
export const CheckedHover:    Story = { args: { checked: true, state: 'Hover' } };
export const CheckedFocus:    Story = { args: { checked: true, state: 'Focus' } };
export const CheckedDisabled: Story = { args: { checked: true, state: 'Disabled' } };

// ── Indeterminate ─────────────────────────────────────────────────────────────
export const Indeterminate:         Story = { args: { indeterminate: true } };
export const IndeterminateHover:    Story = { args: { indeterminate: true, state: 'Hover' } };
export const IndeterminateFocus:    Story = { args: { indeterminate: true, state: 'Focus' } };
export const IndeterminateDisabled: Story = { args: { indeterminate: true, state: 'Disabled' } };

// ── Content variants ──────────────────────────────────────────────────────────
export const WithSecondaryLabel: Story = { args: { showSecondaryLabel: true } };
export const NoHelper:           Story = { args: { showHelper: false } };
export const NoContent:          Story = { args: { withContent: false } };
