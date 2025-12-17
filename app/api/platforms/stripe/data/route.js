/**
 * Stripe Data API - Fetch account metrics
 * GET /api/platforms/stripe/data - Get Stripe revenue metrics
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

    // Get Stripe connection
    const { data: connection, error: connError } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', 'stripe')
      .maybeSingle();

    if (connError) {
      console.error('Error fetching Stripe connection:', connError);
      return NextResponse.json(
        { error: 'Failed to fetch connection' },
        { status: 500 }
      );
    }

    if (!connection) {
      return NextResponse.json(
        { error: 'Stripe not connected' },
        { status: 404 }
      );
    }

    // Calculate date range (last 30 days and all time)
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60);

    console.log('Stripe: Fetching account data');
    const headers = {
      Authorization: `Bearer ${connection.access_token}`,
      'Stripe-Account': connection.platform_user_id,
    };

    // Fetch balance transactions for revenue data
    const [monthlyTxns, allTimeTxns] = await Promise.all([
      fetch(
        `https://api.stripe.com/v1/balance_transactions?limit=100&created[gte]=${thirtyDaysAgo}`,
        { headers }
      ),
      fetch(
        `https://api.stripe.com/v1/balance_transactions?limit=100`,
        { headers }
      ),
    ]);

    if (!monthlyTxns.ok || !allTimeTxns.ok) {
      const error = await monthlyTxns.text();
      console.error('Stripe API error:', error);
      throw new Error('Failed to fetch Stripe data');
    }

    const monthlyData = await monthlyTxns.json();
    const allTimeData = await allTimeTxns.json();

    // Calculate metrics
    const monthlyRevenue = monthlyData.data
      .filter(txn => txn.type === 'charge')
      .reduce((sum, txn) => sum + txn.amount, 0) / 100; // Convert from cents

    const totalRevenue = allTimeData.data
      .filter(txn => txn.type === 'charge')
      .reduce((sum, txn) => sum + txn.amount, 0) / 100;

    const transactionCount = allTimeData.data.filter(txn => txn.type === 'charge').length;

    const avgTransaction = transactionCount > 0 
      ? totalRevenue / transactionCount 
      : 0;

    // Format metrics for display
    const metrics = {
      monthly_revenue: {
        id: 'monthly_revenue',
        name: 'Monthly Revenue (Last 30 Days)',
        value: monthlyRevenue,
        display: `$${formatMoney(monthlyRevenue)}`,
        icon: '💰',
        unit: 'USD',
      },
      total_revenue: {
        id: 'total_revenue',
        name: 'Total Revenue',
        value: totalRevenue,
        display: `$${formatMoney(totalRevenue)}`,
        icon: '💎',
        unit: 'USD',
      },
      transaction_count: {
        id: 'transaction_count',
        name: 'Total Transactions',
        value: transactionCount,
        display: formatNumber(transactionCount),
        icon: '🧾',
        unit: 'transactions',
      },
      avg_transaction: {
        id: 'avg_transaction',
        name: 'Average Transaction',
        value: avgTransaction,
        display: `$${formatMoney(avgTransaction)}`,
        icon: '📈',
        unit: 'USD',
      },
    };

    console.log('Stripe: Successfully fetched metrics');

    return NextResponse.json({
      platform: 'stripe',
      connected: true,
      account_id: connection.platform_user_id,
      metrics,
    });
  } catch (error) {
    console.error('Error fetching Stripe data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Stripe data' },
      { status: 500 }
    );
  }
}

/**
 * Format money with K/M suffixes
 */
function formatMoney(amount) {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K';
  }
  return amount.toFixed(2);
}

/**
 * Format numbers for display
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

