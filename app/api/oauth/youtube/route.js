/**
 * YouTube OAuth - Initiate OAuth flow
 * GET /api/oauth/youtube - Redirect to Google OAuth consent screen
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createServerClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.redirect(`${request.nextUrl.origin}/signin`);
    }

    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const redirectUri = `${request.nextUrl.origin}/api/oauth/youtube/callback`;
    
    if (!clientId) {
      console.error('YouTube OAuth: Missing YOUTUBE_CLIENT_ID');
      return NextResponse.json(
        { error: 'YouTube OAuth not configured' },
        { status: 500 }
      );
    }

    // YouTube requires these scopes
    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
    ];

    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline', // Get refresh token
      prompt: 'consent', // Force consent to get refresh token
      state: user.id, // Pass user ID for verification
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log('YouTube OAuth: Redirecting to consent screen');
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating YouTube OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}

