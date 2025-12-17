import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserCard({ profile }) {
  return (
    <div className="group">
      <div className="bg-white rounded-3xl overflow-hidden p-4">
        {/* Large Profile Image */}
        <div className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden">
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage 
              src={profile.avatar_url} 
              alt={profile.display_name || profile.username}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-6xl font-bold rounded-none">
              {profile.display_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Card Content */}
        <div className="mt-4">
          {/* Name and Verification */}
          <div className="flex items-start gap-2 mb-1">
            <h3 className="text-xl font-bold text-dark flex-1 truncate">
              {profile.display_name || profile.username}
            </h3>
            {profile.is_verified && (
              <svg className="w-5 h-5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            )}
          </div>

          {/* Username */}
          <p className="text-sm text-muted-foreground mb-3">
            @{profile.username}
          </p>

          {/* Follower Count */}
          <div className="mb-3">
            <div className="text-3xl font-bold text-dark">
              {profile.badge_count ? `${profile.badge_count}k` : '0'}
            </div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 mb-3">
            {profile.platforms && profile.platforms.length > 0 && (
              <>
                {profile.platforms.includes('instagram') && (
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                  </div>
                )}
                {profile.platforms.includes('youtube') && (
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                )}
                {profile.platforms.includes('tiktok') && (
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Category Badge */}
          <div className="mb-4 flex gap-2">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
              {profile.user_type === 'creator' ? 'Creator' : 'Business'}
            </Badge>
            {profile.is_verified && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                ✓ Verified
              </Badge>
            )}
          </div>

          {/* Advertising Price */}
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-1">Advertising Price</div>
            <div className="text-2xl font-bold text-dark">
              ${(profile.badge_count || 0) * 100}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link href={`/@${profile.username}`} className="flex-1">
              <Button  className="w-full">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
