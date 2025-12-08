import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { analysisService } from '../services/analysisService';

const AnalysisContext = createContext();

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider = ({ children }) => {
  const [currentJob, setCurrentJob] = useState(null); // Single job instead of Map
  const pollIntervalRef = useRef(null);
  const redirectCallbackRef = useRef(null);

  // Start monitoring a new job
  const startMonitoring = (jobId, initialStatus = 'queued', onComplete = null, fileSize = null) => {
    setCurrentJob({
      jobId,
      status: initialStatus,
      startTime: Date.now(),
      fileSize: fileSize,
      analysisStartTime: Date.now()
    });

    // Store the redirect callback
    redirectCallbackRef.current = onComplete;

    // Start polling if not already running
    if (!pollIntervalRef.current) {
      startPolling();
    }
  };

  // Stop monitoring the current job
  const stopMonitoring = () => {
    setCurrentJob(null);
    redirectCallbackRef.current = null;
  };

  // Start global polling mechanism
  const startPolling = () => {
    if (pollIntervalRef.current || !currentJob) return;

    const pollJobStatus = async () => {
      if (!currentJob) {
        stopPolling();
        return;
      }

      try {
        const result = await analysisService.getJobResult(currentJob.jobId);
        const status = result?.data?.job?.status;
        
        if (status) {
          // Update job status
          setCurrentJob(prev => prev ? { ...prev, status } : null);

          // If job is complete, stop monitoring and handle completion
          if (status !== 'queued' && status !== 'processing') {
            stopPolling();
            
            if (status === 'completed') {
              toast.success('Analysis completed!', { id: `complete-${currentJob.jobId}` });
            } else if (status === 'failed') {
              toast.error('Analysis failed!', { id: `failed-${currentJob.jobId}` });
            }

            // Execute redirect callback if provided
            if (redirectCallbackRef.current) {
              redirectCallbackRef.current(currentJob.jobId, status);
            }

            // Clear the current job
            stopMonitoring();
          }
        }
      } catch (error) {
        console.error(`Error polling job ${currentJob.jobId}:`, error);
        // Don't show toast for every polling error, just log it
      }
    };

    // Start polling immediately
    pollJobStatus();
    
    // Set up interval for continuous polling
    pollIntervalRef.current = setInterval(pollJobStatus, 3000); // Poll every 3 seconds
  };

  // Stop polling
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // Get status of the current job
  const getJobStatus = () => {
    return currentJob?.status || null;
  };

  // Check if there's an active job
  const hasActiveJobs = !!currentJob;

  // Get the current active job
  const getActiveJob = () => currentJob;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  // Auto-start polling when we have an active job
  useEffect(() => {
    if (currentJob && !pollIntervalRef.current) {
      startPolling();
    } else if (!currentJob && pollIntervalRef.current) {
      stopPolling();
    }
  }, [currentJob]);

  const value = {
    currentJob,
    startMonitoring,
    stopMonitoring,
    getJobStatus,
    hasActiveJobs,
    getActiveJob,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};