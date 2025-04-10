// src/hooks/useIBSAnalysis.tsx
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { IBSAssessment, ProcessedFHIRData } from '../types/ibs';

export function useIBSAnalysis(processedFHIRData: ProcessedFHIRData | null) {
  const [analysis, setAnalysis] = useState<IBSAssessment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced fetch function
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
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    }, 500), // Debounce for 500ms
    []
  );

  useEffect(() => {
    // Only fetch if processedFHIRData is fully populated with at least patient ID
    if (!processedFHIRData || !processedFHIRData.patient.id) {
      setAnalysis(null);
      setLoading(false);
      return;
    }

    fetchAnalysis(processedFHIRData);
  }, [processedFHIRData, fetchAnalysis]);

  return { analysis, loading, error };
}