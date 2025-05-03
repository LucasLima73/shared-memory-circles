import type { Meta, StoryObj } from '@storybook/react';
import Sidebar from '../../components/layout/Sidebar';
import { BrowserRouter } from 'react-router-dom';

// Precisamos criar um mock para o contexto de autenticação
const MockAuthProvider = ({ children }) => {
  const mockAuthValue = {
    user: {
      id: 'user-123',
      email: 'usuario@exemplo.com',
    },
    supabase: {},
  };

  // @ts-ignore - Ignorando tipagem para simplificar o mock
  return <div className="mock-auth-provider">{children}</div>;
};

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <MockAuthProvider>
          <div style={{ height: '100vh' }}>
            <Story />
          </div>
        </MockAuthProvider>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Nota: Este story pode não funcionar perfeitamente sem um mock mais completo do Supabase
// e do contexto de autenticação, mas serve como base para visualização do componente
export const Default: Story = {
  args: {},
};
