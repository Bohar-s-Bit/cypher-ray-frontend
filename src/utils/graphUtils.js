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

  // Create nodes from detected algorithms
  if (results.detected_algorithms && results.detected_algorithms.length > 0) {
    results.detected_algorithms.forEach((algo) => {
      const nodeId = `algo-${nodeIdCounter++}`;
      nodes.push({
        id: nodeId,
        label: algo.algorithm_name,
        type: "algorithm",
        ring: 1, // Primary ring for detected algorithms
        data: {
          description: algo.algorithm_class,
          confidence: `${Math.round(algo.confidence_score * 100)}%`,
          signature: algo.structural_signature || "N/A",
        },
      });
    });
  }

  // Create nodes from function analyses
  if (results.function_analyses && results.function_analyses.length > 0) {
    results.function_analyses.forEach((func, index) => {
      const nodeId = `func-${nodeIdCounter++}`;
      const isCrypto = func.is_crypto;
      
      nodes.push({
        id: nodeId,
        label: func.function_name,
        type: isCrypto ? "protocol" : "entity",
        ring: isCrypto ? 1 : 2,
        data: {
          description: func.function_summary,
          confidence: `${Math.round(func.confidence_score * 100)}%`,
          tags: func.semantic_tags?.join(", ") || "None",
        },
      });

      // Create edges between cryptographic functions and detected algorithms
      if (isCrypto && nodes.length > 1) {
        // Link to first algorithm node (simplified relationship)
        const algoNode = nodes.find((n) => n.type === "algorithm");
        if (algoNode) {
          edges.push({
            source: nodeId,
            target: algoNode.id,
            label: "implements",
            weight: func.confidence_score,
          });
        }
      }
    });
  }

  // Add vulnerability nodes if present
  if (
    results.vulnerability_assessment?.vulnerabilities &&
    results.vulnerability_assessment.vulnerabilities.length > 0
  ) {
    const vulnNodeId = `vuln-${nodeIdCounter++}`;
    nodes.push({
      id: vulnNodeId,
      label: "Security Issues",
      type: "storage", // Using storage type for different visual
      ring: 3, // Outer ring
      data: {
        description: `${results.vulnerability_assessment.vulnerabilities.length} vulnerabilities found`,
        severity: results.vulnerability_assessment.severity || "Unknown",
      },
    });

    // Link vulnerabilities to all algorithm nodes
    nodes
      .filter((n) => n.type === "algorithm")
      .forEach((algoNode) => {
        edges.push({
          source: algoNode.id,
          target: vulnNodeId,
          label: "has issue",
          weight: 0.5,
        });
      });
  }

  // If we have very few nodes, add a central "File" node
  if (nodes.length > 0 && nodes.length < 3) {
    const fileNodeId = "file-center";
    nodes.unshift({
      id: fileNodeId,
      label: analysisResult.filename || "Analyzed File",
      type: "key",
      ring: 0, // Center
      data: {
        description: "Source file",
        fileType: results.file_metadata?.file_type || "Unknown",
        size: results.file_metadata?.size_bytes
          ? `${(results.file_metadata.size_bytes / 1024).toFixed(2)} KB`
          : "N/A",
      },
    });

    // Connect all nodes to the center
    nodes.slice(1).forEach((node) => {
      edges.push({
        source: fileNodeId,
        target: node.id,
        label: "contains",
        weight: 1,
      });
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
