'use client';

/**
 * Global header component - Works on landing page and dashboard
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/context/auth-context';

/**
 * User Avatar Dropdown Component 👤
 * Displays user avatar with dropdown menu for profile navigation
 */
function UserAvatarDropdown({ user, profile, avatarUrl, onSignOut }) {
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full"
        >
          <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <AvatarImage src={avatarUrl} alt={profile?.display_name || 'User'} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.display_name || 'User'}
            </p>
            {profile?.username && (
              <p className="text-xs leading-none text-muted-foreground">
                @{profile.username}
              </p>
            )}
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
           {profile?.username && (
             <DropdownMenuItem asChild>
               <Link href={`/@${profile.username}`} className="cursor-pointer">
                 My Profile
               </Link>
             </DropdownMenuItem>
           )}
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header({ theme = 'light' }) {
  const { isAuthenticated, user, profile, signOut, loading } = useAuthContext();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  // Get avatar URL from Google
  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;

  // Theme-based styling 🎨
  const getHeaderClasses = () => {
    const baseClasses = "sticky top-0 z-50 w-full ";

    switch (theme) {
      case 'dark':
        return `${baseClasses} bg-dark text-white border-b-2 border-light/5`;
      case 'light':
        return `${baseClasses} bg-light text-black`;
      case 'transparent':
        return `${baseClasses} bg-transparent border-transparent  absolute `;
      default:
        return `${baseClasses} bg-light text-black`;
    }
  };

  const getLinkClasses = (isActive) => {
    const baseClasses = "text-base font-medium transition-colors relative inline-block";

    switch (theme) {
      case 'dark':
        return `${baseClasses} ${isActive ? 'text-highlight after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-highlight' : 'text-light/50 hover:text-white'}`;
      case 'light':
        return `${baseClasses} ${isActive ? 'text-highlight after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-highlight' : 'text-dark/50 hover:text-dark/80'}`;
      case 'transparent':
        return `${baseClasses} ${isActive ? 'text-highlight after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-highlight' : 'text-light/50 hover:text-light/80'}`;
      default:
        return `${baseClasses} ${isActive ? 'text-highlight after:absolute after:bottom-[-20px] after:left-0 after:right-0 after:h-[2px] after:bg-highlight' : 'text-muted-foreground hover:text-primary'}`;
    }
  };

  return (
    <header className={getHeaderClasses()}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-3xl font-bold text-highlight  font-[family-name:var(--font-outfit)] select-none">
            proofed
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 md:gap-8">
          {/* Home link */}
          <Link
            href="/"
            className={getLinkClasses(pathname === '/')}
          >
            Home
          </Link>

          {/* Dashboard link - only show when authenticated */}
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={getLinkClasses(pathname?.startsWith('/dashboard'))}
            >
              Dashboard
            </Link>
          )}

          {/* Explore link - always visible */}
          <Link
            href="/explore"
            className={getLinkClasses(pathname === '/explore')}
          >
            Explore
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* User Info - Name and Email */}
              <div className="hidden md:flex flex-col items-end">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
                  {profile?.display_name || user?.user_metadata?.full_name || 'User'}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-white/60' : 'text-dark/60'}`}>
                  {user?.email}
                </p>
              </div>
              
              {/* User Avatar Dropdown */}
              <UserAvatarDropdown
                user={user}
                profile={profile}
                avatarUrl={avatarUrl}
                onSignOut={handleSignOut}
              />
            </>
          ) : (
            <>
              <Button asChild size="sm" variant={theme === 'dark' ? 'light' : 'default'}>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

