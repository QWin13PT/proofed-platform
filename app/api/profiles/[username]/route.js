/**
 * Profile API - Single Profile
 * GET /api/profiles/[username] - Get profile by username
 * PUT /api/profiles/[username] - Update profile
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request, { params }) {
  try {
    let { username } = await params;
    
    // Remove @ symbol if present and decode URL encoding
    username = decodeURIComponent(username);
    if (username.startsWith('@')) {
      username = username.slice(1);
    }

    const supabase = await createServerClient();
    
    // Fetch profile from Supabase
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Fetch badges for this user
    const { data: badges } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', profile.id);

    return NextResponse.json({
      ...profile,
      badges: badges || [],
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    let { username } = await params;
    
    // Remove @ symbol if present and decode URL encoding
    username = decodeURIComponent(username);
    if (username.startsWith('@')) {
      username = username.slice(1);
    }

    const updates = await request.json();
    const supabase = await createServerClient();

    // Update profile in Supabase
    const { data: profile, error } = await supabase
      .from('users')
      .update(updates)
      .eq('username', username)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 400 }
    );
  }
}

