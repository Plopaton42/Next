import type { Preview } from '@storybook/react';
import '../src/style.css';

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
      test: 'todo',
    },
  },
};

export default preview;
