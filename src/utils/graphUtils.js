/**
 * Graph Data Utilities
 * 
 * Helper functions and sample data for the graph visualization component.
 * Use these to transform your API responses into graph-compatible format.
 */

/**
 * Generate sample cryptographic graph data
 * Use this for testing and demonstration purposes
 */
export const generateSampleGraphData = () => {
  const nodes = [
    // Ring 0 - Core (center)
    {
      id: "master-key",
      label: "Master Key",
      type: "key",
      ring: 0,
      data: {
        description: "Root encryption key",
        strength: "AES-256",
        created: "2024-01-15",
      },
    },

    // Ring 1 - Primary entities
    {
      id: "rsa-algo",
      label: "RSA Algorithm",
      type: "algorithm",
      ring: 1,
      data: {
        description: "Public key cryptography",
        keySize: "2048 bits",
        usage: "Key exchange",
      },
    },
    {
      id: "aes-algo",
      label: "AES Algorithm",
      type: "algorithm",
      ring: 1,
      data: {
        description: "Symmetric encryption",
        keySize: "256 bits",
        mode: "GCM",
      },
    },
    {
      id: "tls-protocol",
      label: "TLS 1.3",
      type: "protocol",
      ring: 1,
      data: {
        description: "Transport Layer Security",
        version: "1.3",
        cipherSuite: "TLS_AES_256_GCM_SHA384",
      },
    },

    // Ring 2 - Derived entities
    {
      id: "session-key-1",
      label: "Session Key A",
      type: "key",
      ring: 2,
      data: {
        description: "Temporary session key",
        lifetime: "1 hour",
        usage: "Data encryption",
      },
    },
    {
      id: "session-key-2",
      label: "Session Key B",
      type: "key",
      ring: 2,
      data: {
        description: "Temporary session key",
        lifetime: "1 hour",
        usage: "Data encryption",
      },
    },
    {
      id: "hmac-entity",
      label: "HMAC-SHA256",
      type: "algorithm",
      ring: 2,
      data: {
        description: "Message authentication",
        hashFunction: "SHA-256",
      },
    },
    {
      id: "db-storage",
      label: "Database Storage",
      type: "storage",
      ring: 2,
      data: {
        description: "Encrypted database",
        encryption: "Transparent Data Encryption",
      },
    },

    // Ring 3 - Edge entities
    {
      id: "backup-key",
      label: "Backup Key",
      type: "key",
      ring: 3,
      data: {
        description: "Key backup storage",
        location: "HSM",
      },
    },
    {
      id: "user-data",
      label: "User Data",
      type: "entity",
      ring: 3,
      data: {
        description: "Encrypted user information",
        recordCount: "10,000+",
      },
    },
    {
      id: "audit-log",
      label: "Audit Log",
      type: "entity",
      ring: 3,
      data: {
        description: "Cryptographic operations log",
        retention: "90 days",
      },
    },
  ];

  const edges = [
    // Master key relationships
    { source: "master-key", target: "rsa-algo", label: "uses", weight: 2 },
    { source: "master-key", target: "aes-algo", label: "uses", weight: 2 },
    { source: "master-key", target: "tls-protocol", label: "secures", weight: 1.5 },

    // Algorithm to key derivations
    { source: "rsa-algo", target: "session-key-1", label: "derives", weight: 1 },
    { source: "aes-algo", target: "session-key-2", label: "derives", weight: 1 },
    { source: "aes-algo", target: "hmac-entity", label: "works with", weight: 1 },

    // Protocol relationships
    { source: "tls-protocol", target: "session-key-1", label: "establishes", weight: 1 },
    { source: "tls-protocol", target: "session-key-2", label: "establishes", weight: 1 },

    // Storage and data flow
    { source: "session-key-1", target: "db-storage", label: "encrypts", weight: 1.5 },
    { source: "session-key-2", target: "db-storage", label: "encrypts", weight: 1.5 },
    { source: "db-storage", target: "user-data", label: "stores", weight: 1 },
    
    // Backup and audit
    { source: "master-key", target: "backup-key", label: "backed up as", weight: 1 },
    { source: "hmac-entity", target: "audit-log", label: "signs", weight: 1 },
    { source: "db-storage", target: "audit-log", label: "logs to", weight: 0.5 },
  ];

  return { nodes, edges };
};

/**
 * Transform analysis results from your API into graph format
 * 
 * @param {Object} analysisResult - The result from analysisService.getJobResult()
 * @returns {Object} { nodes, edges } - Graph data
 */
export const transformAnalysisToGraph = (analysisResult) => {
  const nodes = [];
  const edges = [];

  if (!analysisResult?.results) {
    return { nodes, edges };
  }

  const results = analysisResult.results;
  let nodeIdCounter = 0;

  // 1. Create Root Node (The Binary File)
  const rootNode = {
    id: "root-file",
    label: analysisResult.filename || "Analyzed File",
    type: "key",
    ring: 0,
    data: {
      description: "Binary File",
      fileType: results.file_metadata?.file_type || "Unknown",
      size: results.file_metadata?.size_bytes
        ? `${(results.file_metadata.size_bytes / 1024).toFixed(2)} KB`
        : "N/A",
    }
  };
  nodes.push(rootNode);

  // 2. Create Protocol Nodes (Children of Root)
  const protocolNodes = [];
  const protocols = results.detected_protocols || [];
  
  protocols.forEach((protocol, index) => {
    const nodeId = `proto-${index}`;
    let label = "Unknown Protocol";
    let description = "Network Protocol";
    let cipherSuites = [];

    if (typeof protocol === 'string') {
      label = protocol;
    } else {
      if (protocol.cipher_suites && protocol.cipher_suites.length > 0) {
        label = protocol.cipher_suites[0];
        description = `Protocol: ${protocol.name || protocol.protocol_name || "TLS"}`;
        cipherSuites = protocol.cipher_suites;
      } else {
        label = protocol.name || protocol.protocol_name || "Protocol";
        description = protocol.version ? `Version ${protocol.version}` : "Network Protocol";
      }
    }

    const protoNode = {
      id: nodeId,
      label: label,
      type: "protocol",
      ring: 1,
      data: {
        description: description,
        version: typeof protocol === 'object' ? protocol.version : "N/A",
        cipherSuites: cipherSuites.join(", ")
      }
    };
    nodes.push(protoNode);
    protocolNodes.push(protoNode);
    
    // Link to Root
    edges.push({
      source: rootNode.id,
      target: nodeId,
      label: "contains",
      weight: 2
    });
  });

  // 3. Create Algorithm Nodes (Children of Protocols or Root)
  const algorithmNodes = [];
  if (results.detected_algorithms && results.detected_algorithms.length > 0) {
    results.detected_algorithms.forEach((algo) => {
      const nodeId = `algo-${nodeIdCounter++}`;
      const algoNode = {
        id: nodeId,
        label: algo.algorithm_name,
        type: "algorithm",
        ring: 2,
        data: {
          description: algo.algorithm_class,
          confidence: `${Math.round(algo.confidence_score * 100)}%`,
          signature: algo.structural_signature || "N/A",
        },
      };
      nodes.push(algoNode);
      algorithmNodes.push(algoNode);

      // Link to Protocols
      let linkedToProto = false;
      if (protocolNodes.length > 0) {
        const algoName = algo.algorithm_name.toLowerCase();
        const algoParts = algoName.split(/[^a-z0-9]/).filter(p => p.length >= 2);

        protocolNodes.forEach(proto => {
          const protoLabel = proto.label.toLowerCase();
          const protoData = (proto.data.cipherSuites || "").toLowerCase();
          
          const match = algoParts.some(part => protoLabel.includes(part) || protoData.includes(part));
          
          if (match) {
            edges.push({
              source: proto.id,
              target: nodeId,
              label: "uses",
              weight: 1.5
            });
            linkedToProto = true;
          }
        });
      }

      // If not linked to any protocol, link to Root
      if (!linkedToProto) {
        edges.push({
          source: rootNode.id,
          target: nodeId,
          label: "detected in",
          weight: 1
        });
      }
    });
  }

  // 4. Create Function Nodes (Children of Algorithms)
  if (results.function_analyses && results.function_analyses.length > 0) {
    results.function_analyses.forEach((func) => {
      const nodeId = `func-${nodeIdCounter++}`;
      const isCrypto = func.is_crypto;
      
      const funcNode = {
        id: nodeId,
        label: func.function_name,
        type: isCrypto ? "entity" : "default",
        ring: 3,
        data: {
          description: func.function_summary,
          confidence: `${Math.round(func.confidence_score * 100)}%`,
          tags: func.semantic_tags?.join(", ") || "None",
        },
      };
      nodes.push(funcNode);

      // Link to matching Algorithm
      let linked = false;
      if (algorithmNodes.length > 0) {
        const tags = (func.semantic_tags || []).map(t => t.toLowerCase());
        const name = func.function_name.toLowerCase();
        
        let bestMatch = null;
        let maxScore = 0;

        algorithmNodes.forEach(algo => {
          const algoName = algo.label.toLowerCase();
          const algoParts = algoName.split(/[^a-z0-9]/).filter(p => p.length >= 2);
          
          let score = 0;
          if (name.includes(algoName)) score += 10;
          
          const matchingParts = algoParts.filter(part => name.includes(part));
          if (matchingParts.length > 0) score += matchingParts.length * 2;
          
          const matchingTags = tags.filter(t => t.includes(algoName) || algoParts.some(p => t.includes(p)));
          if (matchingTags.length > 0) score += matchingTags.length;

          if (score > maxScore) {
            maxScore = score;
            bestMatch = algo;
          }
        });

        if (bestMatch && maxScore > 0) {
          edges.push({
            source: bestMatch.id,
            target: nodeId,
            label: "implements",
            weight: 1
          });
          linked = true;
        }
      }

      // If not linked to any algorithm, link to Root
      if (!linked) {
        edges.push({
          source: rootNode.id,
          target: nodeId,
          label: isCrypto ? "defines" : "contains",
          weight: 0.5
        });
      }
    });
  }

  return { nodes, edges };
};

/**
 * Transform multiple analysis results into a comparison graph
 * Useful for comparing different files or versions
 * 
 * @param {Array} analysisResults - Array of analysis results
 * @returns {Object} { nodes, edges } - Graph data
 */
export const transformMultipleAnalysesToGraph = (analysisResults) => {
  const nodes = [];
  const edges = [];
  let nodeIdCounter = 0;

  analysisResults.forEach((result, resultIndex) => {
    if (!result?.results) return;

    const fileNodeId = `file-${resultIndex}`;
    nodes.push({
      id: fileNodeId,
      label: result.filename || `File ${resultIndex + 1}`,
      type: "key",
      ring: 0,
      data: {
        description: `Analysis ${resultIndex + 1}`,
        date: result.createdAt,
      },
    });

    // Add algorithms from this file
    result.results.detected_algorithms?.forEach((algo) => {
      const nodeId = `algo-${resultIndex}-${nodeIdCounter++}`;
      nodes.push({
        id: nodeId,
        label: algo.algorithm_name,
        type: "algorithm",
        ring: 1,
        data: {
          description: algo.algorithm_class,
          source: result.filename,
        },
      });

      edges.push({
        source: fileNodeId,
        target: nodeId,
        label: "contains",
        weight: 1,
      });
    });
  });

  return { nodes, edges };
};

/**
 * Filter graph data based on criteria
 * 
 * @param {Object} graphData - { nodes, edges }
 * @param {Object} filters - { types: [], minRing: 0, maxRing: 3 }
 * @returns {Object} Filtered graph data
 */
export const filterGraphData = (graphData, filters = {}) => {
  let { nodes, edges } = graphData;

  // Filter by node types
  if (filters.types && filters.types.length > 0) {
    nodes = nodes.filter((node) => filters.types.includes(node.type));
  }

  // Filter by ring level
  if (filters.minRing !== undefined) {
    nodes = nodes.filter((node) => (node.ring || 0) >= filters.minRing);
  }
  if (filters.maxRing !== undefined) {
    nodes = nodes.filter((node) => (node.ring || 0) <= filters.maxRing);
  }

  // Filter edges to only include those with valid nodes
  const nodeIds = new Set(nodes.map((n) => n.id));
  edges = edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );

  return { nodes, edges };
};

/**
 * Calculate graph statistics
 * 
 * @param {Object} graphData - { nodes, edges }
 * @returns {Object} Statistics object
 */
export const calculateGraphStats = (graphData) => {
  const { nodes, edges } = graphData;

  // Count node types
  const typeCounts = nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});

  // Calculate node degrees (number of connections)
  const degrees = nodes.map((node) => {
    const inDegree = edges.filter((e) => e.target === node.id).length;
    const outDegree = edges.filter((e) => e.source === node.id).length;
    return {
      nodeId: node.id,
      label: node.label,
      inDegree,
      outDegree,
      totalDegree: inDegree + outDegree,
    };
  });

  // Find most connected nodes
  const mostConnected = [...degrees].sort(
    (a, b) => b.totalDegree - a.totalDegree
  ).slice(0, 5);

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    typeCounts,
    degrees,
    mostConnected,
    density:
      nodes.length > 1
        ? edges.length / (nodes.length * (nodes.length - 1))
        : 0,
  };
};
