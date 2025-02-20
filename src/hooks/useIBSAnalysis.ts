// // src/hooks/useIBSAnalysis.tsx
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
      } catch (err: any) {
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


// import { useState, useEffect } from 'react';
// import { IBSAssessment } from '../types/ibs';

// // Define the structure of the processed FHIR data required for analysis.
// export interface ProcessedFHIRData {
//   patient: {
//     id: string;
//     gender?: string;
//     age?: number;
//   };
//   relevantConditions: Array<{
//     code: string;
//     display: string;
//     onset: string;
//     status: string;
//   }>;
//   // Include additional properties if needed for your analysis
// }

// // Custom hook to fetch IBS analysis from the backend.
// export function useIBSAnalysis(processedFHIRData: ProcessedFHIRData | null) {
//   const [analysis, setAnalysis] = useState<IBSAssessment | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchAnalysis() {
//       // Only proceed if valid FHIR data is provided.
//       if (!processedFHIRData) return;

//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL_ANALYSIS_EVIDENCE}`,
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(processedFHIRData)
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Error fetching IBS analysis: ${response.statusText}`);
//         }

//         const data: IBSAssessment = await response.json();
//         console.log({data}, "Data from AI")
//         setAnalysis(data);
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (err: any) {
//         console.error('IBS Analysis Error:', err);
//         setError('Failed to load IBS analysis.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAnalysis();
//   }, [processedFHIRData]);

//   return { analysis, loading, error };
// }
