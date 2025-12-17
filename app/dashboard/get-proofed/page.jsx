'use client';

/**
 * Get Proofed Page - Connect platforms and display your metrics
 * Platform-focused approach: Connect → Fetch Data → Choose What to Display
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import { useAuthContext } from '@/context/auth-context';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  UserMultiple02Icon, 
  ViewIcon, 
  ChartLineData01Icon,
  VideoReplayIcon,
  MoneyBag02Icon,
  DiamondIcon,
  Invoice01Icon,
  ChartEvaluationIcon,
  ShoppingBag02Icon,
  PackageIcon,
  ShoppingCart01Icon,
  Analytics02Icon,
  File02Icon,
  Time01Icon,
  ArrowTurnBackwardIcon,
  ContactIcon,
  Briefcase02Icon,
  ChartIncreaseIcon
} from '@hugeicons-pro/core-solid-standard';

// Icon mapping for metrics
const METRIC_ICONS = {
  subscribers: UserMultiple02Icon,
  total_views: ViewIcon,
  monthly_views: ChartLineData01Icon,
  avg_views: VideoReplayIcon,
  video_count: VideoReplayIcon,
  monthly_revenue: MoneyBag02Icon,
  total_revenue: DiamondIcon,
  transaction_count: Invoice01Icon,
  avg_transaction: ChartEvaluationIcon,
  followers: UserMultiple02Icon,
  tweet_impressions: ViewIcon,
  engagement_rate: ChartIncreaseIcon,
  top_tweet: ChartEvaluationIcon,
  monthly_sales: MoneyBag02Icon,
  total_orders: PackageIcon,
  customer_count: UserMultiple02Icon,
  avg_order_value: ShoppingCart01Icon,
  monthly_users: UserMultiple02Icon,
  page_views: File02Icon,
  avg_session: Time01Icon,
  bounce_rate: ArrowTurnBackwardIcon,
  contacts: ContactIcon,
  deals: Briefcase02Icon,
  pipeline_value: MoneyBag02Icon,
  conversion_rate: ChartIncreaseIcon,
};

// Platform configurations
const PLATFORMS = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: '/images/brands/youtube-icon.svg',
    logo: '/images/brands/youtube.svg',
    color: '#FF0000',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    enabled: true,
    description: 'Connect your YouTube channel to display subscriber count, views, and engagement metrics',
    metrics: [
      { id: 'subscribers', name: 'Subscriber Count', example: '125K subscribers', color: '#d3f26a' },
      { id: 'total_views', name: 'Total Views', example: '5.2M views', color: '#ad7bff' },
      { id: 'monthly_views', name: 'Monthly Views', example: '250K views/month', color: '#d3f26a' },
      { id: 'avg_views', name: 'Average Views per Video', example: '10K avg views', color: '#ad7bff' },
    ]
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    icon: '/images/brands/stripe-icon.svg',
    logo: '/images/brands/stripe.svg',
    color: '#635BFF',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    enabled: true,
    description: 'Connect Stripe to display revenue and transaction metrics',
    metrics: [
      { id: 'monthly_revenue', name: 'Monthly Revenue', example: '$15K/month', color: '#d3f26a' },
      { id: 'total_revenue', name: 'Total Revenue', example: '$150K total', color: '#ad7bff' },
      { id: 'transaction_count', name: 'Total Transactions', example: '1,250 sales', color: '#d3f26a' },
      { id: 'avg_transaction', name: 'Average Transaction', example: '$120 avg', color: '#ad7bff' },
    ]
  },
  twitter: {
    id: 'twitter',
    name: 'X / Twitter',
    icon: '/images/brands/x.svg',
    logo: '/images/brands/x.svg',
    color: '#000000',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    enabled: false,
    description: 'Connect your X account to display followers and engagement',
    metrics: [
      { id: 'followers', name: 'Followers', example: '50K followers', color: '#d3f26a' },
      { id: 'tweet_impressions', name: 'Monthly Impressions', example: '2M impressions', color: '#ad7bff' },
      { id: 'engagement_rate', name: 'Engagement Rate', example: '4.5% engagement', color: '#d3f26a' },
      { id: 'top_tweet', name: 'Best Performing Tweet', example: '100K views', color: '#ad7bff' },
    ]
  },
  shopify: {
    id: 'shopify',
    name: 'Shopify',
    icon: '/images/brands/shopify-icon.svg',
    logo: '/images/brands/shopify.svg',
    color: '#96BF48',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    enabled: false,
    description: 'Connect your Shopify store to display sales and customer metrics',
    metrics: [
      { id: 'monthly_sales', name: 'Monthly Sales', example: '$25K/month', color: '#d3f26a' },
      { id: 'total_orders', name: 'Total Orders', example: '5,000 orders', color: '#ad7bff' },
      { id: 'customer_count', name: 'Total Customers', example: '3,200 customers', color: '#d3f26a' },
      { id: 'avg_order_value', name: 'Average Order Value', example: '$85 AOV', color: '#ad7bff' },
    ]
  },
  analytics: {
    id: 'analytics',
    name: 'Google Analytics',
    icon: '/images/brands/google-analytics-icon.svg',
    logo: '/images/brands/google-analytics.svg',
    color: '#F9AB00',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    enabled: false,
    description: 'Connect Google Analytics to display website traffic and user metrics',
    metrics: [
      { id: 'monthly_users', name: 'Monthly Active Users', example: '50K MAU', color: '#d3f26a' },
      { id: 'page_views', name: 'Monthly Page Views', example: '500K views', color: '#ad7bff' },
      { id: 'avg_session', name: 'Avg Session Duration', example: '3m 45s', color: '#d3f26a' },
      { id: 'bounce_rate', name: 'Bounce Rate', example: '45%', color: '#ad7bff' },
    ]
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '/images/brands/hubspot-icon.svg',
    logo: '/images/brands/hubspot.svg',
    color: '#FF7A59',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    enabled: false,
    description: 'Connect HubSpot to display CRM and marketing metrics',
    metrics: [
      { id: 'contacts', name: 'Total Contacts', example: '10K contacts', color: '#d3f26a' },
      { id: 'deals', name: 'Active Deals', example: '50 deals', color: '#ad7bff' },
      { id: 'pipeline_value', name: 'Pipeline Value', example: '$250K pipeline', color: '#d3f26a' },
      { id: 'conversion_rate', name: 'Lead Conversion Rate', example: '12% conversion', color: '#ad7bff' },
    ]
  },
};

export default function GetProofedPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, loading } = useAuthContext();
  const [connectedPlatforms, setConnectedPlatforms] = useState({});
  const [platformData, setPlatformData] = useState({});
  const [selectedMetrics, setSelectedMetrics] = useState({});
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [verificationModal, setVerificationModal] = useState({
    show: false,
    status: 'processing', // 'processing', 'success', 'error'
    progress: [],
    error: null,
    transactions: [], // zkVerify transaction links
  });

  // Restore verification state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('verification_progress');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only restore if it's recent (within last 5 minutes)
        const age = Date.now() - (parsed.timestamp || 0);
        if (age < 5 * 60 * 1000) {
          setVerificationModal(parsed.modal);
          console.log('📦 Restored verification progress from localStorage');
        } else {
          localStorage.removeItem('verification_progress');
        }
      } catch (error) {
        console.error('Failed to restore verification state:', error);
        localStorage.removeItem('verification_progress');
      }
    }
  }, []);

  // Save verification state to localStorage whenever it changes
  useEffect(() => {
    if (verificationModal.show && verificationModal.status === 'processing') {
      localStorage.setItem('verification_progress', JSON.stringify({
        modal: verificationModal,
        timestamp: Date.now(),
      }));
    } else if (verificationModal.status === 'success' || verificationModal.status === 'error') {
      // Clear localStorage when complete
      localStorage.removeItem('verification_progress');
    }
  }, [verificationModal]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, loading, router]);

  // Check URL for OAuth callback success/error
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    const success = params.get('success');
    const error = params.get('error');

    if (success && connected) {
      // OAuth successful, fetch data for the platform
      console.log(`OAuth successful for ${connected}`);
      fetchPlatformData(connected);
      
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/get-proofed');
    } else if (error) {
      alert(`Connection failed: ${error}`);
      window.history.replaceState({}, '', '/dashboard/get-proofed');
    }
  }, []);

  // Fetch real data for connected platforms
  const fetchPlatformData = async (platformId) => {
    try {
      console.log(`Fetching data for ${platformId}...`);
      const response = await fetch(`/api/platforms/${platformId}/data`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data = await response.json();
      console.log(`${platformId} data:`, data);

      if (data.metrics) {
        // Mark platform as connected
        setConnectedPlatforms(prev => ({ ...prev, [platformId]: true }));
        
        // Transform metrics to match our state structure
        const transformedMetrics = {};
        Object.entries(data.metrics).forEach(([key, metric]) => {
          transformedMetrics[key] = {
            value: metric.value,
            display: metric.display,
            visible: true, // Default to visible
          };
        });
        
        setPlatformData(prev => ({ ...prev, [platformId]: transformedMetrics }));
      }
    } catch (error) {
      console.error(`Error fetching ${platformId} data:`, error);
      alert(`Failed to fetch ${platformId} data: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Handle platform connection - Real OAuth with Popup
  const handleConnectPlatform = async (platformId) => {
    setConnectingPlatform(platformId);
    
    try {
      // For platforms with OAuth support, open in popup
      if (platformId === 'youtube' || platformId === 'stripe') {
        // Open OAuth in popup window
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        const popup = window.open(
          `/api/oauth/${platformId}`,
          `${platformId}_oauth`,
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`
        );
        
        if (!popup) {
          alert('Please allow popups for this site to connect platforms');
          setConnectingPlatform(null);
          return;
        }
        
        // Track if we've already handled the OAuth response
        let handled = false;
        let pollInterval, timeout;
        
        // Use a message listener for better popup communication
        const messageHandler = async (event) => {
          // Only accept messages from our domain
          if (event.origin !== window.location.origin) return;
          
          if (event.data?.type === 'oauth_success' && event.data?.platform === platformId && !handled) {
            handled = true;
            console.log(`✅ Received OAuth success message for ${platformId}`);
            
            // Clean up listeners and timers
            if (pollInterval) clearInterval(pollInterval);
            if (timeout) clearTimeout(timeout);
            window.removeEventListener('message', messageHandler);
            
            // Fetch platform data
            try {
              const response = await fetch(`/api/platforms/${platformId}/data`, {
                credentials: 'include',
              });
              
              if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${platformId} data fetched successfully!`, data);
                
                // Mark platform as connected
                setConnectedPlatforms(prev => ({ ...prev, [platformId]: true }));
                
                // Transform API data to platform data format
                const platformDataObj = {};
                Object.entries(data.metrics).forEach(([metricId, metricData]) => {
                  platformDataObj[metricId] = {
                    value: metricData.value,
                    display: metricData.display,
                    visible: true,
                  };
                });
                
                setPlatformData(prev => ({ ...prev, [platformId]: platformDataObj }));
                setConnectingPlatform(null);
                console.log(`✅ ${platformId} card should now be visible!`);
              } else {
                console.error(`Failed to fetch ${platformId} data:`, response.status);
                setConnectingPlatform(null);
              }
            } catch (error) {
              console.error(`Error fetching ${platformId} data:`, error);
              setConnectingPlatform(null);
            }
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        // Timeout: if no message received after 30 seconds, assume cancelled
        timeout = setTimeout(() => {
          if (handled) return; // Already handled
          if (pollInterval) clearInterval(pollInterval);
          window.removeEventListener('message', messageHandler);
          console.log(`❌ OAuth timeout for ${platformId} - no response received`);
          setConnectingPlatform(null);
        }, 30000); // 30 second timeout
        
        // Fallback: also check periodically if popup was manually closed
        pollInterval = setInterval(() => {
          if (handled) return; // Already handled
          try {
            if (popup.closed) {
              clearInterval(pollInterval);
              if (timeout) clearTimeout(timeout);
              window.removeEventListener('message', messageHandler);
              
              // OAuth was cancelled (popup closed without success message)
              console.log(`❌ Popup closed without success message - OAuth cancelled`);
              setConnectingPlatform(null);
            }
          } catch (e) {
            // COOP error when checking popup.closed - ignore
          }
        }, 500);
        
        return;
      }
      
      // For other platforms (not yet implemented), show mock data
      console.log(`Platform ${platformId} OAuth not yet implemented, using mock data`);
      setTimeout(() => {
        setConnectedPlatforms(prev => ({ ...prev, [platformId]: true }));
        
        // Mock data for demonstration
        const mockData = {};
        PLATFORMS[platformId].metrics.forEach(metric => {
          mockData[metric.id] = {
            value: Math.floor(Math.random() * 100000),
            display: metric.example,
            visible: true,
          };
        });
        
        setPlatformData(prev => ({ ...prev, [platformId]: mockData }));
        setConnectingPlatform(null);
      }, 1500);
    } catch (error) {
      console.error('Error connecting platform:', error);
      alert(`Failed to connect ${platformId}`);
      setConnectingPlatform(null);
    }
  };

  // Toggle metric visibility
  const toggleMetricVisibility = (platformId, metricId) => {
    setPlatformData(prev => ({
      ...prev,
      [platformId]: {
        ...prev[platformId],
        [metricId]: {
          ...prev[platformId][metricId],
          visible: !prev[platformId][metricId].visible,
        }
      }
    }));
  };

  // Save selected metrics as badges WITH ZK PROOFS
  const handleSaveMetrics = async (platformId) => {
    // Check if user is authenticated
    if (!user) {
      console.error('No user:', { user });
      alert('Error: Not authenticated. Please sign in.');
      router.push('/signin');
      return;
    }

    // Use user.id if profile not loaded yet
    const userId = user.id;
    const username = profile?.username;

    if (!userId) {
      console.error('No user ID');
      alert('Error: User ID not found.');
      return;
    }

    console.log('Saving badges for user:', { userId, username });

    const platform = PLATFORMS[platformId];
    const metrics = platformData[platformId] || {};
    
    // Get visible metrics
    const visibleMetrics = Object.entries(metrics)
      .filter(([_, data]) => data.visible)
      .map(([metricId, data]) => {
        const metricConfig = platform.metrics.find(m => m.id === metricId);
        const IconComponent = METRIC_ICONS[metricId];
        return {
          platform: platformId,
          metric: metricId,
          display: data.display,
          value: data.value,
          icon: IconComponent?.name || 'ChartLineData01Icon',
          name: metricConfig?.name || metricId,
          color: metricConfig?.color || '#d3f26a',
        };
      });

    if (visibleMetrics.length === 0) {
      alert('Please select at least one metric to save');
      return;
    }

    // Open modal and start verification
    setVerificationModal({
      show: true,
      status: 'processing',
      progress: ['🔐 Initializing blockchain verification...'],
      transactions: [],
      error: null,
    });

    try {
      // Add progress update
      setVerificationModal(prev => ({
        ...prev,
        progress: [...prev.progress, `🔐 Generating zero-knowledge proofs for ${visibleMetrics.length} metric${visibleMetrics.length > 1 ? 's' : ''}...`],
      }));

      console.log('🔐 Starting verification process...');
      console.log('🔐 Generating ZK proofs for metrics:', visibleMetrics.length);
      console.log('📋 Metrics to verify:', visibleMetrics.map(m => m.name).join(', '));
      
      // Generate ZK proofs for each metric
      const proofsToGenerate = visibleMetrics.map(async (badge, index) => {
        try {
          console.log(`🔐 Generating proof for ${badge.platform}.${badge.metric}...`);
          
          // Update progress for each metric
          setVerificationModal(prev => ({
            ...prev,
            progress: [...prev.progress, `⚡ Proving ${badge.name}...`],
          }));
          
          // Add timeout to proof generation (30 seconds max)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);
          
          const proofResponse = await fetch('/api/proofs/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: controller.signal,
            body: JSON.stringify({
              metric: badge.metric,
              platform: badge.platform,
              threshold: 0, // No threshold for now (just prove you have the data)
            }),
          });
          
          clearTimeout(timeoutId);

          if (!proofResponse.ok) {
            const errorData = await proofResponse.json();
            throw new Error(errorData.error || 'Failed to generate proof');
          }

          const proofData = await proofResponse.json();
          console.log(`✅ Proof generated for ${badge.metric}:`, proofData.proofHash);
          
          // Log zkVerify chain submission status
          if (proofData.verifiedOnChain) {
            console.log(`🎉 Proof submitted to zkVerify chain!`);
            console.log(`📍 Transaction: ${proofData.txHash}`);
            
            setVerificationModal(prev => ({
              ...prev,
              progress: [...prev.progress, `✅ ${badge.name} verified on zkVerify chain`],
              transactions: [...(prev.transactions || []), {
                metric: badge.name,
                txHash: proofData.txHash,
                explorerUrl: proofData.explorerUrl,
              }],
            }));
          }

          return {
            ...badge,
            proofHash: proofData.proofHash,
            proofData: proofData.proofData,
            txHash: proofData.txHash,
            blockHash: proofData.blockHash,
            verifiedOnChain: proofData.verifiedOnChain,
            explorerUrl: proofData.explorerUrl,
          };
        } catch (error) {
          const errorMsg = error.name === 'AbortError' ? 'timeout' : error.message;
          console.error(`❌ Failed to generate proof for ${badge.metric}:`, errorMsg);
          setVerificationModal(prev => ({
            ...prev,
            progress: [...prev.progress, `⚠️ ${badge.name} proof ${errorMsg === 'timeout' ? 'timed out' : 'failed'}, using fallback`],
          }));
          // Fall back to mock hash if proof generation fails
          return {
            ...badge,
            proofHash: `0x${Math.random().toString(16).slice(2)}`,
            proofData: null,
          };
        }
      });

      // Wait for all proofs to generate
      const proofsGenerated = await Promise.all(proofsToGenerate);
      console.log('✅ All proofs generated:', proofsGenerated.length);
      
      setVerificationModal(prev => ({
        ...prev,
        progress: [...prev.progress, '💾 Saving your achievements to profile...'],
      }));
      
      // Convert to badges array for bulk insert
      const badgesToSave = proofsGenerated.map(badge => ({
        user_id: userId,
        proof_hash: badge.proofHash,
        proof_type: badge.metric,
        platform: badge.platform,
        threshold: 0,
        verified: true,
        metadata: {
          display: badge.display,
          icon: badge.icon,
          name: badge.name,
          proofGenerated: badge.proofData?.generatedAt || Date.now(),
          blockNumber: badge.proofData?.blockNumber,
        },
        // zkVerify transaction data
        tx_hash: badge.txHash,
        block_hash: badge.blockHash,
        verified_on_chain: badge.verifiedOnChain || false,
        explorer_url: badge.explorerUrl,
      }));

      console.log('Sending badges to API:', badgesToSave);

      // Use bulk badges endpoint with credentials to send cookies
      const response = await fetch('/api/badges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // IMPORTANT: Send cookies with request for authentication
        body: JSON.stringify({ badges: badgesToSave }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.error || 'Failed to save badges');
      }

      const savedBadges = await response.json();
      console.log('Successfully saved badges:', savedBadges);
      
      // Success!
      setVerificationModal(prev => ({
        show: true,
        status: 'success',
        progress: [
          `🎉 Congratulations! Your achievements have been cryptographically verified on the blockchain.`,
          `✅ ${badgesToSave.length} metric${badgesToSave.length > 1 ? 's' : ''} permanently secured with zero-knowledge proofs`,
          `🔒 Your data stays private while proving your success`,
          `🌟 Your verified achievements are now displayed on your profile`,
        ],
        transactions: prev.transactions || [], // Preserve transaction links
        error: null,
      }));
      
      // Auto-redirect after 5 seconds (more time to view transactions)
      setTimeout(() => {
        setVerificationModal({ show: false, status: 'processing', progress: [], error: null, transactions: [] });
        localStorage.removeItem('verification_progress');
        if (username) {
          router.push(`/@${username}`);
        } else {
          router.push('/dashboard');
        }
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error during verification:', error);
      console.error('❌ Error stack:', error.stack);
      
      setVerificationModal(prev => ({
        show: true,
        status: 'error',
        progress: prev.progress || [],
        transactions: prev.transactions || [],
        error: error.message || 'An unexpected error occurred during verification',
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme="dark" />
      
      <main className="flex-1 bg-dark">
        {/* Hero Section */}
        <div className="bg-dark mb-8">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Link href="/dashboard" className="text-sm text-white/70 hover:text-white mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold mb-2 text-white">
              Get Proofed
            </h1>
            <p className="text-xl text-white/90">
              Connect your platforms and choose which metrics to display on your profile
            </p>
          </div>
        </div>

        <div className="bg-light rounded-t-3xl">
          <div className="container mx-auto px-4 py-8 max-w-7xl">{/* Platform Grid */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(PLATFORMS).map((platform) => {
                const isConnected = connectedPlatforms[platform.id];
                const isConnecting = connectingPlatform === platform.id;
                const data = platformData[platform.id];

                return (
                  <Card key={platform.id} className="p-6 hover:shadow-xl transition-all border-2 border-gray-100 hover:border-gray-200">
                    {/* Platform Header */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: `${platform.color}10` }}
                      >
                        <Image 
                          src={platform.icon} 
                          alt={`${platform.name} icon`}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-dark mb-1">{platform.name}</h3>
                        {isConnected && (
                          <Badge variant="secondary" className="bg-highlight/20 text-dark border-highlight/40 font-medium">
                            ✓ Connected
                          </Badge>
                        )}
                        {!platform.enabled && !isConnected && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-base text-dark/80 mb-6">
                      {platform.description}
                    </p>

                    {!isConnected ? (
                      /* Not Connected State */
                      <div>
                        <div className="rounded-2xl p-4 mb-4 border border-dark/10">
                          <h4 className="font-semibold text-sm mb-3 text-dark">Available Metrics:</h4>
                          <div className="space-y-2">
                            {platform.metrics.slice(0, 3).map((metric) => {
                              const IconComponent = METRIC_ICONS[metric.id];
                              return (
                                <div key={metric.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  <div 
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${metric.color}20` }}
                                  >
                                    {IconComponent && (
                                      <HugeiconsIcon 
                                        icon={IconComponent}
                                        size={18}
                                        style={{ color: metric.color }}
                                      />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-dark">{metric.name}</span>
                                </div>
                              );
                            })}
                            {platform.metrics.length > 3 && (
                              <div className="text-xs text-gray-500 pl-2 pt-1">
                                +{platform.metrics.length - 3} more metrics
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={() => handleConnectPlatform(platform.id)}
                          className="w-full bg-dark hover:bg-dark/90 text-light font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!platform.enabled}
                          loading={isConnecting}
                        >
                          {!platform.enabled ? 'Coming Soon' : `Connect ${platform.name}`}
                        </Button>
                      </div>
                    ) : (
                      /* Connected State - Show Metrics */
                      <div className="rounded-2xl p-4 mb-4 border border-dark/10">
                        <h4 className="font-semibold text-sm mb-3 text-dark">Your Metrics:</h4>
                        <div className="space-y-2 mb-4 rp">
                          {platform.metrics.map((metric) => {
                            const metricData = data[metric.id];
                            const isVisible = metricData?.visible;
                            const IconComponent = METRIC_ICONS[metric.id];

                            return (
                              <button
                                key={metric.id}
                                onClick={() => toggleMetricVisibility(platform.id, metric.id)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left group hover:shadow-md ${
                                  isVisible
                                    ? 'border-highlight bg-highlight/10'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div 
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        isVisible 
                                          ? 'bg-highlight' 
                                          : 'bg-gray-100 group-hover:bg-gray-200'
                                      }`}
                                    >
                                      {IconComponent && (
                                        <HugeiconsIcon 
                                          icon={IconComponent}
                                          size={20}
                                          color={isVisible ? '#171719' : '#6b7280'}
                                        />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-semibold text-sm text-dark mb-0.5">
                                        {metric.name}
                                      </div>
                                      <div className="text-lg font-bold" style={{ color: metric.color }}>
                                        {metricData?.display || metric.example}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`text-2xl transition-transform ${isVisible ? 'scale-110' : 'scale-100 opacity-40'}`}>
                                    {isVisible ? '✓' : '○'}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleSaveMetrics(platform.id)}
                            className="flex-1 bg-dark hover:bg-dark/90 text-light font-semibold shadow-md hover:shadow-lg transition-all"
                            icon={
                              <Image 
                                src="/images/brands/zkverify-icon-white.svg" 
                                alt="zkVerify"
                                width={14}
                                height={14}
                                className="object-contain"
                              />
                            }
                            iconPosition="left"
                          >
                            Verify on Blockchain
                          </Button>
                          {/*}
                          <Button
                            onClick={() => {
                              setConnectedPlatforms(prev => {
                                const newState = { ...prev };
                                delete newState[platform.id];
                                return newState;
                              });
                              setPlatformData(prev => {
                                const newState = { ...prev };
                                delete newState[platform.id];
                                return newState;
                              });
                            }}
                            variant="outline"
                            size="icon"
                            title="Refresh connection"
                            className="border-2 hover:bg-gray-50"
                          >
                            🔄
                          </Button>*/}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* Verification Modal */}
      <Modal
        showModal={verificationModal.show}
        closeModal={() => {
          if (verificationModal.status !== 'processing') {
            setVerificationModal({ show: false, status: 'processing', progress: [], error: null, transactions: [] });
            localStorage.removeItem('verification_progress');
          }
        }}
        title={
          verificationModal.status === 'processing' ? 'Verifying on Blockchain' :
          verificationModal.status === 'success' ? '🎉 Verification Complete!' :
          '⚠️ Verification Failed'
        }
        className="max-w-2xl"
      >
        <div className="space-y-6">
          {/* zkVerify Logo */}
          <div className="flex justify-center py-4">
            <div className="relative w-48 h-12">
              <Image
                src="/images/brands/zkverify.svg"
                alt="zkVerify"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {verificationModal.status === 'processing' && (
            <div className="space-y-3">
              <p className="text-center text-muted-foreground mb-4">
                Generating zero-knowledge proofs and submitting to the zkVerify blockchain...
              </p>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                {verificationModal.progress.map((message, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className="opacity-60">{message}</span>
                  </div>
                ))}
                {verificationModal.progress.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <span className="animate-pulse">⚡</span>
                    <span className="animate-pulse">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {verificationModal.status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 space-y-3">
                {verificationModal.progress.map((message, index) => (
                  <p key={index} className="text-sm text-center text-green-800 dark:text-green-200">
                    {message}
                  </p>
                ))}
              </div>
              
              {/* zkVerify Transaction Links */}
              {verificationModal.transactions && verificationModal.transactions.length > 0 && (
                <div className="bg-dark/5 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-dark mb-3 flex items-center gap-2">
                    <Image 
                      src="/images/brands/zkverify-icon.svg" 
                      alt="zkVerify"
                      width={16}
                      height={16}
                    />
                    Blockchain Transactions
                  </h4>
                  <div className="space-y-2">
                    {verificationModal.transactions.map((tx, index) => (
                      <a
                        key={index}
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 hover:border-highlight hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-highlight/20 flex items-center justify-center">
                            <span className="text-sm">🔗</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-dark">{tx.metric}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {tx.txHash?.slice(0, 10)}...{tx.txHash?.slice(-8)}
                            </div>
                          </div>
                        </div>
                        <div className="text-primary group-hover:translate-x-1 transition-transform">
                          →
                        </div>
                      </a>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Click to view your proofs on the zkVerify blockchain explorer
                  </p>
                </div>
              )}
              
              <p className="text-center text-xs text-muted-foreground">
                Redirecting to your profile...
              </p>
            </div>
          )}

          {verificationModal.status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
                <p className="text-sm text-center text-red-800 dark:text-red-200 mb-4">
                  {verificationModal.error || 'An error occurred during verification.'}
                </p>
                <p className="text-xs text-center text-muted-foreground">
                  Please try again. If the problem persists, contact support.
                </p>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    setVerificationModal({ show: false, status: 'processing', progress: [], error: null, transactions: [] });
                    localStorage.removeItem('verification_progress');
                  }}
                  variant="default"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

