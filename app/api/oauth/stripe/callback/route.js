/**
 * Stripe OAuth Callback - Handle OAuth code exchange
 * GET /api/oauth/stripe/callback - Exchange code for access token
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state'); // User ID
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const origin = requestUrl.origin;

  // Handle OAuth error
  if (error) {
    console.error('Stripe OAuth error:', error, errorDescription);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Connection Failed</title></head>
        <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fee; color: #c00;">
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
            <h1 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Connection Failed</h1>
            <p style="margin: 0;">${errorDescription || 'Stripe connection was cancelled or failed'}</p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">This window will close automatically...</p>
          </div>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!code || !state) {
    console.error('Stripe OAuth: Missing code or state');
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Connection Failed</title></head>
        <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fee; color: #c00;">
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
            <h1 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Invalid Response</h1>
            <p style="margin: 0;">OAuth response was invalid.</p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">This window will close automatically...</p>
          </div>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }

  try {
    const supabase = await createServerClient();
    
    // Verify user is still authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.id !== state) {
      console.error('Stripe OAuth: User not authenticated or state mismatch');
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Authentication Required</title></head>
          <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fee; color: #c00;">
            <div style="text-align: center; padding: 2rem;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
              <h1 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Authentication Required</h1>
              <p style="margin: 0;">Please sign in to connect Stripe.</p>
              <p style="margin-top: 1rem; font-size: 0.9rem;">This window will close automatically...</p>
            </div>
            <script>setTimeout(() => window.close(), 2000);</script>
          </body>
        </html>`,
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const clientSecret = process.env.STRIPE_CLIENT_SECRET;

    if (!clientSecret) {
      console.error('Stripe OAuth: Missing STRIPE_CLIENT_SECRET');
      return NextResponse.redirect(
        `${origin}/dashboard/get-proofed?error=${encodeURIComponent('Stripe OAuth not configured')}`
      );
    }

    // Exchange code for tokens
    console.log('Stripe OAuth: Exchanging code for tokens');
    const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Stripe OAuth: Token exchange failed:', errorData);
      throw new Error(errorData.error_description || 'Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();
    console.log('Stripe OAuth: Tokens received for account:', tokens.stripe_user_id);

    // Store connection in database
    const { error: dbError } = await supabase
      .from('connections')
      .upsert({
        user_id: user.id,
        platform: 'stripe',
        platform_user_id: tokens.stripe_user_id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        metadata: {
          livemode: tokens.livemode || false,
          stripe_publishable_key: tokens.stripe_publishable_key,
        },
      }, {
        onConflict: 'user_id,platform',
      });

    if (dbError) {
      console.error('Stripe OAuth: Database error:', dbError);
      throw dbError;
    }

    console.log('Stripe OAuth: Connection saved successfully');

    // Return HTML that closes the popup window
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Stripe Connected</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #635bff 0%, #4a47a3 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            .success-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
              animation: bounce 0.5s ease;
            }
            @keyframes bounce {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            h1 { margin: 0 0 0.5rem 0; font-size: 1.5rem; }
            p { margin: 0; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Stripe Connected!</h1>
            <p>You can close this window now.</p>
          </div>
          <script>
            // Send success message to parent window
            if (window.opener) {
              window.opener.postMessage(
                { type: 'oauth_success', platform: 'stripe' },
                window.location.origin
              );
            }
            
            // Close the popup after a short delay
            setTimeout(() => {
              window.close();
            }, 1500);
          </script>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in Stripe OAuth callback:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Connection Failed</title></head>
        <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fee; color: #c00;">
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
            <h1 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Connection Failed</h1>
            <p style="margin: 0;">${error.message || 'Stripe connection failed'}</p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">This window will close automatically...</p>
          </div>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

