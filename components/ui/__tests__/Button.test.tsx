import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';
import '@testing-library/jest-dom';
import { Menu } from 'lucide-react';
import Link from 'next/link';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('inline-flex');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('opacity-75');
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-secondary');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });

  it('renders default size', () => {
    render(<Button size="default">Default Size</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');
  });

  it('renders small size', () => {
    render(<Button size="sm">Small Size</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');
  });

  it('renders large size', () => {
    render(<Button size="lg">Large Size</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });

  it('renders icon size', () => {
    render(<Button size="icon"><Menu /></Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');
    expect(screen.getByRole('button')).toHaveClass('w-10');
  });

  it('renders with icon prop', () => {
    render(<Button icon={<Menu />} >With Icon</Button>);
    expect(screen.getByText('With Icon')).toBeInTheDocument();
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies opacity-50 class when loading', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('opacity-75');
  });

  it('renders default size', () => {
    render(<Button size="default">Default Size</Button>);
    expect(screen.getByRole('button', { name: "Default Size" })).toHaveClass('h-10');
  });

  it('renders small size', () => {
    render(<Button size="sm">Small Size</Button>);
    expect(screen.getByRole('button', { name: "Small Size" })).toHaveClass('h-9');
  });

  it('renders large size', () => {
    render(<Button size="lg">Large Size</Button>);
    expect(screen.getByRole('button', { name: "Large Size" })).toHaveClass('h-11');
  });

  it('renders icon size', () => {
    render(<Button size="icon"><Menu /></Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');
    expect(screen.getByRole('button')).toHaveClass('w-10');
  });

  it('renders with icon', () => {
    render(<Button icon={<Menu />} >With Icon</Button>);
    expect(screen.getByText('With Icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "With Icon" }).querySelector('svg')).toBeInTheDocument();
  });

  it('renders as a link', () => {
    render(<Button asChild><Link href="/test">Link Button</Link></Button>);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
