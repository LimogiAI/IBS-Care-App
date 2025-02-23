// src/hooks/useConditions.ts
import { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { FHIRCondition } from '../types/FHIRCondition';


/**
 * The shape of data that your UI will actually consume (after parsing).
 */
export interface FormattedCondition {
  id: string;
  code: string;
  recordedDate: string;
  clinicalStatus: string;
  verificationStatus: string;
}

/**
 * This helper takes a raw FHIR Condition resource and converts it
 * into the FormattedCondition you want to display in your UI.
 */
function parseCondition(resource: FHIRCondition): FormattedCondition {
  return {
    id: resource.id || 'unknown',
    code: resource.code?.coding?.[0]?.display || 'Unknown Condition',
    recordedDate: resource.recordedDate || 'Unknown Date',
    clinicalStatus: resource.clinicalStatus?.coding?.[0]?.code || 'Unknown Status',
    verificationStatus:
      resource.verificationStatus?.coding?.[0]?.code || 'Not Verified',
  };
}

/**
 * React hook for fetching all Conditions for a given patient.
 */
export function useConditions(accessToken: string, patientId: string, refreshKey: number) {
  const [conditions, setConditions] = useState<FormattedCondition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConditions = async () => {
      if (!accessToken || !patientId) {
        setError('Missing required credentials');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Create a new FHIR client instance
        const client = FHIR.client({
          serverUrl: `${import.meta.env.VITE_FHIR_BASE_URL}/${import.meta.env.VITE_FHIR_TENANT_ID}`,
          tokenResponse: {
            access_token: accessToken,
          },
        });

        // Search for Condition resources for this patient
        // Type argument: we expect a Bundle of Condition entries
        const bundle = await client.request<fhirclient.FHIR.Bundle>(
          `Condition?patient=${patientId}&_count=100`
        );
        console.log({ bundle }, "Patient Conditions")
        if (!bundle.entry || !bundle.entry.length) {
          // No entries found - possibly no conditions exist
          setConditions([]);
          setError(null);
        } else {
          // Convert each Bundle entry into a FormattedCondition
          const parsed = bundle.entry.map((entry) => {
            // entry.resource can be any Resource,
            // so cast it to FHIRCondition to access Condition fields
            const condition = entry.resource as FHIRCondition;
            return parseCondition(condition);
          });

          setConditions(parsed);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching conditions:', err);
        setError('Failed to load conditions.');
        setConditions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
  }, [accessToken, patientId, refreshKey]);

  return {
    conditions,
    loading,
    error,
    // Optional: similar to `usePatient` – triggers a manual refetch
    refetch: () => {
      setLoading(true);
      setError(null);
    },
  };
}
