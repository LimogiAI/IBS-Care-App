// src/hooks/useIBSAnalysis.tsx
import { useState, useEffect } from 'react';
import { IBSAssessment } from '../types/ibs';

// Define the structure of the processed FHIR data required for analysis.
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
  // Include additional properties if needed for your analysis
}

// Custom hook to fetch IBS analysis from the backend.
export function useIBSAnalysis(processedFHIRData: ProcessedFHIRData | null) {
  const [analysis, setAnalysis] = useState<IBSAssessment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalysis() {
      // Only proceed if valid FHIR data is provided.
      if (!processedFHIRData) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL_ANALYSIS_EVIDENCE}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(processedFHIRData)
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching IBS analysis: ${response.statusText}`);
        }

        const data: IBSAssessment = await response.json();
        console.log({data}, "Data from AI")
        setAnalysis(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('IBS Analysis Error:', err);
        setError('Failed to load IBS analysis.');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [processedFHIRData]);

  return { analysis, loading, error };
}
