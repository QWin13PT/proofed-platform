/**
 * Zero-knowledge proof type definitions
 * Define schemas and thresholds for different proof types
 */

/**
 * @typedef {Object} ProofType
 * @property {string} id - Unique identifier
 * @property {string} name - Display name
 * @property {string} description - Description of what this proves
 * @property {string} category - 'creator' or 'business'
 * @property {string} platform - Platform name (e.g., 'youtube', 'stripe')
 * @property {Array<number>} thresholds - Available threshold values
 * @property {string} unit - Unit label (e.g., 'subscribers', 'USD/mo')
 */

/**
 * Creator proof types
 */
export const CREATOR_PROOF_TYPES = [
  {
    id: 'youtube_subscribers',
    name: 'YouTube Subscribers',
    description: 'Prove you have more than X subscribers without revealing the exact count',
    category: 'creator',
    platform: 'youtube',
    thresholds: [1000, 10000, 100000, 500000, 1000000],
    unit: 'subscribers',
    icon: '📺',
  },
  {
    id: 'youtube_views',
    name: 'YouTube Views',
    description: 'Prove monthly view count exceeds threshold',
    category: 'creator',
    platform: 'youtube',
    thresholds: [10000, 100000, 1000000, 10000000],
    unit: 'views/month',
    icon: '👀',
  },
  {
    id: 'stripe_monthly_earnings',
    name: 'Monthly Earnings',
    description: 'Prove monthly revenue exceeds threshold',
    category: 'creator',
    platform: 'stripe',
    thresholds: [1000, 5000, 10000, 25000, 50000, 100000],
    unit: 'USD/month',
    icon: '💰',
  },
  {
    id: 'stripe_total_earnings',
    name: 'Total Earnings',
    description: 'Prove total all-time revenue',
    category: 'creator',
    platform: 'stripe',
    thresholds: [10000, 50000, 100000, 500000, 1000000],
    unit: 'USD',
    icon: '💎',
  },
];

/**
 * Business proof types
 */
export const BUSINESS_PROOF_TYPES = [
  {
    id: 'ga_monthly_users',
    name: 'Monthly Active Users',
    description: 'Prove MAU exceeds threshold',
    category: 'business',
    platform: 'google_analytics',
    thresholds: [1000, 10000, 50000, 100000, 500000, 1000000],
    unit: 'MAU',
    icon: '👥',
  },
  {
    id: 'ga_page_views',
    name: 'Monthly Page Views',
    description: 'Prove monthly page views exceed threshold',
    category: 'business',
    platform: 'google_analytics',
    thresholds: [10000, 100000, 500000, 1000000, 5000000],
    unit: 'views/month',
    icon: '📊',
  },
  {
    id: 'hubspot_contacts',
    name: 'Total Contacts',
    description: 'Prove CRM contact count',
    category: 'business',
    platform: 'hubspot',
    thresholds: [1000, 5000, 10000, 50000, 100000],
    unit: 'contacts',
    icon: '📇',
  },
  {
    id: 'stripe_arr',
    name: 'Annual Recurring Revenue',
    description: 'Prove ARR exceeds threshold',
    category: 'business',
    platform: 'stripe',
    thresholds: [100000, 500000, 1000000, 5000000, 10000000],
    unit: 'ARR',
    icon: '📈',
  },
];

/**
 * Get all proof types
 * @returns {Array<ProofType>} All proof types
 */
export function getAllProofTypes() {
  return [...CREATOR_PROOF_TYPES, ...BUSINESS_PROOF_TYPES];
}

/**
 * Get proof types by category
 * @param {'creator'|'business'} category - Category to filter by
 * @returns {Array<ProofType>} Filtered proof types
 */
export function getProofTypesByCategory(category) {
  return getAllProofTypes().filter(type => type.category === category);
}

/**
 * Get a specific proof type by ID
 * @param {string} id - Proof type ID
 * @returns {ProofType|undefined} Proof type or undefined
 */
export function getProofTypeById(id) {
  return getAllProofTypes().find(type => type.id === id);
}

