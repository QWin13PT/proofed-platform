/**
 * Profile storage utilities
 * Uses Vercel KV (Redis) for storing user profiles and badges
 */

// Uncomment when Vercel KV is set up:
// import { kv } from '@vercel/kv';

/**
 * @typedef {Object} Profile
 * @property {string} username - Unique username
 * @property {string} displayName - Display name
 * @property {string} bio - User bio
 * @property {string} avatarUrl - Avatar image URL
 * @property {'creator'|'business'} userType - User type
 * @property {Array<Object>} badges - Array of earned badges
 * @property {Date} createdAt - Profile creation date
 * @property {Date} updatedAt - Last update date
 */

// In-memory storage for development (replace with Vercel KV in production)
const profiles = new Map();

/**
 * Create a new profile
 * @param {Object} profileData - Profile data
 * @returns {Promise<Profile>} Created profile
 */
export async function createProfile(profileData) {
  const { username, displayName, userType, bio = '', avatarUrl = '' } = profileData;
  
  if (!username) throw new Error('Username is required');
  if (profiles.has(username)) throw new Error('Username already exists');
  
  const profile = {
    username,
    displayName: displayName || username,
    bio,
    avatarUrl,
    userType,
    badges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  profiles.set(username, profile);
  
  // TODO: Replace with Vercel KV
  // await kv.set(`profile:${username}`, profile);
  
  return profile;
}

/**
 * Get a profile by username
 * @param {string} username - Username to look up
 * @returns {Promise<Profile|null>} Profile or null if not found
 */
export async function getProfile(username) {
  // TODO: Replace with Vercel KV
  // return await kv.get(`profile:${username}`);
  
  return profiles.get(username) || null;
}

/**
 * Update a profile
 * @param {string} username - Username
 * @param {Object} updates - Fields to update
 * @returns {Promise<Profile>} Updated profile
 */
export async function updateProfile(username, updates) {
  const profile = await getProfile(username);
  if (!profile) throw new Error('Profile not found');
  
  const updatedProfile = {
    ...profile,
    ...updates,
    username: profile.username, // Don't allow username changes
    updatedAt: new Date(),
  };
  
  profiles.set(username, updatedProfile);
  
  // TODO: Replace with Vercel KV
  // await kv.set(`profile:${username}`, updatedProfile);
  
  return updatedProfile;
}

/**
 * Add a badge to a profile
 * @param {string} username - Username
 * @param {Object} badge - Badge to add
 * @returns {Promise<Profile>} Updated profile
 */
export async function addBadge(username, badge) {
  const profile = await getProfile(username);
  if (!profile) throw new Error('Profile not found');
  
  const newBadge = {
    ...badge,
    earnedAt: new Date(),
  };
  
  profile.badges.push(newBadge);
  profile.updatedAt = new Date();
  
  profiles.set(username, profile);
  
  // TODO: Replace with Vercel KV
  // await kv.set(`profile:${username}`, profile);
  
  return profile;
}

/**
 * Get all profiles (for directory)
 * @param {Object} options - Filter options
 * @returns {Promise<Array<Profile>>} Array of profiles
 */
export async function getAllProfiles(options = {}) {
  const { userType, limit = 100, offset = 0 } = options;
  
  // TODO: Replace with Vercel KV scan/query
  let allProfiles = Array.from(profiles.values());
  
  // Filter by user type if specified
  if (userType) {
    allProfiles = allProfiles.filter(p => p.userType === userType);
  }
  
  // Sort by most badges
  allProfiles.sort((a, b) => b.badges.length - a.badges.length);
  
  // Paginate
  return allProfiles.slice(offset, offset + limit);
}

/**
 * Delete a profile
 * @param {string} username - Username to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteProfile(username) {
  // TODO: Replace with Vercel KV
  // await kv.del(`profile:${username}`);
  
  return profiles.delete(username);
}

