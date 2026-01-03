/**
 * Protocol Timeline Utilities
 * 
 * Helper functions to categorize cryptographic algorithms into protocol stages
 * and transform analysis results into timeline format.
 * 
 * Usage Example:
 * ```javascript
 * import { transformToProtocolTimeline, getProtocolStats } from './protocolUtils';
 * 
 * const timelines = transformToProtocolTimeline(analysisResult);
 * const stats = getProtocolStats(timelines);
 * ```
 * 
 * Algorithm Categorization:
 * - Handshake/Key Exchange: RSA, ECDH, Diffie-Hellman, etc.
 * - Authentication/Integrity: SHA, HMAC, BLAKE2, etc.
 * - Transport/Encryption: AES, ChaCha20, 3DES, etc.
 */

/**
 * Algorithm categorization mapping
 * Maps algorithm types/names to their typical role in cryptographic protocols
 */
const ALGORITHM_STAGE_MAPPING = {
  // Key Exchange / Handshake Stage
  handshake: {
    keywords: ['rsa', 'ecdh', 'diffie-hellman', 'dh', 'ecdhe', 'key-exchange', 'x25519', 'curve25519'],
    algorithms: ['RSA', 'ECDH', 'ECDHE', 'DHE', 'DH', 'Diffie-Hellman', 'X25519', 'Curve25519'],
    stage: 'Handshake/Key Exchange',
    order: 1,
    icon: '🤝',
    color: 'blue'
  },
  
  // Authentication / Integrity Stage
  authentication: {
    keywords: ['sha', 'hmac', 'hash', 'md5', 'blake', 'sign', 'verify', 'mac', 'digest'],
    algorithms: ['SHA-256', 'SHA-512', 'SHA-1', 'HMAC', 'HMAC-SHA256', 'MD5', 'BLAKE2', 'RSA-Sign', 'ECDSA'],
    stage: 'Authentication/Integrity',
    order: 2,
    icon: '🔐',
    color: 'green'
  },
  
  // Encryption / Transport Stage
  encryption: {
    keywords: ['aes', 'chacha', 'des', 'encrypt', 'cipher', 'gcm', 'cbc', 'ctr', 'stream', 'block'],
    algorithms: ['AES', 'AES-128', 'AES-256', 'ChaCha20', '3DES', 'DES', 'Blowfish', 'Twofish', 'Salsa20'],
    stage: 'Transport/Encryption',
    order: 3,
    icon: '🔒',
    color: 'purple'
  }
};

/**
 * Categorize a single algorithm into its protocol stage
 * @param {string} algorithmName - Name of the algorithm
 * @param {string} algorithmType - Type/class of the algorithm
 * @returns {Object} Stage information
 */
export const categorizeAlgorithm = (algorithmName, algorithmType = '') => {
  const name = algorithmName.toLowerCase();
  const type = algorithmType.toLowerCase();
  const combined = `${name} ${type}`;

  // Check handshake/key exchange
  if (
    ALGORITHM_STAGE_MAPPING.handshake.keywords.some(kw => combined.includes(kw)) ||
    ALGORITHM_STAGE_MAPPING.handshake.algorithms.some(algo => name.includes(algo.toLowerCase()))
  ) {
    return ALGORITHM_STAGE_MAPPING.handshake;
  }

  // Check authentication/integrity
  if (
    ALGORITHM_STAGE_MAPPING.authentication.keywords.some(kw => combined.includes(kw)) ||
    ALGORITHM_STAGE_MAPPING.authentication.algorithms.some(algo => name.includes(algo.toLowerCase()))
  ) {
    return ALGORITHM_STAGE_MAPPING.authentication;
  }

  // Check encryption/transport
  if (
    ALGORITHM_STAGE_MAPPING.encryption.keywords.some(kw => combined.includes(kw)) ||
    ALGORITHM_STAGE_MAPPING.encryption.algorithms.some(algo => name.includes(algo.toLowerCase()))
  ) {
    return ALGORITHM_STAGE_MAPPING.encryption;
  }

  // Default to encryption if contains 'encrypt' or 'cipher'
  if (combined.includes('encrypt') || combined.includes('cipher')) {
    return ALGORITHM_STAGE_MAPPING.encryption;
  }

  // Default to authentication for unknown
  return ALGORITHM_STAGE_MAPPING.authentication;
};

/**
 * Extract protocol name from detected_protocols or cipher suites
 * @param {Object} protocol - Protocol object from API
 * @returns {string} Protocol name
 */
const extractProtocolName = (protocol) => {
  if (typeof protocol === 'string') {
    return protocol;
  }
  
  if (protocol.name) return protocol.name;
  if (protocol.protocol_name) return protocol.protocol_name;
  if (protocol.cipher_suites && protocol.cipher_suites.length > 0) {
    return protocol.cipher_suites[0];
  }
  
  return 'Unknown Protocol';
};

/**
 * Transform analysis results into protocol timeline data
 * @param {Object} analysisResult - Full analysis result from API
 * @returns {Array} Array of protocol timelines
 */
export const transformToProtocolTimeline = (analysisResult) => {
  if (!analysisResult?.results) {
    return [];
  }

  const results = analysisResult.results;
  const protocolTimelines = [];

  // Get detected protocols
  const protocols = results.detected_protocols || [];
  const detectedAlgorithms = results.detected_algorithms || [];
  const functionAnalyses = results.function_analyses || [];

  // If no protocols detected, create a generic timeline
  if (protocols.length === 0 && detectedAlgorithms.length > 0) {
    const timeline = createGenericTimeline(detectedAlgorithms, functionAnalyses);
    if (timeline.algorithmSequence.length > 0) {
      protocolTimelines.push(timeline);
    }
    return protocolTimelines;
  }

  // Create timeline for each detected protocol
  protocols.forEach((protocol, index) => {
    const protocolName = extractProtocolName(protocol);
    const timeline = {
      protocolId: `protocol-${index}`,
      protocolName: protocolName,
      version: protocol.version || 'N/A',
      description: `Detected ${protocolName} protocol implementation`,
      algorithmSequence: [],
      handshakeInsights: {
        hasKeyExchange: false,
        hasAuthentication: false,
        hasEncryption: false,
        stages: []
      }
    };

    // Match algorithms to this protocol (same logic as graph)
    const matchedAlgorithms = [];
    const protocolLabel = protocolName.toLowerCase();
    const cipherSuites = (typeof protocol === 'object' && protocol.cipher_suites) 
      ? protocol.cipher_suites.join(' ').toLowerCase() 
      : '';
    
    detectedAlgorithms.forEach(algo => {
      const algoName = (algo.algorithm_name || algo.name || '').toLowerCase();
      const algoParts = algoName.split(/[^a-z0-9]/).filter(p => p.length >= 2);
      
      // Check if any algorithm part appears in protocol name or cipher suites
      const match = algoParts.some(part => 
        protocolLabel.includes(part) || cipherSuites.includes(part)
      );
      
      if (match) {
        matchedAlgorithms.push(algo);
      }
    });
    
    // If no matches found, skip this protocol
    if (matchedAlgorithms.length === 0) {
      return;
    }
    
    // Create sequential algorithm list with categorization
    matchedAlgorithms.forEach((algo, algoIndex) => {
      const stage = categorizeAlgorithm(
        algo.algorithm_name || algo.name,
        algo.algorithm_class || algo.type || ''
      );

      // Find related functions
      const relatedFunctions = functionAnalyses.filter(func => {
        const funcAlgo = (func.related_algorithm || '').toLowerCase();
        const algoName = (algo.algorithm_name || algo.name || '').toLowerCase();
        return funcAlgo.includes(algoName) || algoName.includes(funcAlgo);
      });

      timeline.algorithmSequence.push({
        sequenceId: algoIndex,
        name: algo.algorithm_name || algo.name,
        type: algo.algorithm_class || algo.type,
        category: stage.stage,
        categoryIcon: stage.icon,
        categoryColor: stage.color,
        confidence: algo.confidence_score || algo.confidence || 0,
        evidence: algo.evidence || [],
        functions: relatedFunctions.map(f => ({
          name: f.function_name,
          operations: f.crypto_operations || [],
          confidence: f.confidence_score || 0
        }))
      });
      
      // Track handshake insights
      if (stage.stage === 'Handshake/Key Exchange') {
        timeline.handshakeInsights.hasKeyExchange = true;
        if (!timeline.handshakeInsights.stages.includes('Key Exchange')) {
          timeline.handshakeInsights.stages.push('Key Exchange');
        }
      } else if (stage.stage === 'Authentication/Integrity') {
        timeline.handshakeInsights.hasAuthentication = true;
        if (!timeline.handshakeInsights.stages.includes('Authentication')) {
          timeline.handshakeInsights.stages.push('Authentication');
        }
      } else if (stage.stage === 'Transport/Encryption') {
        timeline.handshakeInsights.hasEncryption = true;
        if (!timeline.handshakeInsights.stages.includes('Encryption')) {
          timeline.handshakeInsights.stages.push('Encryption');
        }
      }
    });

    if (timeline.algorithmSequence.length > 0) {
      protocolTimelines.push(timeline);
    }
  });

  return protocolTimelines;
};

/**
 * Get algorithms related to a specific protocol
 * @param {Object} protocol - Protocol object
 * @param {Array} allAlgorithms - All detected algorithms
 * @returns {Array} Related algorithms
 */
const getRelatedAlgorithms = (protocol, allAlgorithms) => {
  // If protocol has cipher_suites, try to match algorithms
  if (protocol.cipher_suites && protocol.cipher_suites.length > 0) {
    const suites = protocol.cipher_suites.map(s => s.toLowerCase());
    
    return allAlgorithms.filter(algo => {
      const algoName = (algo.algorithm_name || algo.name || '').toLowerCase();
      return suites.some(suite => 
        suite.includes(algoName) || algoName.includes(suite)
      );
    });
  }

  // Otherwise return all algorithms (generic protocol)
  return allAlgorithms;
};

/**
 * Create a generic timeline when no specific protocol is detected
 * @param {Array} algorithms - Detected algorithms
 * @param {Array} functions - Function analyses
 * @returns {Object} Generic timeline
 */
const createGenericTimeline = (algorithms, functions) => {
  const timeline = {
    protocolId: 'generic-protocol',
    protocolName: 'Cryptographic Implementation',
    version: 'Detected',
    description: 'Detected cryptographic algorithms without specific protocol identification',
    algorithmSequence: []
  };

  algorithms.forEach((algo, algoIndex) => {
    const stage = categorizeAlgorithm(
      algo.algorithm_name || algo.name,
      algo.algorithm_class || algo.type || ''
    );

    // Find related functions
    const relatedFunctions = functions.filter(func => {
      const funcAlgo = (func.related_algorithm || '').toLowerCase();
      const algoName = (algo.algorithm_name || algo.name || '').toLowerCase();
      return funcAlgo.includes(algoName) || algoName.includes(funcAlgo);
    });

    timeline.algorithmSequence.push({
      sequenceId: algoIndex,
      name: algo.algorithm_name || algo.name,
      type: algo.algorithm_class || algo.type,
      category: stage.stage,
      categoryIcon: stage.icon,
      categoryColor: stage.color,
      confidence: algo.confidence_score || algo.confidence || 0,
      evidence: algo.evidence || [],
      functions: relatedFunctions.map(f => ({
        name: f.function_name,
        operations: f.crypto_operations || [],
        confidence: f.confidence_score || 0
      }))
    });
  });

  return timeline;
};

/**
 * Get statistics for protocol timelines
 * @param {Array} timelines - Protocol timelines
 * @returns {Object} Statistics
 */
export const getProtocolStats = (timelines) => {
  if (!timelines || timelines.length === 0) {
    return {
      totalProtocols: 0,
      totalAlgorithms: 0,
      totalFunctions: 0,
      categoryDistribution: {}
    };
  }

  let totalAlgorithms = 0;
  let totalFunctions = 0;
  const categoryDistribution = {};

  timelines.forEach(timeline => {
    timeline.algorithmSequence.forEach(algo => {
      totalAlgorithms++;
      totalFunctions += algo.functions.length;
      
      categoryDistribution[algo.category] = 
        (categoryDistribution[algo.category] || 0) + 1;
    });
  });

  return {
    totalProtocols: timelines.length,
    totalAlgorithms,
    totalFunctions,
    categoryDistribution
  };
};
