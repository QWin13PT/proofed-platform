/**
 * Stripe OAuth - Initiate OAuth flow
 * GET /api/oauth/stripe - Redirect to Stripe Connect
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

    const clientId = process.env.STRIPE_CLIENT_ID;
    const redirectUri = `${request.nextUrl.origin}/api/oauth/stripe/callback`;
    
    if (!clientId) {
      console.error('Stripe OAuth: Missing STRIPE_CLIENT_ID');
      return NextResponse.json(
        { error: 'Stripe OAuth not configured' },
        { status: 500 }
      );
    }

    // Stripe Connect OAuth URL
    const params = new URLSearchParams({
      client_id: clientId,
      state: user.id, // Pass user ID for verification
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'read_only', // Read-only access to Stripe data
    });

    const authUrl = `https://connect.stripe.com/oauth/authorize?${params.toString()}`;

    console.log('Stripe OAuth: Redirecting to Stripe Connect');
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Error initiating Stripe OAuth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth' },
      { status: 500 }
    );
  }
}

