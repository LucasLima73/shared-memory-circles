import React from 'react';
import { Preview } from '@storybook/react';
import '../src/index.css'; // Importa os estilos globais do seu projeto
import { BrowserRouter } from 'react-router-dom';

// Decorator global para envolver todos os stories com o BrowserRouter
const withRouter = (StoryFn) => {
  return (
    <BrowserRouter>
      <StoryFn />
    </BrowserRouter>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f8f9fa',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'memories-purple',
          value: '#6366f1',
        },
      ],
    },
  },
  decorators: [withRouter],
};

export default preview;
