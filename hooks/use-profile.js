/**
 * Profile data hook
 * Fetches and manages user profile data
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Profile hook
 * @param {string} username - Username to fetch profile for
 * @returns {Object} Profile state and methods
 */
export function useProfile(username) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/profiles/${username}`);
      
      if (!response.ok) {
        throw new Error('Profile not found');
      }

      const data = await response.json();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Fetch on mount and when username changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Update profile
   * @param {Object} updates - Fields to update
   */
  const updateProfile = useCallback(async (updates) => {
    if (!username) return;

    try {
      const response = await fetch(`/api/profiles/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setError(null);
      
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      throw err;
    }
  }, [username]);

  /**
   * Add badge to profile
   * @param {Object} badge - Badge to add
   */
  const addBadge = useCallback(async (badge) => {
    if (!username) return;

    try {
      const response = await fetch(`/api/profiles/${username}/badges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(badge),
      });

      if (!response.ok) {
        throw new Error('Failed to add badge');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setError(null);
      
      return updatedProfile;
    } catch (err) {
      console.error('Error adding badge:', err);
      setError(err.message);
      throw err;
    }
  }, [username]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    addBadge,
  };
}

