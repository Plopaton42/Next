import type { Preview } from '@storybook/vue3-vite'
import '../src/style.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface',         value: 'var(--ds-default-surface, #ffffff)' },
        { name: 'surface-inverse', value: 'var(--ds-default-surface-inverse, #1a1a2e)' },
      ],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;