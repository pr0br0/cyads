# Testing Implementation Plan for CyAds

## Testing Strategy

Implement a comprehensive testing strategy with the following layers:

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test interactions between components
3. **End-to-End Tests**: Test complete user flows

## Setup Steps

### 1. Install Testing Dependencies

```bash
# Install Jest and React Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# For TypeScript support
npm install --save-dev ts-jest @types/jest

# For E2E testing
npm install --save-dev cypress
```

### 2. Configure Jest

Create a `jest.config.js` file:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/cypress/'],
};

module.exports = createJestConfig(customJestConfig);
```

Create a `jest.setup.js` file:

```javascript
import '@testing-library/jest-dom';
```

### 3. Update package.json Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "cypress": "cypress open",
  "cypress:headless": "cypress run"
}
```

### 4. Create Test Directory Structure

```
__tests__/
├── components/
│   ├── ui/
│   │   ├── Button.test.jsx
│   │   └── ...
│   ├── CategoriesGrid.test.jsx
│   ├── FeaturedAds.test.jsx
│   └── ...
├── hooks/
│   └── useDebounce.test.js
├── lib/
│   ├── supabase.test.js
│   └── utils.test.js
└── pages/
    ├── index.test.jsx
    └── ...
```

## Unit Testing Examples

### 1. Testing UI Components

```jsx
// __tests__/components/ui/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/app/components/ui/Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button', { name: /outline button/i });
    expect(button).toHaveClass('border-2');
    expect(button).not.toHaveClass('bg-primary');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
  });
});
```

### 2. Testing Hooks

```jsx
// __tests__/hooks/useDebounce.test.js
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/app/hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce Hook', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial value', 500));
    expect(result.current).toBe('initial value');
  });

  it('should update the value after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the value
    rerender({ value: 'updated value', delay: 500 });
    
    // Value should not change immediately
    expect(result.current).toBe('initial value');
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Now the value should be updated
    expect(result.current).toBe('updated value');
  });

  it('should cancel previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Change the value multiple times
    rerender({ value: 'intermediate value', delay: 500 });
    
    // Fast-forward time but not enough to trigger update
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Change value again
    rerender({ value: 'final value', delay: 500 });
    
    // Value should still be the initial one
    expect(result.current).toBe('initial value');
    
    // Fast-forward time to trigger update
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Now the value should be the final one, skipping intermediate
    expect(result.current).toBe('final value');
  });
});
```

### 3. Testing Utility Functions

```jsx
// __tests__/lib/utils.test.js
import { formatPrice, truncateText } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats price with default currency (EUR)', () => {
      expect(formatPrice(1000)).toBe('€1,000.00');
      expect(formatPrice(1000.5)).toBe('€1,000.50');
      expect(formatPrice(0)).toBe('€0.00');
    });

    it('formats price with specified currency', () => {
      expect(formatPrice(1000, 'USD')).toBe('$1,000.00');
      expect(formatPrice(1000, 'GBP')).toBe('£1,000.00');
    });

    it('handles undefined or null values', () => {
      expect(formatPrice(undefined)).toBe('€0.00');
      expect(formatPrice(null)).toBe('€0.00');
    });
  });

  describe('truncateText', () => {
    it('truncates text to specified length', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very long...');
    });

    it('does not truncate text shorter than limit', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });

    it('handles empty strings', () => {
      expect(truncateText('', 20)).toBe('');
    });

    it('uses custom suffix if provided', () => {
      const text = 'This needs to be truncated';
      expect(truncateText(text, 10, ' [more]')).toBe('This needs [more]');
    });
  });
});
```

## Integration Testing Examples

### Testing Form Submission

```jsx
// __tests__/integration/AdCreationForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '@/app/context/AuthContext';
import CreateAdPage from '@/app/ads/create/page';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } })
    },
    insert: jest.fn().mockResolvedValue({ 
      data: { id: '123', status: 'active' }, 
      error: null 
    }),
    single: jest.fn().mockReturnThis(),
  }
}));

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('Ad Creation Form Integration', () => {
  beforeEach(() => {
    // Mock categories data
    supabase.from().select().order.mockResolvedValue({
      data: [
        { id: 'cat1', name: 'Electronics' },
        { id: 'cat2', name: 'Vehicles' }
      ],
      error: null
    });
    
    // Mock user profile
    supabase.from().select().eq().single.mockResolvedValue({
      data: { id: 'user1', phone: '+1234567890' },
      error: null
    });
  });

  it('submits the form with valid data', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <CreateAdPage />
      </AuthProvider>
    );
    
    // Wait for form to load
    await screen.findByText('Create New Ad');
    
    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'Test Ad Title');
    await user.type(screen.getByLabelText(/description/i), 'This is a detailed description of the test ad');
    await user.type(screen.getByLabelText(/price/i), '100');
    await user.selectOptions(screen.getByLabelText(/category/i), 'cat1');
    await user.type(screen.getByLabelText(/location/i), 'Nicosia');
    
    // Mock file upload
    const file = new File(['dummy content'], 'test-image.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/upload a file/i);
    await user.upload(fileInput, file);
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /create ad/i }));
    
    // Verify form submission
    await waitFor(() => {
      expect(supabase.from().insert).toHaveBeenCalledWith([
        expect.objectContaining({
          title: 'Test Ad Title',
          description: 'This is a detailed description of the test ad',
          price: 100,
          category_id: 'cat1',
          location: 'Nicosia'
        })
      ]);
    });
  });

  it('shows validation errors for invalid data', async () => {
    const user = userEvent.setup();
    
    render(
      <AuthProvider>
        <CreateAdPage />
      </AuthProvider>
    );
    
    // Wait for form to load
    await screen.findByText('Create New Ad');
    
    // Submit without filling required fields
    await user.click(screen.getByRole('button', { name: /create ad/i }));
    
    // Check for validation errors
    expect(await screen.findByText(/title must be at least/i)).toBeInTheDocument();
    expect(await screen.findByText(/description must be at least/i)).toBeInTheDocument();
    expect(await screen.findByText(/please select a category/i)).toBeInTheDocument();
  });
});
```

## End-to-End Testing with Cypress

### 1. Configure Cypress

Create a `cypress.config.js` file:

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

### 2. Create E2E Test Examples

```javascript
// cypress/e2e/homepage.cy.js
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the main sections', () => {
    cy.get('h1').contains('Find Anything in Cyprus');
    cy.contains('Popular Categories').should('be.visible');
    cy.contains('Featured Ads').should('be.visible');
  });

  it('allows searching for ads', () => {
    cy.get('input[placeholder*="looking for"]').type('apartment{enter}');
    cy.url().should('include', '/search');
    cy.contains('Search results for "apartment"').should('be.visible');
  });

  it('navigates to category pages', () => {
    cy.contains('Popular Categories')
      .parent()
      .find('a')
      .first()
      .click();
    
    cy.url().should('include', '/categories/');
  });
});

// cypress/e2e/authentication.cy.js
describe('Authentication', () => {
  it('allows users to sign up', () => {
    cy.visit('/auth/signup');
    
    // Generate a random email
    const email = `testuser.${Date.now()}@example.com`;
    
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    
    // Should redirect to dashboard after signup
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome to your dashboard').should('be.visible');
  });

  it('allows users to log in', () => {
    cy.visit('/auth/signin');
    
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    
    // Should redirect to dashboard after login
    cy.url().should('include', '/dashboard');
    cy.contains('Your Ads').should('be.visible');
  });
});

// cypress/e2e/ad-creation.cy.js
describe('Ad Creation', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('/auth/signin');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
  });

  it('allows creating a new ad', () => {
    cy.visit('/ads/create');
    
    // Fill out the form
    cy.get('input[name="title"]').type('Test Cypress Ad');
    cy.get('textarea[name="description"]').type('This is a test ad created with Cypress for E2E testing purposes. It contains enough characters to pass validation.');
    cy.get('input[name="price"]').type('150');
    cy.get('select[name="category_id"]').select(1); // Select first category
    cy.get('input[name="location"]').type('Limassol');
    
    // Upload an image
    cy.get('input[type="file"]').attachFile('test-image.jpg');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Should redirect to dashboard after creation
    cy.url().should('include', '/dashboard');
    cy.contains('Your ad has been').should('be.visible');
  });
});
```

## Test Coverage Goals

Aim for the following test coverage:

1. **Unit Tests**: 80% coverage of utility functions and UI components
2. **Integration Tests**: Key user flows like authentication, ad creation, and search
3. **E2E Tests**: Critical business paths that affect revenue and user experience

## Continuous Integration

Set up GitHub Actions to run tests on every pull request:

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit and integration tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Start server for E2E tests
      run: npm start & npx wait-on http://localhost:3000
    
    - name: Run E2E tests
      run: npm run cypress:headless
```

## Implementation Timeline

1. **Week 1**: Set up testing infrastructure and write unit tests for utility functions
2. **Week 2**: Add unit tests for UI components
3. **Week 3**: Implement integration tests for key user flows
4. **Week 4**: Set up E2E testing with Cypress and implement critical path tests
5. **Ongoing**: Maintain 80% test coverage for new features
