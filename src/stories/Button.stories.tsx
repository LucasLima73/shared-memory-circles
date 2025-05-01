
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/ui/button';

const meta = {
  title: 'Componentes/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Primário: Story = {
  args: {
    children: 'Botão Primário',
    variant: 'default',
  },
};

export const Secundário: Story = {
  args: {
    children: 'Botão Secundário',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Botão Outline',
    variant: 'outline',
  },
};

export const Destructivo: Story = {
  args: {
    children: 'Botão Destructivo',
    variant: 'destructive',
  },
};
