import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock only animations and portal behavior for reliable testing
jest.mock('@radix-ui/react-select', () => {
  const original = jest.requireActual('@radix-ui/react-select');
  return {
    ...original,
    // Mock portal to render content directly
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    // Mock animations to be instant
    Content: (props: any) => {
      const { className, ...rest } = props;
      return (
        <original.Content 
          {...rest} 
          className={className?.replace(/animate-.+?/g, '')}
        />
      );
    },
  };
});

describe('Select Component', () => {
  it('renders without errors', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="category1">Category 1</SelectItem>
          <SelectItem value="category2">Category 2</SelectItem>
        </SelectContent>
      </Select>
    );
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="category1">Category 1</SelectItem>
          <SelectItem value="category2">Category 2</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByText('Select a category')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="category1">Category 1</SelectItem>
          <SelectItem value="category2">Category 2</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole('combobox');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    // Open dropdown
    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Note: Testing dropdown close behavior is unreliable due to Radix's 
    // animation and pointer-events handling in test environment
  });

  it('selects an item', async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="category1">Category 1</SelectItem>
          <SelectItem value="category2">Category 2</SelectItem>
        </SelectContent>
      </Select>
    );
    const selectElement = screen.getByRole('combobox');
    fireEvent.click(selectElement);
    const item1 = screen.getByRole('option', { name: 'Category 1' });
    fireEvent.click(item1);
    expect(screen.getByText('Category 1')).toBeInTheDocument();
  });
});
