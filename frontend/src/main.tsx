import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style/global.css';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App />
    </MantineProvider>
  </StrictMode>
);
