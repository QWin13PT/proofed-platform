/**
 * Authentication hook using Supabase Auth
 * Manages user authentication state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';

/**
 * Authentication hook
 * @returns {Object} Auth state and methods
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const fetchingProfile = useRef(false);

  // Load user session on mount
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          setLoading(false);
        }
      } finally {
        if (mounted) {
          setInitialLoadComplete(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes (only after initial load)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip if this is the initial session event (already handled above)
        if (!initialLoadComplete && event === 'INITIAL_SESSION') {
          return;
        }

        if (!mounted) return;

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialLoadComplete]);

  /**
   * Fetch user profile from database
   */
  const fetchProfile = async (userId) => {
    // Prevent concurrent fetches
    if (fetchingProfile.current) {
      console.log('Profile fetch already in progress, skipping...');
      return;
    }

    fetchingProfile.current = true;

    try {
      console.log('Fetching profile for userId:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle not found gracefully

      console.log('Profile fetch result:', { data, error });

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (!data) {
        console.warn('No profile found for user:', userId);
        // Profile not found is not an error - user might need to complete onboarding
        setProfile(null);
      } else {
        setProfile(data);
      }
      
      // Always set loading to false when profile fetch completes (whether found or not)
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      // Still set loading to false even on error - we've completed the fetch attempt
      setProfile(null);
      setLoading(false);
    } finally {
      fetchingProfile.current = false;
    }
  };

  /**
   * Sign in with Google
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Sign out user
   */
  const signOut = useCallback(async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Update user profile
   * @param {Object} updates - Fields to update
   */
  const updateProfile = useCallback(async (updates) => {
    if (!user) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      throw err;
    }
  }, [user]);

  /**
   * Create user profile
   * @param {Object} profileData - Profile data
   */
  const createProfile = useCallback(async (profileData) => {
    if (!user) {
      const error = new Error('User not authenticated');
      console.error('createProfile called without user:', error);
      throw error;
    }

    try {
      setError(null);
      console.log('Creating profile with data:', { id: user.id, email: user.email, ...profileData });
      
      const { data, error } = await supabase
        .from('users')
        .insert([{ id: user.id, email: user.email, ...profileData }])
        .select()
        .maybeSingle(); // Use maybeSingle for consistency

      console.log('Profile creation result:', { data, error });

      if (error) {
        console.error('Supabase error creating profile:', error);
        throw error;
      }
      
      if (!data) {
        const noDataError = new Error('Profile created but no data returned');
        console.error(noDataError);
        throw noDataError;
      }

      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.message);
      throw err;
    }
  }, [user]);

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    updateProfile,
    createProfile,
    refetchProfile: () => user && fetchProfile(user.id),
  };
}

