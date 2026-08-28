import { useEffect, useRef, useState, useCallback } from 'react';
import { getAnalysis, getApiErrorMessage, getErrorMessage } from '@/lib/api';
import type { ContractAnalysis } from '@/types';
import { isAnalysisCompleted, isAnalysisFailed, isAnalysisInProgress } from '@/lib/labels';

interface UseAnalysisPollingOptions {
  analysisId: string | null;
  enabled?: boolean;
  interval?: number;
  /** Seguir sondeando automáticamente mientras el análisis esté en cola o procesando */
  autoPoll?: boolean;
  onComplete?: (analysis: ContractAnalysis) => void;
  onFailed?: (analysis: ContractAnalysis) => void;
  onProgress?: (analysis: ContractAnalysis) => void;
}

interface UseAnalysisPollingReturn {
  analysis: ContractAnalysis | null;
  loading: boolean;
  error: string | null;
  isPolling: boolean;
  stopPolling: () => void;
  startPolling: () => void;
}

export function useAnalysisPolling({
  analysisId,
  enabled = true,
  interval = 5000,
  autoPoll = false,
  onComplete,
  onFailed,
  onProgress,
}: UseAnalysisPollingOptions): UseAnalysisPollingReturn {
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialFetchDoneRef = useRef(false);
  const hasLoadedRef = useRef(false);
  
  // Use refs to store callbacks to avoid recreating fetchAnalysis
  const onCompleteRef = useRef(onComplete);
  const onFailedRef = useRef(onFailed);
  const onProgressRef = useRef(onProgress);
  
  // Update refs when callbacks change
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onFailedRef.current = onFailed;
    onProgressRef.current = onProgress;
  }, [onComplete, onFailed, onProgress]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(() => {
    if (!analysisId) return;
    setIsPolling(true);
  }, [analysisId]);

  const fetchAnalysis = useCallback(async () => {
    if (!analysisId) return;

    try {
      // Solo la primera carga muestra el estado "loading"; los sondeos son silenciosos
      if (!hasLoadedRef.current) setLoading(true);
      setError(null);
      
      const res = await getAnalysis(analysisId);
      
      if (res.success && res.data) {
        hasLoadedRef.current = true;
        setAnalysis(res.data);

        // Check if analysis is completed
        if (isAnalysisCompleted(res.data.analysis_state)) {
          stopPolling();
          onCompleteRef.current?.(res.data);
        } 
        // Check if analysis failed
        else if (isAnalysisFailed(res.data.analysis_state)) {
          stopPolling();
          onFailedRef.current?.(res.data);
        }
        // Analysis is in progress
        else if (isAnalysisInProgress(res.data.analysis_state)) {
          if (autoPoll) setIsPolling(true);
          onProgressRef.current?.(res.data);
        }
      } else {
        setError(getErrorMessage(res, 'Error al cargar análisis'));
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Error al conectar con el servidor'));
      // Don't stop polling on temporary network errors
    } finally {
      setLoading(false);
    }
  }, [analysisId, autoPoll, stopPolling]);

  // Initial fetch - solo una vez cuando analysisId o enabled cambian
  useEffect(() => {
    if (analysisId && enabled && !initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true;
      fetchAnalysis();
    }
    
    // Reset cuando cambia analysisId
    if (!analysisId) {
      initialFetchDoneRef.current = false;
    }
  }, [analysisId, enabled, fetchAnalysis]);

  // Polling effect
  useEffect(() => {
    if (!analysisId || !enabled || !isPolling) {
      return;
    }

    // Start polling
    intervalRef.current = setInterval(() => {
      fetchAnalysis();
    }, interval);

    // Cleanup
    return () => {
      stopPolling();
    };
  }, [analysisId, enabled, isPolling, interval, fetchAnalysis, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    analysis,
    loading,
    error,
    isPolling,
    stopPolling,
    startPolling,
  };
}
