import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from '../../components/auth/LoginForm';

// Criamos um mock para o Supabase para evitar erros nos stories
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: async () => ({
        data: { user: { id: 'mock-user-id' } },
        error: null,
      }),
    },
  },
}));

const meta: Meta<typeof LoginForm> = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  args: {
    onSuccess: () => console.log('Login successful'),
  },
};

export const WithError: Story = {
  args: {
    onSuccess: () => console.log('Login successful'),
  },
  // Aqui poderíamos adicionar um play function para simular um erro de login,
  // mas isso exigiria configuração adicional do Storybook com testing-library
};
