'use client';

/**
 * Dashboard Page
 * Main hub for authenticated users
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/context/auth-context';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowUpRight01Icon, 
  CheckmarkBadge03Icon,
  WavingHand01Icon,
  VideoReplayIcon,
  Briefcase02Icon,
  SecurityLockIcon,
  Award01Icon,
  ViewIcon,
  FlashIcon,
  UserIcon,
  Search01Icon,
  Settings02Icon,
  Target01Icon,
  Tick01Icon,
  ClipboardIcon,
  LockKeyIcon
} from '@hugeicons-pro/core-solid-standard';

export default function DashboardPage() {
  const { user, profile, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();
  const [badges, setBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]);

  // Fetch user's badges
  useEffect(() => {
    const fetchBadges = async () => {
      if (!profile?.username) {
        setLoadingBadges(false);
        return;
      }

      try {
        const response = await fetch(`/api/profiles/${profile.username}/badges`);
        if (response.ok) {
          const data = await response.json();
          setBadges(data);
        }
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoadingBadges(false);
      }
    };

    fetchBadges();
  }, [profile?.username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const displayName = profile?.display_name || user?.user_metadata?.full_name || 'User';
  const userType = profile?.user_type || 'creator';

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme="dark" />
      <main className="flex-1 bg-dark">

        {/* Welcome Section */}
        <div className="bg-dark mb-8">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex items-center gap-6">


              <div className="w-2/3">
                <h1 className="text-5xl font-bold mb-2 text-white flex items-center gap-3">
                  {getGreeting()}, {displayName}! 
                  <HugeiconsIcon icon={WavingHand01Icon} size={40} className="text-highlight" />
                </h1>
                <p className="text-xl text-white/90 mb-3">
                  Welcome to your Proofed dashboard. Generate zero-knowledge proofs and build your credibility.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 flex items-center gap-2">
                    <HugeiconsIcon 
                      icon={userType === 'creator' ? VideoReplayIcon : Briefcase02Icon} 
                      size={16} 
                    />
                    {userType === 'creator' ? 'Creator' : 'Business'}
                  </Badge>
                  {profile?.username && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      @{profile.username}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="w-1/3">
                  <Link href="/dashboard/get-proofed">
                    <div className="bg-highlight text-dark p-6 rounded-3xl flex-1 flex flex-col w-full h-36 relative overflow-hidden group  transition-transform">
                      {/* SVG Pattern Background */}
                      <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                        <path
                          d="M 200 0 Q 250 50 200 100 Q 150 150 200 200"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-dark"
                        />
                        <path
                          d="M 250 0 Q 300 50 250 100 Q 200 150 250 200"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-dark"
                        />
                      </svg>

                      {/* Top Icons Row */}
                      <div className="flex items-start justify-between mb-auto relative z-10">
                        {/* Video/Camera Icon - Top Left */}
                        <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center">
                          <HugeiconsIcon 
                            icon={CheckmarkBadge03Icon}
                            size={24}
                            className="text-highlight"
                          />
                        </div>

                        {/* Arrow Icon - Top Right */}
                        <div className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                          <HugeiconsIcon 
                            icon={ArrowUpRight01Icon}
                            size={24}
                            className="text-dark"
                          />
                        </div>
                      </div>

                      {/* Text at Bottom */}
                      <span className="text-2xl font-bold relative z-10">Get Proofed Now</span>
                    </div>
                  </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light rounded-t-3xl">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Proofs</h3>
                <HugeiconsIcon icon={SecurityLockIcon} size={28} className="text-primary" />
              </div>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-2">
                Get proofed to start building credibility
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Badges Earned</h3>
                <HugeiconsIcon icon={Award01Icon} size={28} className="text-primary" />
              </div>
              <div className="text-3xl font-bold">
                {loadingBadges ? '...' : badges.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {badges.length === 0 ? 'Earn badges by proving your metrics' : 'Keep collecting more badges!'}
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Profile Views</h3>
                <HugeiconsIcon icon={ViewIcon} size={28} className="text-primary" />
              </div>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-2">
                Share your profile to get views
              </p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card title="Getting Started Guide" variant="accent">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-300">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Connect Your Accounts</h3>
                    <p className="text-sm text-muted-foreground">
                      Link YouTube, Stripe, or Google Analytics to start proving metrics.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-300">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Get Proofed</h3>
                    <p className="text-sm text-muted-foreground">
                      Select a metric and threshold to get your first proof badge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-300">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Share Your Badges</h3>
                    <p className="text-sm text-muted-foreground">
                      Display badges on your profile, social media, or pitch decks.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Button asChild className="w-full justify-start" variant="border">
                  <Link href="/dashboard/get-proofed" className="flex items-center">
                    <HugeiconsIcon icon={FlashIcon} size={18} className="mr-2" />
                    Get Proofed
                  </Link>
                </Button>
                {profile?.username && (
                  <Button asChild className="w-full justify-start" variant="border">
                    <Link href={`/@${profile.username}`} className="flex items-center">
                      <HugeiconsIcon icon={UserIcon} size={18} className="mr-2" />
                      View My Profile
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full justify-start" variant="border">
                  <Link href="/explore" className="flex items-center">
                    <HugeiconsIcon icon={Search01Icon} size={18} className="mr-2" />
                    Explore Other Profiles
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="border">
                  <Link href="/dashboard/settings" className="flex items-center">
                    <HugeiconsIcon icon={Settings02Icon} size={18} className="mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </div>
            </Card>

            
          </div>

          {/* Recent Activity - Your Badges */}
          <Card title="My Badges">
                     
            {loadingBadges ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading badges...</p>
              </div>
            ) : badges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold mb-2">No badges yet</h3>
                <p className="text-muted-foreground mb-6">
                  Connect your accounts and get proofed to earn your first badge
                </p>
                <Button asChild>
                  <Link href="/dashboard/get-proofed">
                    Get Proofed
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="p-4 border rounded-lg hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div>
                        {badge.metadata?.icon ? (
                          <div className="text-3xl">{badge.metadata.icon}</div>
                        ) : (
                          <HugeiconsIcon icon={Award01Icon} size={32} className="text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 truncate">
                          {badge.metadata?.name || badge.proof_type}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {badge.metadata?.display || 'Verified'}
                        </p>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {badge.platform}
                          </Badge>
                          {badge.verified && (
                            <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                              <HugeiconsIcon icon={Tick01Icon} size={14} />
                              ZK Proof
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {badge.proof_hash && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <HugeiconsIcon icon={SecurityLockIcon} size={14} />
                          <span className="font-mono truncate flex-1" title={badge.proof_hash}>
                            {badge.proof_hash.slice(0, 8)}...{badge.proof_hash.slice(-6)}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(badge.proof_hash);
                              alert('Proof hash copied to clipboard!');
                            }}
                            className="text-primary hover:text-primary/80"
                            title="Copy proof hash"
                          >
                            <HugeiconsIcon icon={ClipboardIcon} size={16} />
                          </button>
                        </div>
                        
                        {/* zkVerify verification status */}
                        {badge.verified_on_chain ? (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                              <HugeiconsIcon icon={Tick01Icon} size={14} />
                              <span className="font-medium">Verified on zkVerify</span>
                            </span>
                            {badge.explorer_url && (
                              <a
                                href={badge.explorer_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                View ↗
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-xs">
                            <HugeiconsIcon icon={LockKeyIcon} size={14} />
                            <span>Local Proof</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

