// Figma Code Connect — SplitButton
// No Figma component exists yet for SplitButton.
// Update this file once the component is added to the Figma library.

export const splitButtonFigmaConnect = {
  figmaFileKey: 'zTOrsaTZ0I7JHoBg7bC46z',
  figmaNodeId: '',
  figmaUrl: '',
  component: 'SplitButton',
  source: 'components/SplitButton/SplitButton.vue',
  label: 'Vue' as const,
  props: {
    type:     { figmaProp: 'type',     type: 'enum' as const },
    size:     { figmaProp: 'size',     type: 'enum' as const },
    disabled: { figmaProp: 'disabled', type: 'boolean' as const },
    rounded:  { figmaProp: 'rounded',  type: 'boolean' as const },
  },
  example: `<SplitButton type="primary" :items="[{ label: 'Action', value: 'action' }]">Label</SplitButton>`,
} as const;
