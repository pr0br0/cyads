export interface SearchBarProps {
  initialQuery?: string;
  initialCategory?: string;
  initialLocation?: string;
  onSearch?: (params: {
    query: string;
    category: string;
    location: string;
  }) => void;
}
