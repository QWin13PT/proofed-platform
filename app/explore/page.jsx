'use client';

/**
 * Explore Page - Directory of all verified users
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import UserCard from '@/components/cards/userCard';
import SearchBar from '@/components/shared/searchBar';
import PlatformFilter from '@/components/forms/platformFilter';
import UserTypeFilter from '@/components/forms/userTypeFilter';
import VerifiedCheckbox from '@/components/forms/verifiedCheckbox';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';

export default function ExplorePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter profiles by search, user type, platform, and verification status
  const filteredProfiles = profiles.filter(profile => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = profile.display_name?.toLowerCase().includes(query);
      const matchesUsername = profile.username?.toLowerCase().includes(query);
      if (!matchesName && !matchesUsername) return false;
    }

    // Verified filter
    if (verifiedOnly && !profile.is_verified) {
      return false;
    }

    // User type filter
    if (userTypeFilter !== 'all' && profile.user_type !== userTypeFilter) {
      return false;
    }

    // Platform filter
    if (platformFilter !== 'all') {
      if (!profile.platforms || !profile.platforms.includes(platformFilter)) {
        return false;
      }
    }

    return true;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePlatformFilter = (platform) => {
    setPlatformFilter(platform);
  };

  const handleUserTypeFilter = (type) => {
    setUserTypeFilter(type);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme="dark" />

      <main className="flex-1 bg-dark">
        {/* Search Section */}
        <div className="bg-dark p-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-row gap-3 w-full">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search by name or username..."
                variant="explore"
                className="flex-1"
              />
              <div className="flex flex-row gap-3">
              
                <UserTypeFilter
                  onSelect={handleUserTypeFilter}
                  selectedType={userTypeFilter}
                  variant="dark"
                />
                <PlatformFilter
                  onSelect={handlePlatformFilter}
                  selectedPlatform={platformFilter}
                  variant="dark"
                />
                  <VerifiedCheckbox
                  checked={verifiedOnly}
                  onChange={setVerifiedOnly}
                  variant="highlight"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light rounded-t-3xl">
          <div className="container mx-auto px-4 py-12 max-w-7xl">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading profiles...</p>
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold mb-2 text-dark">No profiles found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'Be the first to get proofed!'}
                </p>
                <Button asChild>
                  <Link href="/dashboard/get-proofed">
                    Get Proofed
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProfiles.map((profile) => (
                  <UserCard key={profile.id} profile={profile} />
                ))}
              </div>
            )}

            {/* CTA Section */}
            {!loading && filteredProfiles.length > 0 && (
              <div className="mt-16 text-center">
                <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-2xl font-bold mb-3 text-dark">
                      Join the Verified Community
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Get your metrics verified with zero-knowledge proofs and showcase your achievements
                    </p>
                    <Button size="lg" asChild>
                      <Link href="/dashboard/get-proofed">
                        Get Proofed Now
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
