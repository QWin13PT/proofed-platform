import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  "h-12 px-5 rounded-full border-2 transition-colors cursor-pointer flex items-center gap-3 focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-white text-dark border-gray-200 hover:border-gray-300",
        dark: "bg-dark text-light border-dark/20 hover:border-highlight/30",
        light: "bg-light text-dark border-gray-200 hover:border-gray-300",
        ghost: "bg-transparent text-dark border-gray-200 hover:border-gray-300",
        highlight: "bg-highlight text-dark border-highlight hover:border-highlight/30",
      },
      checked: {
        true: "border-highlight ",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      checked: false,
    },
  }
);

export default function VerifiedCheckbox({ 
  checked = false,
  onChange,
  variant = 'default',
  className,
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(checkboxVariants({ variant, checked }), className)}
    >
      <div className={cn(
        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
        checked 
          ? "bg-dark border-highlight" 
          : variant === 'highlight' 
            ? "border-dark/30" 
            : "bg-dark border-dark"
      )}>
        {checked && (
          <svg className="w-4 h-4 text-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-highlight">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span className="font-medium">Verified Only</span>
    </button>
  );
}

export { checkboxVariants };
