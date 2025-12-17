/**
 * Proof generation hook
 * Manages the process of generating zero-knowledge proofs
 */

import { useState, useCallback } from 'react';
import { zkVerifyClient } from '@/lib/zkverify/client';

/**
 * Proof generator hook
 * @returns {Object} Proof generation state and methods
 */
export function useProofGenerator() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [proof, setProof] = useState(null);

  /**
   * Generate a proof
   * @param {Object} proofData - Data to prove
   * @param {string} proofData.type - Proof type ID
   * @param {number} proofData.threshold - Threshold value
   * @param {number} proofData.actualValue - Actual value (private)
   * @param {string} proofData.platform - Platform name
   * @returns {Promise<Object>} Generated proof
   */
  const generateProof = useCallback(async (proofData) => {
    setGenerating(true);
    setProgress(0);
    setError(null);
    setProof(null);

    try {
      // Step 1: Validate data
      setProgress(10);
      if (!proofData.type || !proofData.threshold || !proofData.actualValue) {
        throw new Error('Missing required proof data');
      }

      // Check if actualValue meets threshold
      if (proofData.actualValue < proofData.threshold) {
        throw new Error(`Value ${proofData.actualValue} does not meet threshold ${proofData.threshold}`);
      }

      // Step 2: Prepare proof inputs
      setProgress(30);
      const proofInputs = {
        type: proofData.type,
        threshold: proofData.threshold,
        actualValue: proofData.actualValue, // This stays private
        timestamp: Date.now(),
      };

      // Step 3: Generate ZK proof
      setProgress(50);
      const proofHash = await zkVerifyClient.generateProof(proofInputs);

      // Step 4: Create proof metadata
      setProgress(80);
      const proofMetadata = {
        proofHash,
        type: proofData.type,
        threshold: proofData.threshold,
        platform: proofData.platform,
        timestamp: new Date().toISOString(),
        verified: true,
      };

      setProgress(100);
      setProof(proofMetadata);
      setGenerating(false);

      return proofMetadata;
    } catch (err) {
      console.error('Error generating proof:', err);
      setError(err.message || 'Failed to generate proof');
      setGenerating(false);
      throw err;
    }
  }, []);

  /**
   * Reset proof generation state
   */
  const reset = useCallback(() => {
    setGenerating(false);
    setProgress(0);
    setError(null);
    setProof(null);
  }, []);

  return {
    generating,
    progress,
    error,
    proof,
    generateProof,
    reset,
  };
}

