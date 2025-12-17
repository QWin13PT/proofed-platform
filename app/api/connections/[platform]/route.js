/**
 * Connection Status API - Check if platform is connected
 * GET /api/connections/[platform] - Get connection info for a platform
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request, { params }) {
  try {
    const { platform } = params;
    const supabase = await createServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get connection for this platform
    const { data: connection, error: connectionError } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .maybeSingle();

    if (connectionError) {
      console.error('Connection check error:', connectionError);
      throw connectionError;
    }

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found', connected: false },
        { status: 404 }
      );
    }

    // Return connection info (without sensitive tokens)
    return NextResponse.json({
      connected: true,
      platform: connection.platform,
      platform_user_id: connection.platform_user_id,
      created_at: connection.created_at,
      updated_at: connection.updated_at,
      metadata: connection.metadata,
    });
  } catch (error) {
    console.error('Error checking connection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check connection' },
      { status: 500 }
    );
  }
}

