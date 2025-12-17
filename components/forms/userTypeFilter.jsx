import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { 
  ArrowDown01Icon, 
  UserMultiple02Icon, 
  PaintBrushIcon, 
  Briefcase02Icon 
} from '@hugeicons-pro/core-solid-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const dropdownButtonVariants = cva(
  "h-12 px-5 rounded-full border-2 transition-colors cursor-pointer min-w-[180px] flex items-center justify-between gap-3 focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-white text-dark border-gray-200 hover:border-gray-300",
        dark: "bg-dark text-light border-dark/20 hover:border-highlight/30",
        light: "bg-light text-dark border-gray-200 hover:border-gray-300",
        ghost: "bg-transparent text-dark border-gray-200 hover:border-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const USER_TYPES = [
  { id: 'all', name: 'All Users', icon: UserMultiple02Icon },
  { id: 'creator', name: 'Creators', icon: PaintBrushIcon },
  { id: 'business', name: 'Businesses', icon: Briefcase02Icon },
];

export default function UserTypeFilter({ 
  onSelect, 
  selectedType = 'all',
  variant = 'default',
  className,
}) {
  const selectedTypeData = USER_TYPES.find(t => t.id === selectedType) || USER_TYPES[0];
  
  // Determine icon color based on variant
  const iconColor = variant === 'dark' ? 'text-light/50' : 'text-gray-400';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(dropdownButtonVariants({ variant }), className)}>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={selectedTypeData.icon} size={18} />
            <span className="font-medium">{selectedTypeData.name}</span>
          </div>
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} className={iconColor} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {USER_TYPES.map((type, index) => (
          <div key={type.id}>
            {index === 1 && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => onSelect(type.id)}>
              <div className="flex items-center gap-3 w-full">
                <HugeiconsIcon icon={type.icon} size={18} />
                <span>{type.name}</span>
              </div>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { dropdownButtonVariants, USER_TYPES };
