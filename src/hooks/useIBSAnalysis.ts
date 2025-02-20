// src/hooks/useIBSAnalysis.tsx
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { IBSAssessment } from '../types/ibs';

export interface ProcessedFHIRData {
  patient: {
    id: string;
    gender?: string;
    age?: number;
  };
  relevantConditions: Array<{
    code: string;
    display: string;
    onset: string;
    status: string;
  }>;
  relevantObservations: Array<{
    id: string;
    code: string;
    value: string;
    effectiveDateTime: string;
  }>;
}

export function useIBSAnalysis(processedFHIRData: ProcessedFHIRData | null) {
  const [analysis, setAnalysis] = useState<IBSAssessment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced fetch function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAnalysis = useCallback(
    debounce(async (fhirData: ProcessedFHIRData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_ANALYSIS_EVIDENCE}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fhirData),
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching IBS analysis: ${response.statusText}`);
        }

        const data: IBSAssessment = await response.json();
        console.log({ data }, 'Data from AI');
        setAnalysis(data);
      } catch (err: unknown) {
        console.error('IBS Analysis Error:', err);
        setError('Failed to load IBS analysis.');
      } finally {
        setLoading(false);
      }
    }, 500), // Debounce for 500ms
    []
  );

  useEffect(() => {
    // Only fetch if processedFHIRData is fully populated
    if (
      !processedFHIRData ||
      !processedFHIRData.patient.id ||
      !processedFHIRData.relevantConditions ||
      !processedFHIRData.relevantObservations
    ) {
      return;
    }

    fetchAnalysis(processedFHIRData);
  }, [processedFHIRData, fetchAnalysis]);

  return { analysis, loading, error };
}


