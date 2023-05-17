import { render, screen } from '@testing-library/react';
import MyButton from './App';

test('renders my button', () => {
    render(<MyButton />);
    const buttonElement = screen.getByText(/Test button/i);
    expect(buttonElement).toBeInTheDocument();
});
