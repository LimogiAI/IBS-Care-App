// src/hooks/useDiagnosticReports.ts
import { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { FHIRDiagnosticReport, ParsedDiagnosticReport } from '../types/FHIRDiagnosticReport';
import parseDiagnosticReport from '../utils/parseDiagnosticReport';

/**
 * Hook to fetch all DiagnosticReport resources for the given patientId.
 */
export function useDiagnosticReports(accessToken: string, patientId: string) {
  const [reports, setReports] = useState<ParsedDiagnosticReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (!accessToken || !patientId) {
        setError('Missing required credentials or patientId');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Create FHIR client
        const client = FHIR.client({
          serverUrl: `${import.meta.env.VITE_FHIR_BASE_URL}/${import.meta.env.VITE_FHIR_TENANT_ID}`,
          tokenResponse: {
            access_token: accessToken,
          },
        });

        // Request the bundle of DiagnosticReports for this patient
        // Example: "DiagnosticReport?patient=123"
        const bundle = await client.request<fhirclient.FHIR.Bundle>(
          `DiagnosticReport?patient=${patientId}&_count=500`
        );

        if (!bundle.entry || bundle.entry.length === 0) {
          // No reports found
          setReports([]);
          setError(null);
        } else {
          // Parse each report
          const parsed = bundle.entry.map((entry) => {
            const resource = entry.resource as FHIRDiagnosticReport;
            return parseDiagnosticReport(resource);
          });
          setReports(parsed);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching diagnostic reports:', err);
        setError('Failed to load diagnostic reports.');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [accessToken, patientId]);

  return {
    reports,
    loading,
    error,
    // Optional manual refetch
    refetch: () => {
      setLoading(true);
      setError(null);
    },
  };
}
