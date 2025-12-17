/**
 * zkVerify Chain Client - Server-side proof submission
 * Uses zkverifyjs to submit proofs to zkVerify testnet
 */

import { zkVerifySession } from 'zkverifyjs';
import { blake2AsHex } from '@polkadot/util-crypto';
import { stringToU8a } from '@polkadot/util';

let sessionInstance = null;
let isConnecting = false;

/**
 * Get or create zkVerify session
 * Note: This runs server-side only (uses seed phrase from env)
 */
async function getZkVerifySession() {
  if (sessionInstance) {
    return sessionInstance;
  }

  if (isConnecting) {
    // Wait for existing connection
    await new Promise(resolve => setTimeout(resolve, 100));
    return getZkVerifySession();
  }

  try {
    isConnecting = true;
    
    const seedPhrase = process.env.ZKVERIFY_SEED_PHRASE;
    
    if (!seedPhrase || seedPhrase === 'your_seed_phrase_here_with_12_or_24_words') {
      console.warn('⚠️ zkVerify: No seed phrase configured, using mock mode');
      isConnecting = false;
      return null;
    }

    console.log('🔗 Connecting to zkVerify Volta testnet...');
    
    // Connect to Volta testnet with account
    const session = await zkVerifySession
      .start()
      .Volta() // Use Volta testnet
      .withAccount(seedPhrase);
    
    console.log('✅ Connected to zkVerify testnet');
    
    // Get account info
    const account = await session.getAccount();
    console.log('📍 Account address:', account.address);
    
    sessionInstance = session;
    isConnecting = false;
    return session;
  } catch (error) {
    isConnecting = false;
    console.error('❌ Failed to connect to zkVerify:', error);
    return null;
  }
}

/**
 * Submit a proof to zkVerify chain
 * @param {Object} proofData - Proof data to submit
 * @returns {Promise<Object>} Submission result
 */
export async function submitProofToChain(proofData) {
  try {
    const session = await getZkVerifySession();
    
    // If no session (no seed phrase), fall back to local proof generation
    if (!session) {
      console.log('⚠️ zkVerify session not available, using local proof generation');
      return generateLocalProof(proofData);
    }

    console.log('🔐 Submitting proof to zkVerify chain...');
    
    // Create proof payload
    const proofPayload = {
      type: proofData.type,
      platform: proofData.platform,
      metric: proofData.metric,
      actualValue: proofData.actualValue,
      threshold: proofData.threshold || 0,
      timestamp: proofData.timestamp || Date.now(),
    };

    // Generate deterministic proof hash
    const proofHash = blake2AsHex(
      stringToU8a(JSON.stringify(proofPayload)), 
      256
    );

    // For MVP: Submit as attestation claim
    // Note: zkVerify supports different proof types (Groth16, Plonk, STARK)
    // For our use case, we're using the system.remark extrinsic to store our proof hash
    
    try {
      const account = await session.getAccount();
      
      // Submit proof hash to zkVerify chain using system.remark
      // This stores the proof hash on-chain in a simple way
      const tx = session.api.tx.system.remark(proofHash);
      
      // Sign and send transaction
      const result = await new Promise((resolve, reject) => {
        tx.signAndSend(account, ({ status, events, dispatchError }) => {
          if (dispatchError) {
            if (dispatchError.isModule) {
              const decoded = session.api.registry.findMetaError(dispatchError.asModule);
              reject(new Error(`${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`));
            } else {
              reject(new Error(dispatchError.toString()));
            }
            return;
          }
          
          if (status.isInBlock) {
            console.log(`✅ Proof included in block: ${status.asInBlock.toHex()}`);
            resolve({
              txHash: status.asInBlock.toHex(),
              proofHash,
              status: 'inBlock',
            });
          }
        });
      });

      console.log('🎉 Proof submitted to zkVerify!');
      console.log('📍 Transaction:', result.txHash);
      
      return {
        success: true,
        proofHash,
        txHash: result.txHash,
        blockHash: result.txHash,
        status: 'verified',
        verifiedOnChain: true,
        explorerUrl: `https://zkverify-testnet.subscan.io/extrinsic/${result.txHash}`,
        ...proofPayload,
      };
    } catch (chainError) {
      console.error('⚠️ Chain submission failed, using local proof:', chainError);
      // Fall back to local proof if chain submission fails
      return {
        ...generateLocalProof(proofData),
        chainError: chainError.message,
      };
    }
  } catch (error) {
    console.error('❌ Error submitting proof:', error);
    // Always fall back to local proof generation
    return generateLocalProof(proofData);
  }
}

/**
 * Generate local proof (fallback when chain is unavailable)
 */
function generateLocalProof(proofData) {
  const proofPayload = {
    type: proofData.type,
    platform: proofData.platform,
    metric: proofData.metric,
    actualValue: proofData.actualValue,
    threshold: proofData.threshold || 0,
    timestamp: proofData.timestamp || Date.now(),
  };

  const proofHash = blake2AsHex(
    stringToU8a(JSON.stringify(proofPayload)), 
    256
  );

  return {
    success: true,
    proofHash,
    status: 'local',
    verifiedOnChain: false,
    blockNumber: null,
    txHash: null,
    ...proofPayload,
  };
}

/**
 * Verify a proof on zkVerify chain
 */
export async function verifyProofOnChain(proofHash) {
  try {
    const session = await getZkVerifySession();
    
    if (!session) {
      return {
        isValid: false,
        error: 'zkVerify session not available',
      };
    }

    // Query the chain for the proof
    const claim = await session.api.query.attestation.claims(proofHash);
    
    if (claim.isSome) {
      const claimData = claim.unwrap();
      return {
        isValid: true,
        proofHash,
        onChain: true,
        blockNumber: claimData.blockNumber,
      };
    }

    return {
      isValid: false,
      error: 'Proof not found on chain',
    };
  } catch (error) {
    console.error('Error verifying proof on chain:', error);
    return {
      isValid: false,
      error: error.message,
    };
  }
}

/**
 * Disconnect from zkVerify
 */
export async function disconnectZkVerify() {
  if (sessionInstance) {
    try {
      await sessionInstance.close();
      sessionInstance = null;
      console.log('🔌 Disconnected from zkVerify');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }
}

