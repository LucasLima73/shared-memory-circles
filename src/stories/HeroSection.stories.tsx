
import type { Meta, StoryObj } from '@storybook/react';
import HeroSection from '../components/home/HeroSection';

const meta = {
  title: 'Seções/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Padrão: Story = {};
