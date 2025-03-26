import { render, screen, fireEvent } from '@testing-library/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

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

  it('opens and closes the dropdown', async () => {
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
    await userEvent.click(selectElement);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.tab(); // Shift focus away to close dropdown
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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
