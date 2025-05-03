import type { Meta, StoryObj } from '@storybook/react';
import MemoryCard from '../../components/memories/MemoryCard';

const meta: Meta<typeof MemoryCard> = {
  title: 'Components/MemoryCard',
  component: MemoryCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MemoryCard>;

export const Default: Story = {
  args: {
    memory: {
      id: '1',
      title: 'Viagem à praia - Ano Novo 2024',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      author: { 
        name: 'Ana Silva', 
        avatar: 'https://i.pravatar.cc/150?img=29' 
      },
      date: '01/01/2024',
      likes: 24,
      comments: 5,
    },
  },
};

export const WithGroup: Story = {
  args: {
    memory: {
      id: '2',
      title: 'Formatura Universidade Federal',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      author: { 
        name: 'Carlos Mendes', 
        avatar: 'https://i.pravatar.cc/150?img=12' 
      },
      group: { 
        name: 'Turma de Engenharia 2023' 
      },
      date: '15/12/2023',
      likes: 56,
      comments: 12,
    },
  },
};

export const PopularMemory: Story = {
  args: {
    memory: {
      id: '3',
      title: 'Aniversário de 30 anos',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop',
      author: { 
        name: 'Pedro Alves', 
        avatar: 'https://i.pravatar.cc/150?img=15' 
      },
      group: { 
        name: 'Amigos da Faculdade' 
      },
      date: '10/03/2024',
      likes: 132,
      comments: 45,
    },
  },
};
