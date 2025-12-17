/**
 * Badges API - Add badges by user ID
 * POST /api/badges - Add multiple badges for current user
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    const supabase = await createServerClient();
    
    // Get current user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('Badges API - Auth check:', { 
      hasUser: !!user, 
      userId: user?.id, 
      authError: authError?.message 
    });
    
    if (authError || !user) {
      console.error('Badges API - Not authenticated:', authError);
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const badges = body.badges || [];

    console.log('Badges API - Received badges:', badges.length);

    if (!Array.isArray(badges) || badges.length === 0) {
      return NextResponse.json(
        { error: 'No badges provided' },
        { status: 400 }
      );
    }

    // Process each badge - update if exists, insert if new
    const processedBadges = [];
    
    for (const badge of badges) {
      const badgeData = {
        user_id: badge.user_id || user.id,
        proof_hash: badge.proof_hash || `0x${Math.random().toString(16).slice(2)}`,
        proof_type: badge.proof_type,
        threshold: badge.threshold ?? null,
        platform: badge.platform,
        verified: badge.verified !== false,
        metadata: badge.metadata || {},
        // zkVerify transaction data
        tx_hash: badge.tx_hash || null,
        block_hash: badge.block_hash || null,
        verified_on_chain: badge.verified_on_chain || false,
        explorer_url: badge.explorer_url || null,
      };

      // Check if badge already exists for this user + platform + metric
      const { data: existingBadge } = await supabase
        .from('badges')
        .select('id')
        .eq('user_id', badgeData.user_id)
        .eq('platform', badgeData.platform)
        .eq('proof_type', badgeData.proof_type)
        .maybeSingle();

      if (existingBadge) {
        // UPDATE existing badge
        console.log(`Updating existing badge: ${badgeData.platform}.${badgeData.proof_type}`);
        const { data: updatedBadge, error: updateError } = await supabase
          .from('badges')
          .update({
            proof_hash: badgeData.proof_hash,
            threshold: badgeData.threshold,
            verified: badgeData.verified,
            metadata: badgeData.metadata,
            tx_hash: badgeData.tx_hash,
            block_hash: badgeData.block_hash,
            verified_on_chain: badgeData.verified_on_chain,
            explorer_url: badgeData.explorer_url,
          })
          .eq('id', existingBadge.id)
          .select()
          .single();

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
        processedBadges.push(updatedBadge);
      } else {
        // INSERT new badge
        console.log(`Inserting new badge: ${badgeData.platform}.${badgeData.proof_type}`);
        const { data: newBadge, error: insertError } = await supabase
          .from('badges')
          .insert([badgeData])
          .select()
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        processedBadges.push(newBadge);
      }
    }

    console.log('Badges API - Successfully processed:', processedBadges.length);

    return NextResponse.json(processedBadges, { status: 200 });
  } catch (error) {
    console.error('Error adding badges:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add badges' },
      { status: 500 }
    );
  }
}

