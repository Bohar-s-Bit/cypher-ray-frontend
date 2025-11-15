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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white">
          Developer API Documentation
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Integrate CypherRay into your applications with our REST API
        </p>
      </div>

      {/* --- GRID LAYOUT REMOVED --- */}
      {/* API Keys Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage and revoke API keys for programmatic access
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-neutral-600 dark:text-neutral-400">
                Loading...
              </p>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                No API keys yet. Create one to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key._id}
                  className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-neutral-900 dark:text-white">
                          {key.name}
                        </h4>
                        <Badge
                          variant={key.isActive ? "success" : "error"}
                          size="sm"
                        >
                          {key.isActive ? "Active" : "Revoked"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                          {key.keyPreview}
                        </code>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Created:{" "}
                        {format(new Date(key.createdAt), "MMM dd, yyyy")}
                        {key.expiresAt &&
                          ` • Expires: ${format(
                            new Date(key.expiresAt),
                            "MMM dd, yyyy"
                          )}`}
                      </p>
                    </div>
                    {key.isActive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRevokeKey(key._id)}
                        disabled={revokeKeyMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-error-600" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Getting Started Card */}
      <Card> {/* <-- Removed h-full */}
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              API Base URL
            </h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-lg text-sm truncate">
                {apiUrl}
              </code>
              <CopyButton text={apiUrl} label="API URL" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              Authentication
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-2">
              Include your API key in the request header:
            </p>
            <CodeBlock
              code="X-API-Key: YOUR_API_KEY"
              language="http"
              title="Header"
            />
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              Rate Limits
            </h3>
            <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>• Standard: 100 requests per minute</li>
              <li>• Burst: 20 requests per 10 seconds</li>
              <li>• Each analysis consumes 1 credit</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      {/* --- END OF CHANGED SECTION --- */}

      {/* Code Examples with language selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              <CardTitle>Code Examples</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-neutral-600 dark:text-neutral-400">Language</label>
              <select
                aria-label="Select code language"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm"
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
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-neutral-700 dark:text-neutral-300">
              Example: {codeLanguages.find(l => l.key === selectedLang)?.label}
            </div>
            <div>
              <CopyButton text={examples[selectedLang]} label="Copy code" />
            </div>
          </div>
          <CodeBlock
            code={examples[selectedLang]}
            language={selectedLang === 'curl' ? 'bash' : selectedLang}
          />
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            API Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary" size="sm">
                  POST
                </Badge>
                <code className="text-sm">/analyze</code>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Analyze a single binary file. Returns a job ID for polling
                results.
              </p>
            </div>

            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success" size="sm">
                  GET
                </Badge>
                <code className="text-sm">/results/:jobId</code>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Get analysis results for a specific job. Poll this endpoint
                until status is 'completed'.
              </p>
            </div>

            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success" size="sm">
                  GET
                </Badge>
                <code className="text-sm">/check-hash?hash=FILE_HASH</code>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Check if a file hash has been analyzed before
                (deduplication/caching).
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success" size="sm">
                  GET
                </Badge>
                <code className="text-sm">/credits</code>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Get current credit balance and usage information.
              </p>
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
              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
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