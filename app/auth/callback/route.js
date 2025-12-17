/**
 * Auth Callback Route Handler
 * Handles OAuth redirects from Supabase and exchanges the code for a session
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  console.log('Auth callback - Code present:', !!code);

  if (code) {
    try {
      const supabase = await createServerClient();
      
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('Code exchange result:', { 
        hasSession: !!data?.session, 
        hasUser: !!data?.user,
        error: error?.message 
      });

      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error.message)}`);
      }

      if (data?.session) {
        const userId = data.user.id;
        
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        console.log('Profile check:', { hasProfile: !!profile, error: profileError?.message });

        if (profileError) {
          console.error('Error checking profile:', profileError);
        }

        // Redirect based on profile existence
        if (!profile) {
          // No profile, redirect to onboarding
          return NextResponse.redirect(`${origin}/onboarding`);
        } else {
          // Profile exists, redirect to dashboard
          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }
    } catch (err) {
      console.error('Unexpected error in auth callback:', err);
      return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(err.message)}`);
    }
  }

  // No code provided, redirect to sign in
  console.warn('No code provided in auth callback');
  return NextResponse.redirect(`${origin}/signin`);
}

