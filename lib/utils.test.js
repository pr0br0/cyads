import { 
  cn,
  formatPrice, 
  formatDate,
  truncate,
  getImageUrl,
  slugify,
  debounce,
  getInitials,
  timeAgo
} from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
      expect(cn('text-red-500', 'hover:text-red-700')).toBe('text-red-500 hover:text-red-700');
    });
  });

  describe('formatPrice', () => {
    it('formats price with default currency', () => {
      expect(formatPrice(1000)).toBe('$1,000.00');
    });

    it('handles null price', () => {
      expect(formatPrice(null)).toBe('$0.00');
    });

    it('formats with custom currency', () => {
      expect(formatPrice(500, 'EUR')).toBe('€500.00');
      expect(formatPrice(250, 'JPY')).toBe('¥250');
    });
  });

  describe('formatDate', () => {
    it('formats date string correctly', () => {
      const date = '2025-03-27';
      expect(formatDate(date)).toMatch(/March 27, 2025/);
    });

    it('handles Date objects', () => {
      const date = new Date(2025, 2, 27);
      expect(formatDate(date)).toMatch(/March 27, 2025/);
    });

    it('handles invalid dates', () => {
      expect(formatDate('invalid')).toMatch(/Invalid Date/);
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('This is a long string', 10)).toBe('This is a...');
    });

    it('returns short strings unchanged', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('handles empty/null strings', () => {
      expect(truncate('', 10)).toBe('');
      expect(truncate(null, 10)).toBe('');
    });
  });

  describe('getImageUrl', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...OLD_ENV,
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co'
      };
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it('returns placeholder for empty path', () => {
      expect(getImageUrl('')).toBe('/placeholder.jpg');
    });

    it('returns http URLs unchanged', () => {
      expect(getImageUrl('http://example.com/image.jpg'))
        .toBe('http://example.com/image.jpg');
    });

    it('constructs Supabase URL for storage paths', () => {
      expect(getImageUrl('images/photo.jpg'))
        .toBe('https://example.supabase.co/storage/v1/object/public/images/photo.jpg');
    });
  });

  describe('slugify', () => {
    it('converts strings to slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test String 123')).toBe('test-string-123');
    });

    it('handles special characters', () => {
      expect(slugify('This & That')).toBe('this-that');
      expect(slugify('Price: $100')).toBe('price-100');
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();
    
    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);
      
      debounced();
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('only executes once for multiple rapid calls', () => {
      const mockFn = jest.fn();
      const debounced = debounce(mockFn, 100);
      
      debounced();
      debounced();
      debounced();
      
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getInitials', () => {
    it('extracts initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Alice Bob Charlie')).toBe('ABC');
    });

    it('handles empty/null names', () => {
      expect(getInitials('')).toBe('');
      expect(getInitials(null)).toBe('');
    });
  });

  describe('timeAgo', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-03-27T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('shows seconds for recent times', () => {
      const date = new Date('2025-03-27T11:59:30Z');
      expect(timeAgo(date)).toBe('30 seconds ago');
    });

    it('shows minutes', () => {
      const date = new Date('2025-03-27T11:50:00Z');
      expect(timeAgo(date)).toBe('10 minutes ago');
    });

    it('shows hours', () => {
      const date = new Date('2025-03-27T09:00:00Z');
      expect(timeAgo(date)).toBe('3 hours ago');
    });

    it('shows days', () => {
      const date = new Date('2025-03-25T12:00:00Z');
      expect(timeAgo(date)).toBe('2 days ago');
    });

    it('shows months', () => {
      const date = new Date('2025-01-01T12:00:00Z'); // Exactly 2 months before Mar 1
      expect(timeAgo(date)).toBe('2 months ago');
    });

    it('shows years', () => {
      const date = new Date('2023-03-27T12:00:00Z');
      expect(timeAgo(date)).toBe('2 years ago');
    });
  });
});
