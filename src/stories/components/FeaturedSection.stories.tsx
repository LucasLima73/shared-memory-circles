import type { Meta, StoryObj } from '@storybook/react';
import FeaturedSection from '../../components/home/FeaturedSection';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof FeaturedSection> = {
  title: 'Components/FeaturedSection',
  component: FeaturedSection,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeaturedSection>;

export const Default: Story = {
  args: {
    title: 'Seção em Destaque',
    description: 'Esta é uma descrição da seção em destaque',
    actionLabel: 'Ver mais',
    actionHref: '/ver-mais',
    children: (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-lg bg-white p-4 shadow">
            <div className="mb-4 h-40 bg-gray-200 rounded"></div>
            <h3 className="text-lg font-medium">Item {item}</h3>
            <p className="text-gray-600">Descrição do item {item}</p>
          </div>
        ))}
      </div>
    ),
  },
};

export const WithoutAction: Story = {
  args: {
    title: 'Seção sem Botão de Ação',
    description: 'Esta seção não possui um botão de ação',
    children: (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {[1, 2].map((item) => (
          <div key={item} className="rounded-lg bg-white p-4 shadow">
            <div className="mb-4 h-40 bg-gray-200 rounded"></div>
            <h3 className="text-lg font-medium">Item {item}</h3>
            <p className="text-gray-600">Descrição do item {item}</p>
          </div>
        ))}
      </div>
    ),
  },
};
