import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../input';
import '@testing-library/jest-dom';

describe('Input Component', () => {
  it('renders without errors', () => {
    render(<Input />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text here" />);
    expect(screen.getByPlaceholderText('Enter text here')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox');
    fireEvent.change(inputElement, { target: { value: 'test input' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies className', () => {
    render(<Input className="test-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('test-class');
  });

  it('renders as disabled', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders with email type', () => {
    render(<Input type="email" placeholder="Email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders with email type', () => {
    render(<Input type="email" placeholder="Email" aria-label="Email input" />);
    expect(screen.getByRole('textbox', { name: /Email input/i })).toHaveAttribute('type', 'email');
  });

  it('renders with password type', () => {
    render(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
  });

  it('renders with number type', () => {
    render(<Input type="number" placeholder="Number" aria-label="Number input" />);
    expect(screen.getByRole('spinbutton', { name: /Number input/i })).toHaveAttribute('type', 'number');
  });

  it('renders with error state', () => {
    render(<Input aria-invalid="true" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox')).toHaveClass('border-destructive');
  });
});
