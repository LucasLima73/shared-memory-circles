import type { Meta, StoryObj } from '@storybook/react';
import GroupCard from '../../components/groups/GroupCard';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof GroupCard> = {
  title: 'Components/GroupCard',
  component: GroupCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ width: '400px' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GroupCard>;

export const Default: Story = {
  args: {
    group: {
      id: '1',
      name: 'Família Silva',
      description: 'Grupo para compartilhar memórias da família',
      image: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc4?w=800&h=600&fit=crop',
      members: 5,
      isPrivate: false,
    },
  },
};

export const PrivateGroup: Story = {
  args: {
    group: {
      id: '2',
      name: 'Viagem Europa 2024',
      description: 'Memórias da nossa viagem pela Europa',
      image: 'https://images.unsplash.com/photo-1493707553966-283afac8c358?w=800&h=600&fit=crop',
      members: 3,
      isPrivate: true,
    },
  },
};

export const ManyMembers: Story = {
  args: {
    group: {
      id: '3',
      name: 'Turma de Formandos 2023',
      description: 'Memórias da nossa formatura',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      members: 12,
      isPrivate: false,
    },
  },
};
