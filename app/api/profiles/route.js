/**
 * Profiles API - List and Create
 * GET /api/profiles - Get all profiles
 * POST /api/profiles - Create new profile
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = await createServerClient();
    
    // Build query
    let query = supabase
      .from('users')
      .select('id, username, display_name, user_type, avatar_url, is_verified, created_at');
    
    // Filter by user type if specified
    if (userType) {
      query = query.eq('user_type', userType);
    }
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data: profiles, error } = await query;
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profiles' },
        { status: 500 }
      );
    }
    
    // Fetch badge counts and platforms for each profile
    const profilesWithBadges = await Promise.all(
      profiles.map(async (profile) => {
        const { data: badges } = await supabase
          .from('badges')
          .select('platform')
          .eq('user_id', profile.id);
        
        // Get unique platforms
        const platforms = [...new Set(badges?.map(b => b.platform) || [])];
        
        return {
          ...profile,
          badge_count: badges?.length || 0,
          platforms,
        };
      })
    );

    return NextResponse.json(profilesWithBadges);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, displayName, userType, bio, avatarUrl } = body;

    if (!username || !userType) {
      return NextResponse.json(
        { error: 'Username and userType are required' },
        { status: 400 }
      );
    }

    const profile = await createProfile({
      username,
      displayName,
      userType,
      bio,
      avatarUrl,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 400 }
    );
  }
}

