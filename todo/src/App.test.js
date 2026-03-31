import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Todo App UI', () => {
  render(<App />);

  // Title is always present
  const title = screen.getByText(/my to-do list/i);
  expect(title).toBeInTheDocument();

  // When there are no todos, empty message is shown
  const emptyMessage = screen.getByText(/no tasks yet\. add one above!/i);
  expect(emptyMessage).toBeInTheDocument();
});
