import type { Meta, StoryObj } from '@storybook/react';
import { SignupForm } from '../../components/auth/SignupForm';

// Criamos um mock para o Supabase para evitar erros nos stories
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: async () => ({
        data: { user: { id: 'mock-user-id' } },
        error: null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          count: 0,
          error: null,
        }),
      }),
      upsert: () => ({
        error: null,
      }),
    }),
  },
}));

const meta: Meta<typeof SignupForm> = {
  title: 'Auth/SignupForm',
  component: SignupForm,
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
type Story = StoryObj<typeof SignupForm>;

export const Default: Story = {
  args: {
    onSuccess: () => console.log('Signup successful'),
  },
};
