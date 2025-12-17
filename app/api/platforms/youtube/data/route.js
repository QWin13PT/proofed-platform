/**
 * YouTube Data API - Fetch channel statistics
 * GET /api/platforms/youtube/data - Get YouTube channel metrics
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request) {
  try {
    const supabase = await createServerClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get YouTube connection
    const { data: connection, error: connError } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'youtube')
      .maybeSingle();

    if (connError) {
      console.error('Error fetching YouTube connection:', connError);
      return NextResponse.json(
        { error: 'Failed to fetch connection' },
        { status: 500 }
      );
    }

    if (!connection) {
      return NextResponse.json(
        { error: 'YouTube not connected' },
        { status: 404 }
      );
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(connection.token_expires_at);
    
    if (now >= expiresAt && connection.refresh_token) {
      console.log('YouTube: Access token expired, refreshing...');
      // TODO: Implement token refresh
      // For now, return error and ask user to reconnect
      return NextResponse.json(
        { error: 'Token expired, please reconnect YouTube' },
        { status: 401 }
      );
    }

    // Fetch channel statistics
    console.log('YouTube: Fetching channel statistics');
    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&mine=true',
      {
        headers: { Authorization: `Bearer ${connection.access_token}` },
      }
    );

    if (!channelResponse.ok) {
      const errorText = await channelResponse.text();
      console.error('YouTube API error:', errorText);
      throw new Error('Failed to fetch YouTube data');
    }

    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      throw new Error('No YouTube channel found');
    }

    const stats = channel.statistics;

    // Format metrics for display
    const metrics = {
      subscribers: {
        id: 'subscribers',
        name: 'Subscriber Count',
        value: parseInt(stats.subscriberCount || 0),
        display: formatNumber(stats.subscriberCount || 0),
        icon: '👥',
        unit: 'subscribers',
      },
      total_views: {
        id: 'total_views',
        name: 'Total Views',
        value: parseInt(stats.viewCount || 0),
        display: formatNumber(stats.viewCount || 0),
        icon: '👀',
        unit: 'views',
      },
      video_count: {
        id: 'video_count',
        name: 'Total Videos',
        value: parseInt(stats.videoCount || 0),
        display: formatNumber(stats.videoCount || 0),
        icon: '🎬',
        unit: 'videos',
      },
    };

    // Calculate average views per video
    if (stats.videoCount && stats.viewCount) {
      const avgViews = Math.floor(parseInt(stats.viewCount) / parseInt(stats.videoCount));
      metrics.avg_views = {
        id: 'avg_views',
        name: 'Average Views per Video',
        value: avgViews,
        display: formatNumber(avgViews),
        icon: '📊',
        unit: 'avg views',
      };
    }

    console.log('YouTube: Successfully fetched metrics');

    return NextResponse.json({
      platform: 'youtube',
      connected: true,
      channel_title: connection.metadata?.channel_title,
      metrics,
    });
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch YouTube data' },
      { status: 500 }
    );
  }
}

/**
 * Format numbers for display (e.g., 1000 -> "1K", 1000000 -> "1M")
 */
function formatNumber(num) {
  const n = parseInt(num);
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'K';
  }
  return n.toString();
}

