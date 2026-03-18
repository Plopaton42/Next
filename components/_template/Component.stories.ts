import type { Meta, StoryObj } from '@storybook/vue3';
import Component from './Component.vue';

/**
 * INSTRUCTIONS — remplace tout ce qui est entre [crochets] et supprime ce bloc.
 *
 * 1. Renomme ce fichier en [ComponentName].stories.ts
 * 2. Remplace toutes les occurrences de "Component" par le vrai nom
 * 3. Remplis argTypes avec chaque prop (contrôle adapté au type)
 * 4. Remplis args avec les valeurs par défaut
 * 5. Ajoute une story par variant/état visible dans Figma
 * 6. Ne supprime pas la story Playground — elle est obligatoire
 */

const meta = {
  title: 'Components/[ComponentName]',
  component: Component as any,
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
    //   description: 'Button label',
    // },
    // size: {
    //   control: 'radio',
    //   options: ['sm', 'md', 'lg'],
    //   description: 'Component size',
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
} satisfies Meta<any>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Playground ────────────────────────────────────────────────────────────────
// Story obligatoire sur chaque composant.
// Permet de tweaker toutes les props en live via le panneau Controls.
export const Playground: Story = {};

// ── États / Variants ──────────────────────────────────────────────────────────
// TODO: une story par variant et par état visible dans Figma.
// Exemples :
//
// export const Default: Story = {};
// export const Hover: Story = { args: { state: 'Hover' } };
// export const Disabled: Story = { args: { disabled: true } };
// export const Primary: Story = { args: { variant: 'primary' } };
// export const Secondary: Story = { args: { variant: 'secondary' } };
