/**
 * Application configuration
 * Centralizes all environment variables and app settings
 */

export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // OAuth Configuration
  oauth: {
    youtube: {
      clientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
      redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback',
    },
    stripe: {
      clientId: process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID,
      scopes: ['read_only'],
      redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback',
    },
    googleAnalytics: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback',
    },
    hubspot: {
      clientId: process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID,
      scopes: ['contacts', 'analytics.read'],
      redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback',
    },
  },

  // zkVerify Configuration
  zkVerify: {
    endpoint: process.env.NEXT_PUBLIC_ZKVERIFY_ENDPOINT || 'wss://testnet-rpc.zkverify.io',
    network: process.env.NEXT_PUBLIC_ZKVERIFY_NETWORK || 'testnet',
    explorer: 'https://zkverify-testnet.subscan.io',
  },

  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: 'Proofed',
    tagline: 'Get Proofed or stay mid',
    description: 'Zero-knowledge platform for verifiable creator and business metrics',
  },

  // Feature Flags
  features: {
    creatorProofs: true,
    businessProofs: true,
    profilePages: true,
    directoryPage: true,
    embedBadges: true,
  },
};

