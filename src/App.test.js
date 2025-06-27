import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Risk News Monitor header', () => {
  render(<App />);
  const headerElement = screen.getByText(/AI Risk News Monitor/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders severity filters', () => {
  render(<App />);
  const criticalFilter = screen.getByText(/Critical/i);
  expect(criticalFilter).toBeInTheDocument();
});
