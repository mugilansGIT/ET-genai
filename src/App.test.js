import { render, screen } from '@testing-library/react';
import App from './App';

test('renders profiling screen initially', () => {
  render(<App />);
  const element = screen.getByText(/profile/i); // adjust text if needed
  expect(element).toBeInTheDocument();
});