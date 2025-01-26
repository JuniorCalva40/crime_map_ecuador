import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style/global.css';
import '@mantine/core/styles.css';
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from '@mantine/core';

const myColor: MantineColorsTuple = [
  '#e5f3ff',
  '#cde2ff',
  '#9ac2ff',
  '#64a0ff',
  '#3884fe',
  '#1d72fe',
  '#0969ff',
  '#0058e4',
  '#004ecd',
  '#0043b5',
];

const theme = createTheme({
  colors: {
    myColor,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>
);
