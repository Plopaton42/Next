/**
 * Figma Code Connect — Button
 *
 * Records the mapping between the Figma component and the Vue implementation.
 * Mappings are published to Figma Dev Mode via the Figma MCP server.
 *
 * To republish after changes:
 *   Use the `send_code_connect_mappings` MCP tool with the values below.
 *
 * Figma file:  https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next
 * Component:   Button (node 17187:1090)
 * Published:   2026-04-15
 */
export const buttonFigmaConnect = {
  figmaFileKey: 'zTOrsaTZ0I7JHoBg7bC46z',
  figmaNodeId: '17187:1090',
  figmaUrl: 'https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17187-1090',
  component: 'Button',
  source: 'components/Button/Button.vue',
  label: 'Vue' as const,

  /**
   * Prop mappings: Vue prop → Figma property
   * Note: Figma "type" → Vue "type", Figma "intent" → Vue "intent"
   */
  props: {
    type:     { figmaProp: 'type',         type: 'enum' as const, values: ['primary', 'secondary', 'tertiary', 'outlined', 'ghost', 'inverted'] },
    intent:   { figmaProp: 'intent',       type: 'enum' as const, values: ['Default', 'Destructive'] },
    size:     { figmaProp: 'size',         type: 'enum' as const, values: ['sm', 'md', 'lg', 'xl', 'xxl'] },
    disabled: { figmaProp: 'state',        type: 'boolean' as const },
    iconOnly: { figmaProp: '👁️ icon only', type: 'boolean' as const },
  },

  /** Example snippet rendered in Figma Dev Mode */
  example: `\
<Button
  type="primary"
  intent="default"
  size="md"
>
  Label
</Button>`,
} as const;
