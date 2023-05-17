import { render, screen } from '@testing-library/react';
import App from './App';

test('renders my button', () => {
    render(<App />);
    const buttonElement = screen.getByText(/my button/i);
    expect(buttonElement).toBeInTheDocument();
});
