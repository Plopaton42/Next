import type { Meta, StoryObj } from '@storybook/vue3';
import CheckboxRoad2 from './CheckboxRoad2.vue';

const meta = {
  title: 'Components/CheckboxRoad2',
  component: CheckboxRoad2 as any,
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
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { args: { state: 'Hover' } };
export const Focus: Story = { args: { state: 'Focus' } };
export const Disabled: Story = { args: { state: 'Disabled' } };
export const Error: Story = { args: { state: 'Error' } };

export const Checked: Story = { args: { checked: true } };
export const CheckedHover: Story = { args: { checked: true, state: 'Hover' } };
export const CheckedFocus: Story = { args: { checked: true, state: 'Focus' } };
export const CheckedDisabled: Story = { args: { checked: true, state: 'Disabled' } };

export const Indeterminate: Story = { args: { indeterminate: true } };
export const IndeterminateHover: Story = { args: { indeterminate: true, state: 'Hover' } };
export const IndeterminateFocus: Story = { args: { indeterminate: true, state: 'Focus' } };
export const IndeterminateDisabled: Story = { args: { indeterminate: true, state: 'Disabled' } };

export const WithSecondaryLabel: Story = { args: { showSecondaryLabel: true } };
export const NoHelper: Story = { args: { showHelper: false } };
export const NoContent: Story = { args: { withContent: false } };
