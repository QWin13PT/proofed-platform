/**
 * Badges API - Get and add badges to profile
 * GET /api/profiles/[username]/badges - Get all badges for a user
 * POST /api/profiles/[username]/badges - Add a badge
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

    // Get user ID from username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch all badges for this user
    const { data: badges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (badgesError) {
      console.error('Error fetching badges:', badgesError);
      return NextResponse.json(
        { error: 'Failed to fetch badges' },
        { status: 500 }
      );
    }

    return NextResponse.json(badges || []);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    let { username } = await params;
    
    // Remove @ symbol if present and decode URL encoding
    username = decodeURIComponent(username);
    if (username.startsWith('@')) {
      username = username.slice(1);
    }

    const badge = await request.json();

    if (!badge.proofHash || !badge.type) {
      return NextResponse.json(
        { error: 'Badge must include proofHash and type' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Get user ID from username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Insert badge
    const { data: newBadge, error: badgeError } = await supabase
      .from('badges')
      .insert([{
        user_id: user.id,
        proof_hash: badge.proofHash,
        proof_type: badge.type,
        threshold: badge.threshold || 0,
        platform: badge.platform,
        verified: badge.verified !== false,
        metadata: badge.metadata || {},
      }])
      .select()
      .maybeSingle();

    if (badgeError) {
      console.error('Error inserting badge:', badgeError);
      throw badgeError;
    }

    if (!newBadge) {
      return NextResponse.json(
        { error: 'Failed to create badge' },
        { status: 500 }
      );
    }

    return NextResponse.json(newBadge);
  } catch (error) {
    console.error('Error adding badge:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add badge' },
      { status: 400 }
    );
  }
}

