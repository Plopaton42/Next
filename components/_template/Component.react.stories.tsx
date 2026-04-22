import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';

/**
 * INSTRUCTIONS — remplace tout ce qui est entre [crochets] et supprime ce bloc.
 *
 * 1. Renomme ce fichier en [ComponentName].react.stories.tsx
 * 2. Remplace toutes les occurrences de "Component" par le vrai nom
 * 3. Remplis argTypes avec chaque prop (contrôle adapté au type)
 * 4. Remplis args avec les valeurs par défaut
 * 5. Ajoute une story par variant/état visible dans Figma
 * 6. Ne supprime pas la story Playground — elle est obligatoire
 *
 * Convention de nommage :
 *   - Stories Vue   → [ComponentName].stories.ts
 *   - Stories React → [ComponentName].react.stories.tsx
 */

const meta = {
  title: 'Components/[ComponentName]',
  component: Component,
  tags: ['autodocs'],
  argTypes: {
    // TODO: une entrée par prop, avec le bon control
    // Exemples :
    //
    // variant: {
    //   control: 'select',
    //   options: ['primary', 'secondary', 'ghost'],
    //   description: 'Visual variant',
    // },
    // disabled: {
    //   control: 'boolean',
    //   description: 'Disabled state',
    // },
    // label: {
    //   control: 'text',
    //   description: 'Component label',
    // },
  },
  args: {
    // TODO: valeurs par défaut de toutes les props
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'TODO: colle ici le lien Figma du composant',
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────────────────────────
// Story obligatoire sur chaque composant.
export const Playground: Story = {};

// ── États / Variants ──────────────────────────────────────────────────────────
// TODO: une story par variant et par état visible dans Figma.
// Exemples :
//
// export const Default: Story = {};
// export const Hover:   Story = { args: { state: 'Hover' } };
// export const Primary: Story = { render: () => <Component variant="primary">Label</Component> };
