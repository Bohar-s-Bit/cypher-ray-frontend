import axiosInstance from "../lib/axios";
import { ENDPOINTS } from "../config/constants";

export const analysisService = {
  // Analyze binary file (user dashboard)
  analyzeFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
      ENDPOINTS.USER_ANALYZE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get job result by ID
  getJobResult: async (jobId) => {
    const response = await axiosInstance.get(
      ENDPOINTS.USER_JOB_RESULT.replace(":jobId", jobId)
    );
    return response.data;
  },

  // Get analysis history
  getAnalysisHistory: async ({ page = 1, limit = 20 } = {}) => {
    const response = await axiosInstance.get(
      `${ENDPOINTS.USER_ANALYSIS_HISTORY}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Create API key
  createApiKey: async (data) => {
    const response = await axiosInstance.post(
      ENDPOINTS.CREATE_USER_API_KEY,
      data
    );
    return response.data;
  },

  // Get user's API keys
  getUserApiKeys: async () => {
    const response = await axiosInstance.get(ENDPOINTS.USER_API_KEYS);
    return response.data;
  },

  // Revoke API key
  revokeApiKey: async (keyId) => {
    const response = await axiosInstance.delete(
      ENDPOINTS.REVOKE_USER_API_KEY.replace(":keyId", keyId)
    );
    return response.data;
  },
};
