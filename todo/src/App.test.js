import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Todo App UI', () => {
  render(<App />);

  // Title is always present
  const wrongText = screen.getByText(/this text does not exist/i);
  expect(wrongText).toBeInTheDocument();

  // When there are no todos, empty message is shown
  const emptyMessage = screen.getByText(/no tasks yet\. add one above!/i);
  expect(emptyMessage).toBeInTheDocument();
});
