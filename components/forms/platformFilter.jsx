import Image from 'next/image';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ArrowDown01Icon } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const dropdownButtonVariants = cva(
  "h-12 px-5 rounded-full border-2 transition-colors cursor-pointer min-w-[200px] flex items-center justify-between gap-3 focus:outline-none",
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

const PLATFORMS = [
  { id: 'all', name: 'All Platforms', icon: null, emoji: '' },
  { id: 'youtube', name: 'YouTube', icon: '/images/brands/youtube-icon.svg' },
  { id: 'stripe', name: 'Stripe', icon: '/images/brands/stripe-icon.svg' },
  { id: 'twitter', name: 'X / Twitter', icon: '/images/brands/x.svg' },
  { id: 'instagram', name: 'Instagram', icon: '/images/brands/instagram-icon.svg' },
  { id: 'tiktok', name: 'TikTok', icon: '/images/brands/tiktok-icon.svg' },
  { id: 'shopify', name: 'Shopify', icon: '/images/brands/shopify-icon.svg' },
  { id: 'analytics', name: 'Google Analytics', icon: '/images/brands/google-analytics-icon.svg' },
  { id: 'hubspot', name: 'HubSpot', icon: '/images/brands/hubspot-icon.svg' },
];

export default function PlatformFilter({ 
  onSelect, 
  selectedPlatform = 'all',
  variant = 'default',
  className,
}) {
  const selectedPlatformData = PLATFORMS.find(p => p.id === selectedPlatform) || PLATFORMS[0];
  
  // Determine icon color based on variant
  const iconColor = variant === 'dark' ? 'text-light/50' : 'text-gray-400';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(dropdownButtonVariants({ variant }), className)}>
          <div className="flex items-center gap-2">
            {selectedPlatformData.icon ? (
              <div className="w-5 h-5 relative shrink-0">
                <Image
                  src={selectedPlatformData.icon}
                  alt={selectedPlatformData.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-lg">{selectedPlatformData.emoji}</span>
            )}
            <span className="font-medium">{selectedPlatformData.name}</span>
          </div>
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} className={iconColor} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {PLATFORMS.map((platform, index) => (
          <div key={platform.id}>
            {index === 1 && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => onSelect(platform.id)}>
              <div className="flex items-center gap-3 w-full">
                {platform.icon ? (
                  <div className="w-5 h-5 relative shrink-0">
                    <Image
                      src={platform.icon}
                      alt={platform.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <span className="text-base">{platform.emoji}</span>
                )}
                <span>{platform.name}</span>
              </div>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { dropdownButtonVariants, PLATFORMS };
