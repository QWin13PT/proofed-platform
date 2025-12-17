/**
 * YouTube OAuth Callback - Handle OAuth code exchange
 * GET /api/oauth/youtube/callback - Exchange code for access token
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state'); // User ID
  const error = requestUrl.searchParams.get('error');
  const origin = requestUrl.origin;

  // Handle OAuth error
  if (error) {
    console.error('YouTube OAuth error:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Connection Failed</title></head>
        <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fee; color: #c00;">
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
            <h1 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Connection Failed</h1>
            <p style="margin: 0;">YouTube connection was cancelled or failed.</p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">This window will close automatically...</p>
          </div>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!code || !state) {
    console.error('YouTube OAuth: Missing code or state');
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
      console.error('YouTube OAuth: User not authenticated or state mismatch');
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Authentication Required</title></head>
          <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fee; color: #c00;">
            <div style="text-align: center; padding: 2rem;">
              <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
              <h1 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Authentication Required</h1>
              <p style="margin: 0;">Please sign in to connect YouTube.</p>
              <p style="margin-top: 1rem; font-size: 0.9rem;">This window will close automatically...</p>
            </div>
            <script>setTimeout(() => window.close(), 2000);</script>
          </body>
        </html>`,
        { status: 200, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = `${origin}/api/oauth/youtube/callback`;

    if (!clientId || !clientSecret) {
      console.error('YouTube OAuth: Missing credentials');
      return NextResponse.redirect(
        `${origin}/dashboard/get-proofed?error=${encodeURIComponent('YouTube OAuth not configured')}`
      );
    }

    // Exchange code for tokens
    console.log('YouTube OAuth: Exchanging code for tokens');
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('YouTube OAuth: Token exchange failed:', errorData);
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();
    console.log('YouTube OAuth: Tokens received');

    // Get YouTube channel info
    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!channelResponse.ok) {
      console.error('YouTube OAuth: Failed to fetch channel info');
      throw new Error('Failed to fetch YouTube channel');
    }

    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      throw new Error('No YouTube channel found');
    }

    console.log('YouTube OAuth: Channel found:', channel.snippet.title);

    // Calculate token expiration
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

    // Store connection in database
    const { error: dbError } = await supabase
      .from('connections')
      .upsert({
        user_id: user.id,
        platform: 'youtube',
        platform_user_id: channel.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: expiresAt.toISOString(),
        scope: tokens.scope,
        metadata: {
          channel_title: channel.snippet.title,
          channel_thumbnail: channel.snippet.thumbnails?.default?.url,
        },
      }, {
        onConflict: 'user_id,platform',
      });

    if (dbError) {
      console.error('YouTube OAuth: Database error:', dbError);
      throw dbError;
    }

    console.log('YouTube OAuth: Connection saved successfully');

    // Return HTML that closes the popup window
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>YouTube Connected</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            <h1>YouTube Connected!</h1>
            <p>You can close this window now.</p>
          </div>
          <script>
            // Send success message to parent window
            if (window.opener) {
              window.opener.postMessage(
                { type: 'oauth_success', platform: 'youtube' },
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
    console.error('Error in YouTube OAuth callback:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Connection Failed</title></head>
        <body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fee; color: #c00;">
          <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
            <h1 style="margin: 0 0 0.5rem 0; font-size: 1.5rem;">Connection Failed</h1>
            <p style="margin: 0;">${error.message || 'YouTube connection failed'}</p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">This window will close automatically...</p>
          </div>
          <script>setTimeout(() => window.close(), 2000);</script>
        </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

