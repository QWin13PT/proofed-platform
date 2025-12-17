'use client';

/**
 * Public Profile Page - @username
 * Display user's verified metrics and badges
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/context/auth-context';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

// Platform configurations (same as get-proofed)
const PLATFORMS = {
  youtube: { id: 'youtube', name: 'YouTube', icon: '📺', color: 'red' },
  stripe: { id: 'stripe', name: 'Stripe', icon: '💳', color: 'purple' },
  twitter: { id: 'twitter', name: 'X / Twitter', icon: '𝕏', color: 'black' },
  shopify: { id: 'shopify', name: 'Shopify', icon: '🛍️', color: 'green' },
  analytics: { id: 'analytics', name: 'Google Analytics', icon: '📊', color: 'orange' },
  hubspot: { id: 'hubspot', name: 'HubSpot', icon: '🎯', color: 'orange' },
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, profile: currentProfile } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const username = params.username;
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

  // Mock data for demonstration
  useEffect(() => {
    if (!profile && !loading) {
      // If API fails, use mock data for demonstration
      setProfile({
        username,
        display_name: username.charAt(0).toUpperCase() + username.slice(1),
        bio: 'Building cool stuff with zero-knowledge proofs 🔐',
        user_type: 'creator',
        avatar_url: null,
        badges: [
          {
            platform: 'youtube',
            metric: 'subscribers',
            display: '125K subscribers',
            icon: '👥',
            verified: true,
          },
          {
            platform: 'stripe',
            metric: 'monthly_revenue',
            display: '$15K/month',
            icon: '💰',
            verified: true,
          },
          {
            platform: 'twitter',
            metric: 'followers',
            display: '50K followers',
            icon: '👥',
            verified: true,
          },
        ],
      });
      setLoading(false);
    }
  }, [profile, loading, username]);

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
    acc[badge.platform].push(badge);
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
                    <Button asChild variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button asChild className="bg-white text-dark hover:bg-white/90">
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
              <Card className="p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">No verified metrics yet</h3>
                <p className="text-muted-foreground mb-6">
                  {isOwnProfile
                    ? "Get started by connecting your platforms and verifying your metrics."
                    : `${profile.display_name} hasn't verified any metrics yet.`}
                </p>
                {isOwnProfile && (
                  <Button asChild>
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
                    <Card key={platformId} className="p-6">
                      {/* Platform Header */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                        <div className="text-3xl">{platform.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold">{platform.name}</h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                            ✓ Verified
                          </Badge>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-3">
                        {badges.map((badge, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{badge.icon}</span>
                              <span className="font-semibold">{badge.display}</span>
                            </div>
                            {badge.verified && (
                              <span className="text-green-500 text-sm">✓</span>
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
              <Card className="p-6 mt-8">
                <h3 className="text-xl font-bold mb-4">Embed Your Badges</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Copy this code to display your verified metrics on your website or blog.
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  {`<iframe src="${window.location.origin}/embed/@${username}" width="100%" height="400" frameborder="0"></iframe>`}
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `<iframe src="${window.location.origin}/embed/@${username}" width="100%" height="400" frameborder="0"></iframe>`
                    );
                    alert('Embed code copied!');
                  }}
                  variant="outline"
                  className="mt-4"
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

