// src/App.test.js — smoke test: the app mounts and renders its shell/home route.
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the app shell with the name and skip link', () => {
  render(<App />);
  // Header is synchronous (not lazy) and always present on the home route.
  expect(screen.getByText(/brandon anthony boyd/i)).toBeInTheDocument();
  expect(screen.getByText(/skip to content/i)).toBeInTheDocument();
});
