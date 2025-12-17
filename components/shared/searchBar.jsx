import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Search01Icon, Cancel01Icon } from '@hugeicons-pro/core-solid-standard';
import { HugeiconsIcon } from '@hugeicons/react';

const searchInputVariants = cva(
  "w-full h-12 pl-12 pr-12 rounded-full border-2 transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-white text-dark placeholder-text-dark/50 border-gray-200 ",
        dark: "bg-dark text-light placeholder-text-light/50 border-dark/20 ",
        light: "bg-light text-dark placeholder-text-dark/50 border-gray-200 ",
        explore: "bg-light/10 text-light placeholder-text-light/50 border-dark/20 ",
        ghost: "bg-transparent text-dark placeholder-text-dark/50 border-gray-200 ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Search...',
  variant = 'default',
  className,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  // Determine icon color based on variant
  const iconColor = variant === 'dark' ? 'text-light/50' : 'text-gray-400';
  const iconHoverColor = variant === 'dark' ? 'hover:text-light' : 'hover:text-dark';

  return (
    <div className={cn("relative w-full", className)}>
      <div className={cn("absolute left-4 top-1/2 -translate-y-1/2", iconColor)}>
        <HugeiconsIcon icon={Search01Icon} size={20} />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className={cn(searchInputVariants({ variant })) }
      />
      {searchQuery && (
        <button
          onClick={clearSearch}
          className={cn("absolute right-4 top-1/2 -translate-y-1/2 transition-colors", iconColor, iconHoverColor)}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} />
        </button>
      )}
    </div>
  );
}

export { searchInputVariants };
