import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

/**
 * Button component properties
 * 
 * @property {boolean} [asChild] - Render as child element
 * @property {boolean} [loading] - Show loading state
 * @property {React.ReactNode} [icon] - Optional icon element
 * @property {string} [variant] - Visual variant (default, destructive, outline, etc.)
 * @property {string} [size] - Size variant (default, sm, lg, icon)
 */
export interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}
