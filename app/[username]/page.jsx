'use client';

/**
 * Public Profile Page - /username
 * Display user's verified metrics and badges
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/context/auth-context';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

// Platform configurations (same as get-proofed)
const PLATFORMS = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: '/images/brands/youtube-icon.svg',
    logo: '/images/brands/youtube.svg',
    color: '#FF0000',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    icon: '/images/brands/stripe-icon.svg',
    logo: '/images/brands/stripe.svg',
    color: '#635BFF',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
  },
  twitter: {
    id: 'twitter',
    name: 'X / Twitter',
    icon: '/images/brands/x.svg',
    logo: '/images/brands/x.svg',
    color: '#000000',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
  },
  shopify: {
    id: 'shopify',
    name: 'Shopify',
    icon: '/images/brands/shopify-icon.svg',
    logo: '/images/brands/shopify.svg',
    color: '#96BF48',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
  },
  analytics: {
    id: 'analytics',
    name: 'Google Analytics',
    icon: '/images/brands/google-analytics-icon.svg',
    logo: '/images/brands/google-analytics.svg',
    color: '#F9AB00',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '/images/brands/hubspot-icon.svg',
    logo: '/images/brands/hubspot.svg',
    color: '#FF7A59',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
  },
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, profile: currentProfile } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Remove @ symbol if present in URL
  const username = params.username?.startsWith('@')
    ? params.username.slice(1)
    : params.username;
  const isOwnProfile = currentProfile?.username === username;

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/profiles/${username}`);

        if (!response.ok) {
          throw new Error('Profile not found');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // No mock badges - show real badges from database only

  // Copy profile link
  const copyProfileLink = () => {
    const link = `${window.location.origin}/@${username}`;
    navigator.clipboard.writeText(link);
    alert('Profile link copied!');
  };

  // Share to Twitter
  const shareToTwitter = () => {
    const text = `Check out my verified metrics on Proofed!`;
    const url = `${window.location.origin}/@${username}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  // Share to LinkedIn
  const shareToLinkedIn = () => {
    const url = `${window.location.origin}/@${username}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header theme="dark" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The user @{username} doesn't exist or hasn't set up their profile yet.
            </p>
            <Button asChild>
              <Link href="/explore">Explore Other Profiles</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Group badges by platform
  const badgesByPlatform = (profile.badges || []).reduce((acc, badge) => {
    if (!acc[badge.platform]) {
      acc[badge.platform] = [];
    }
    // Transform database badge to display format
    acc[badge.platform].push({
      ...badge,
      display: badge.metadata?.display || badge.proof_type,
      metric: badge.proof_type,
    });
    return acc;
  }, {});

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme="dark" />

      <main className="flex-1 bg-dark">
        {/* Profile Header */}
        <div className="bg-dark pb-8">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32 border-4 border-white/20">
                <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                <AvatarFallback className="bg-white/20 text-white text-4xl">
                  {profile.display_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {profile.display_name}
                </h1>
                <p className="text-xl text-white/70 mb-3">
                  @{profile.username}
                </p>
                {profile.bio && (
                  <p className="text-white/90 text-lg mb-4 max-w-2xl">
                    {profile.bio}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {profile.user_type === 'creator' ? '📺 Creator' : '💼 Business'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    ✓ {profile.badges?.length || 0} Verified Metrics
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <Button asChild variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button asChild className="bg-highlight text-dark hover:bg-highlight/90 font-semibold shadow-lg">
                      <Link href="/dashboard/get-proofed">Get Proofed</Link>
                    </Button>
                  </>
                ) : (
                  <div className="relative">
                    <Button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="bg-white text-dark hover:bg-white/90"
                    >
                      Share Profile
                    </Button>
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border p-2 z-10">
                        <button
                          onClick={copyProfileLink}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                        >
                          📋 Copy Link
                        </button>
                        <button
                          onClick={shareToTwitter}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                        >
                          𝕏 Share on Twitter
                        </button>
                        <button
                          onClick={shareToLinkedIn}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                        >
                          💼 Share on LinkedIn
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Verified Metrics */}
        <div className="bg-light rounded-t-3xl">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h2 className="text-2xl font-bold mb-6">Verified Metrics</h2>

            {profile.badges?.length === 0 || !profile.badges ? (
              <Card className="p-12 text-center border-2 border-dark/10">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2 text-dark">No verified metrics yet</h3>
                <p className="text-dark/70 text-lg mb-6 max-w-md mx-auto">
                  {isOwnProfile
                    ? "Get started by connecting your platforms and verifying your metrics on the blockchain."
                    : `${profile.display_name} hasn't verified any metrics yet.`}
                </p>
                {isOwnProfile && (
                  <Button asChild className="bg-dark hover:bg-dark/90 text-light font-semibold shadow-lg">
                    <Link href="/dashboard/get-proofed">Get Proofed</Link>
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(badgesByPlatform).map(([platformId, badges]) => {
                  const platform = PLATFORMS[platformId];
                  if (!platform) return null;

                  return (
                    <Card
                      key={platformId}
                      title={platform.name}
                      description={`${badges.length} Verified Metrics`}
                      image={<Image src={platform.icon} alt={`${platform.name} icon`} width={32} height={32} className="object-contain" />}
                      topRight={<Button variant="highlight" size="sm" ><Image src="/images/brands/zkverify.svg" alt="zkVerify" width={60} height={12} /></Button>}
                    >
                      {/* Metrics */}
                      <div className="space-y-3">
                        {badges.map((badge, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border-2 border-highlight bg-highlight/5 hover:bg-highlight/10 transition-all"
                          >
                            <div className="flex items-start justify-between gap-4">
                              {/* Metric Info */}
                              <div className="flex-1">
                                <div className="text-sm font-medium text-dark/60 mb-1">
                                  {badge.metadata?.name || badge.proof_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </div>
                                <div className="font-bold text-3xl text-accent">
                                  {badge.display}
                                </div>
                              </div>

                              {/* Explorer Button */}
                              {badge.verified_on_chain && badge.explorer_url && (
                                <a
                                  href={badge.explorer_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="shrink-0 px-4 py-2 rounded-lg bg-dark text-light hover:bg-dark/90 transition-all flex items-center gap-2 text-sm font-medium shadow-sm"
                                  title="View on zkVerify Explorer"
                                >
                                  <Image
                                    src="/images/brands/zkverify-icon.svg"
                                    alt="zkVerify"
                                    width={14}
                                    height={14}
                                  />
                                  View Proof ↗
                                </a>
                              )}
                            </div>

                            {/* Local Proof Badge (if not on chain) */}
                            {badge.proof_hash && !badge.verified_on_chain && (
                              <div className="mt-3 pt-3 border-t border-highlight/20">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-medium text-xs">
                                  <span>🔒</span>
                                  <span>Local Proof</span>
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Embed Code Section */}
            {isOwnProfile && profile.badges?.length > 0 && (
              <Card className="p-6 mt-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-2 text-dark">Embed Your Badges</h3>
                <p className="text-base text-dark/70 mb-4">
                  Copy this code to display your verified metrics on your website or blog.
                </p>
                <div className="bg-dark text-highlight p-4 rounded-xl font-mono text-sm overflow-x-auto border-2 border-gray-200">
                  {`<iframe src="${window.location.origin}/embed/@${username}" width="100%" height="400" frameborder="0"></iframe>`}
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `<iframe src="${window.location.origin}/embed/@${username}" width="100%" height="400" frameborder="0"></iframe>`
                    );
                    alert('Embed code copied!');
                  }}
                  className="mt-4 bg-dark hover:bg-dark/90 text-light font-semibold shadow-md"
                >
                  📋 Copy Embed Code
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

