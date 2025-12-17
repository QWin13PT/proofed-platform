/**
 * Supabase client for server-side usage
 */

import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Cookie setting might fail in some contexts (like middleware)
          console.warn('Failed to set cookie:', name, error);
        }
      },
      remove(name, options) {
        try {
          cookieStore.delete({ name, ...options });
        } catch (error) {
          // Cookie removal might fail in some contexts
          console.warn('Failed to remove cookie:', name, error);
        }
      },
    },
  });
}

