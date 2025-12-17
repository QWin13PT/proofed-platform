/**
 * Proof Generation API - Generate zkVerify proofs for metrics
 * POST /api/proofs/generate - Generate a ZK proof for a metric
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { submitProofToChain } from '@/lib/zkverify/chain-client';

export async function POST(request) {
  try {
    const supabase = await createServerClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { metric, platform, threshold } = await request.json();

    if (!metric || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: metric, platform' },
        { status: 400 }
      );
    }

    console.log(`Generating proof for user ${user.id}: ${platform}.${metric}`);

    // Get user's connection for the platform
    const { data: connection } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .maybeSingle();

    if (!connection) {
      return NextResponse.json(
        { error: `${platform} not connected` },
        { status: 404 }
      );
    }

    // Fetch actual metric value from platform
    let actualValue;
    try {
      const dataResponse = await fetch(
        `${request.nextUrl.origin}/api/platforms/${platform}/data`,
        {
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
        }
      );

      if (!dataResponse.ok) {
        throw new Error('Failed to fetch platform data');
      }

      const data = await dataResponse.json();
      actualValue = data.metrics?.[metric]?.value;

      if (actualValue === undefined) {
        throw new Error(`Metric ${metric} not found`);
      }
    } catch (error) {
      console.error('Error fetching metric value:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metric value' },
        { status: 500 }
      );
    }

    // Check if threshold is met (if provided)
    if (threshold && actualValue < threshold) {
      return NextResponse.json(
        { 
          error: `Metric value ${actualValue} does not meet threshold ${threshold}`,
          actualValue,
          threshold,
        },
        { status: 400 }
      );
    }

    // Generate ZK proof and submit to zkVerify chain
    console.log(`🔐 Generating proof: ${metric} = ${actualValue} (threshold: ${threshold || 'none'})`);
    
    const proofResult = await submitProofToChain({
      type: `${platform}_${metric}`,
      platform,
      metric,
      actualValue,
      threshold: threshold || 0,
      timestamp: Date.now(),
      userId: user.id,
    });

    if (!proofResult.success) {
      throw new Error('Failed to generate proof');
    }

    console.log('✅ Proof generated:', proofResult.proofHash);
    if (proofResult.verifiedOnChain) {
      console.log('🎉 Proof submitted to zkVerify chain!');
      console.log('📍 Transaction:', proofResult.txHash);
    }

    return NextResponse.json({
      success: true,
      proofHash: proofResult.proofHash,
      txHash: proofResult.txHash,
      blockHash: proofResult.blockHash,
      verifiedOnChain: proofResult.verifiedOnChain,
      explorerUrl: proofResult.explorerUrl,
      proofData: {
        metric,
        platform,
        actualValue,
        threshold: threshold || 0,
        generatedAt: proofResult.timestamp,
        blockNumber: proofResult.blockNumber,
        status: proofResult.status,
      },
    });
  } catch (error) {
    console.error('Error generating proof:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate proof' },
      { status: 500 }
    );
  }
}

