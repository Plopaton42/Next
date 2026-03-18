/**
 * Figma Code Connect — Checkbox
 *
 * Records the mapping between the Figma component and the Vue implementation.
 * Mappings are published to Figma Dev Mode via the Figma MCP server.
 *
 * To republish after changes:
 *   Use the `send_code_connect_mappings` tool in the Figma MCP server with the
 *   values below (fileKey, nodeId, source, label).
 *
 * Figma file:  https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next
 * Component:   Checkbox — road (node 17015:4309)
 * Published:   2026-03-18
 */
export const checkboxFigmaConnect = {
  figmaFileKey: 'zTOrsaTZ0I7JHoBg7bC46z',
  figmaNodeId: '17015:4309',
  figmaUrl: 'https://www.figma.com/design/zTOrsaTZ0I7JHoBg7bC46z/Next?node-id=17015-4309',
  component: 'Checkbox',
  source: 'components/Checkbox/Checkbox.vue',
  label: 'Vue' as const,

  /**
   * Prop mappings: Vue prop → Figma property
   *   type: 'boolean' | 'string' | 'enum'
   */
  props: {
    checked:            { figmaProp: 'checked',           type: 'boolean' as const },
    indeterminate:      { figmaProp: 'Indeterminate',     type: 'boolean' as const },
    state:              { figmaProp: 'state',             type: 'enum' as const, values: ['Default', 'Hover', 'Focus', 'Disabled', 'Error'] },
    label:              { figmaProp: '✏️ label',           type: 'string' as const },
    helperText:         { figmaProp: '✏️ helper',          type: 'string' as const },
    errorMessage:       { figmaProp: '✏️ errorMessage',    type: 'string' as const },
    showHelper:         { figmaProp: 'helper',            type: 'boolean' as const },
    withContent:        { figmaProp: 'withContent',       type: 'boolean' as const },
    showSecondaryLabel: { figmaProp: 'secondaryLabel',    type: 'boolean' as const },
    secondaryLabel:     { figmaProp: '✏️ secondaryLabel',  type: 'string' as const },
  },

  /** Example snippet rendered in Figma Dev Mode */
  example: `\
<Checkbox
  v-model:checked="checked"
  :indeterminate="indeterminate"
  :state="state"
  :label="label"
  :helperText="helperText"
  :errorMessage="errorMessage"
  :showHelper="showHelper"
  :withContent="withContent"
  :showSecondaryLabel="showSecondaryLabel"
  :secondaryLabel="secondaryLabel"
/>`,
} as const;
