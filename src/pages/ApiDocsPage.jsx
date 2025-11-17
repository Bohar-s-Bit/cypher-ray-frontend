import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Key,
  Plus,
  Trash2,
  Code,
  Book,
  Terminal,
  Eye,
  EyeOff,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import CodeBlock from "../components/ui/CodeBlock";
import CopyButton from "../components/ui/CopyButton";
import Spinner from "../components/ui/Spinner";
import { analysisService } from "../services/analysisService";
import { QUERY_KEYS, API_BASE_URL } from "../config/constants";
import { format } from "date-fns";

const ApiDocsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyExpiry, setNewKeyExpiry] = useState(365);
  const [createdKey, setCreatedKey] = useState(null);
  const [showFullKey, setShowFullKey] = useState(false);
  const queryClient = useQueryClient();

  // Fetch API keys
  const { data: apiKeysData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.USER_API_KEYS],
    queryFn: analysisService.getUserApiKeys,
  });

  // Create API key mutation
  const createKeyMutation = useMutation({
    mutationFn: analysisService.createApiKey,
    onSuccess: (data) => {
      setCreatedKey(data.data.apiKey);
      setShowFullKey(true);
      queryClient.invalidateQueries([QUERY_KEYS.USER_API_KEYS]);
      toast.success("API key created successfully!");
      setNewKeyName("");
      setNewKeyExpiry(365);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create API key");
    },
  });

  // Revoke API key mutation
  const revokeKeyMutation = useMutation({
    mutationFn: analysisService.revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.USER_API_KEYS]);
      toast.success("API key revoked successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to revoke API key");
    },
  });

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    createKeyMutation.mutate({
      name: newKeyName,
      expiresInDays: newKeyExpiry > 0 ? newKeyExpiry : null,
    });
  };

  const handleRevokeKey = (keyId) => {
    if (
      confirm(
        "Are you sure you want to revoke this API key? This action cannot be undone."
      )
    ) {
      revokeKeyMutation.mutate(keyId);
    }
  };

  const apiKeys = apiKeysData?.data?.apiKeys || [];
  const apiUrl = `${API_BASE_URL}/sdk`;

  // Code examples
  const examples = {
    javascript: `// Install the SDK
npm install @cypherray/sdk

// Using the SDK
const CypherRay = require('@cypherray/sdk');

const analyzer = new CypherRay({
  apiKey: 'YOUR_API_KEY',
  apiUrl: '${apiUrl}',
});

// Analyze a binary file
const result = await analyzer.analyzeSingle('./firmware.bin');
console.log(result);`,

    python: `# Install dependencies
pip install requests

# Using the API
import requests

api_key = 'YOUR_API_KEY'
api_url = '${apiUrl}/analyze'

headers = {
    'X-API-Key': api_key
}

# Upload and analyze file
with open('firmware.bin', 'rb') as f:
    files = {'file': f}
    response = requests.post(api_url, headers=headers, files=files)
    job = response.json()

# Get results
job_id = job['data']['job']['jobId']
result = requests.get(f'${apiUrl}/results/{job_id}', headers=headers)
print(result.json())`,

    curl: `# Analyze a binary file
curl -X POST ${apiUrl}/analyze \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -F "file=@firmware.bin"

# Get analysis results
curl -X GET ${apiUrl}/results/JOB_ID \\
  -H "X-API-Key: YOUR_API_KEY"

# Check if hash already analyzed (cache)
curl -X GET "${apiUrl}/check-hash?hash=FILE_HASH" \\
  -H "X-API-Key: YOUR_API_KEY"`,
  };
  // Languages for selector
  const codeLanguages = [
    { key: "javascript", label: "JavaScript/Node.js (with SDK)" },
    { key: "python", label: "Python" },
    { key: "curl", label: "cURL" },
  ];

  const [selectedLang, setSelectedLang] = useState(codeLanguages[0].key);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-3">
            Developer API Documentation
          </h1>
          <p className="text-lg text-white/70 max-w-3xl leading-relaxed">
            Integrate CypherRay's powerful binary analysis capabilities into your applications with our comprehensive REST API
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Key className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Active API Keys</p>
                <p className="text-xl font-bold text-white">{apiKeys.filter(k => k.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Terminal className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">API Endpoints</p>
                <p className="text-xl font-bold text-white">4</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Code className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Languages Supported</p>
                <p className="text-xl font-bold text-white">3+</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Key className="w-6 h-6 text-purple-400" />
                </div>
                API Keys
              </CardTitle>
              <CardDescription className="mt-2">
                Securely manage your API keys for programmatic access to CypherRay services
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateModal(true)} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Create New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Spinner size="md" />
              <p className="text-white/70 mt-4">Loading API keys...</p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No API Keys Yet</h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Create your first API key to start integrating CypherRay into your applications
              </p>
              <Button onClick={() => setShowCreateModal(true)} variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Key
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {apiKeys.map((key) => (
                <div
                  key={key._id}
                  className="p-5 border border-purple-500/20 bg-gradient-to-r from-neutral-900/70 to-neutral-900/50 rounded-xl hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-white text-lg">
                          {key.name}
                        </h4>
                        <Badge
                          variant={key.isActive ? "success" : "error"}
                          size="sm"
                        >
                          {key.isActive ? "Active" : "Revoked"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <code className="text-sm bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg font-mono text-purple-300">
                          {key.keyPreview}
                        </code>
                        <CopyButton text={key.keyPreview} label="Key Preview" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          Created {format(new Date(key.createdAt), "MMM dd, yyyy")}
                        </span>
                        {key.expiresAt && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Expires {format(new Date(key.expiresAt), "MMM dd, yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                    {key.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeKey(key._id)}
                        disabled={revokeKeyMutation.isPending}
                        className="ml-4"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Getting Started Section */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Book className="w-6 h-6 text-blue-400" />
            </div>
            Getting Started
          </CardTitle>
          <CardDescription className="mt-2">
            Everything you need to begin using the CypherRay API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Base URL */}
          <div className="p-5 bg-gradient-to-r from-neutral-900/70 to-neutral-900/50 border border-purple-500/20 rounded-xl">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              API Base URL
            </h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-black/40 border border-white/10 px-4 py-3 rounded-lg text-sm font-mono text-green-400">
                {apiUrl}
              </code>
              <CopyButton text={apiUrl} label="API URL" />
            </div>
          </div>

          {/* Authentication */}
          <div className="p-5 bg-gradient-to-r from-neutral-900/70 to-neutral-900/50 border border-purple-500/20 rounded-xl">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-400" />
              Authentication
            </h3>
            <p className="text-white/80 text-sm mb-3">
              Include your API key in the request header for all API calls:
            </p>
            <CodeBlock
              code="X-API-Key: YOUR_API_KEY"
              language="http"
              title="Request Header"
            />
          </div>

          {/* Rate Limits */}
          <div className="p-5 bg-gradient-to-r from-neutral-900/70 to-neutral-900/50 border border-purple-500/20 rounded-xl">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Rate Limits & Credits
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/90">Request Limits</p>
                <ul className="text-sm space-y-1.5 text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    100 requests per minute
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    20 requests per 10 seconds (burst)
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/90">Credit Usage</p>
                <ul className="text-sm space-y-1.5 text-white/70">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    1 credit per analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    Cached results are free
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples Section */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-xl">
                  <Code className="w-6 h-6 text-green-400" />
                </div>
                Code Examples
              </CardTitle>
              <CardDescription className="mt-2">
                Quick start examples in multiple programming languages
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-white/70">Language:</label>
              <select
                aria-label="Select code language"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="px-4 py-2 bg-neutral-900/90 border border-purple-500/30 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {codeLanguages.map((lang) => (
                  <option key={lang.key} value={lang.key}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white/90">
                {codeLanguages.find(l => l.key === selectedLang)?.label}
              </p>
              <CopyButton text={examples[selectedLang]} label="Copy code" />
            </div>
            <CodeBlock
              code={examples[selectedLang]}
              language={selectedLang === 'curl' ? 'bash' : selectedLang}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints Section */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <Terminal className="w-6 h-6 text-orange-400" />
            </div>
            API Endpoints
          </CardTitle>
          <CardDescription className="mt-2">
            Complete reference for all available API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5">
            {/* POST /analyze */}
            <div className="p-5 bg-gradient-to-r from-neutral-900/70 to-neutral-900/50 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
              <div className="flex items-start gap-4 mb-3">
                <Badge variant="primary" className="mt-1">POST</Badge>
                <div className="flex-1">
                  <code className="text-base font-semibold text-purple-300">/analyze</code>
                  <p className="text-sm text-white/80 mt-2">
                    Upload and analyze a binary file. Returns a job ID that can be used to poll for results.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-white/70 mb-2">REQUEST PARAMETERS</p>
                <div className="text-sm text-white/70 space-y-1">
                  <p><code className="text-purple-300">file</code> - Binary file (multipart/form-data)</p>
                </div>
              </div>
            </div>

            {/* GET /results/:jobId */}
            <div className="p-5 bg-gradient-to-r from-neutral-900/70 to-neutral-900/50 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
              <div className="flex items-start gap-4 mb-3">
                <Badge variant="success" className="mt-1">GET</Badge>
                <div className="flex-1">
                  <code className="text-base font-semibold text-green-300">/results/:jobId</code>
                  <p className="text-sm text-white/80 mt-2">
                    Retrieve analysis results for a specific job. Poll this endpoint until the status is 'completed'.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-white/70 mb-2">PATH PARAMETERS</p>
                <div className="text-sm text-white/70 space-y-1">
                  <p><code className="text-green-300">jobId</code> - Unique job identifier</p>
                </div>
              </div>
            </div>

            {/* GET /check-hash */}
            <div className="p-5 bg-gradient-to-r from-neutral-900/70 to-neutral-900/50 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
              <div className="flex items-start gap-4 mb-3">
                <Badge variant="success" className="mt-1">GET</Badge>
                <div className="flex-1">
                  <code className="text-base font-semibold text-green-300">/check-hash</code>
                  <p className="text-sm text-white/80 mt-2">
                    Check if a file hash has already been analyzed (deduplication/caching). Returns cached results if available.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-white/70 mb-2">QUERY PARAMETERS</p>
                <div className="text-sm text-white/70 space-y-1">
                  <p><code className="text-green-300">hash</code> - SHA-256 hash of the file</p>
                </div>
              </div>
            </div>

            {/* GET /credits */}
            <div className="p-5 bg-gradient-to-r from-neutral-900/70 to-neutral-900/50 border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
              <div className="flex items-start gap-4 mb-3">
                <Badge variant="success" className="mt-1">GET</Badge>
                <div className="flex-1">
                  <code className="text-base font-semibold text-green-300">/credits</code>
                  <p className="text-sm text-white/80 mt-2">
                    Get your current credit balance and detailed usage information.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-semibold text-white/70 mb-2">RESPONSE</p>
                <div className="text-sm text-white/70 space-y-1">
                  <p>Returns remaining credits, total credits, and usage statistics</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create API Key Modal */}
      <Modal
        isOpen={showCreateModal || !!createdKey}
        onClose={() => {
          setShowCreateModal(false);
          setCreatedKey(null);
          setShowFullKey(false);
        }}
        title={createdKey ? "API Key Created" : "Create API Key"}
      >
        <div className="p-6">
          {createdKey ? (
            <div className="space-y-4">
              <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
                <p className="text-sm text-warning-800 dark:text-warning-200 font-medium">
                  ⚠️ Save this API key now! It won't be shown again.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  API Key
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={showFullKey ? createdKey.key : "••••••••••••••••"}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullKey(!showFullKey)}
                  >
                    {showFullKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <CopyButton text={createdKey.key} label="API Key" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreatedKey(null);
                    setShowFullKey(false);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label="Key Name"
                placeholder="My API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <Input
                label="Expires In (days)"
                type="number"
                placeholder="365"
                value={newKeyExpiry}
                onChange={(e) => setNewKeyExpiry(parseInt(e.target.value))}
                helperText="Set to 0 for no expiration"
              />
              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={createKeyMutation.isPending}
                >
                  {createKeyMutation.isPending ? "Creating..." : "Create Key"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ApiDocsPage;

