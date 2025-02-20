// src/hooks/useObservations.ts
import { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { FHIRObservation } from '../types/FHIRObservation'; 
import { FormattedObservation } from '../types/FHIRObservation'; 

function parseObservation(resource: FHIRObservation): FormattedObservation {
  const displayName =
    resource.code?.coding?.[0]?.display ?? resource.code?.text ?? 'Unknown Observation';

  let observationValue = 'No value';
  if (resource.valueQuantity) {
    const val = resource.valueQuantity.value ?? '';
    const unit = resource.valueQuantity.unit ?? '';
    observationValue = `${val} ${unit}`.trim();
  } else if (resource.valueString) {
    observationValue = resource.valueString;
  }

  return {
    id: resource.id || 'unknown',
    code: displayName,
    value: observationValue,
    effectiveDateTime: resource.effectiveDateTime || 'Unknown DateTime',
  };
}

export function useObservations(accessToken: string, patientId: string, refreshKey: number) {
  const [observations, setObservations] = useState<FormattedObservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObservations = async () => {
      if (!accessToken || !patientId) {
        setError('Missing required credentials');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Build FHIR client
        const client = FHIR.client({
          serverUrl: `${import.meta.env.VITE_FHIR_BASE_URL}/${import.meta.env.VITE_FHIR_TENANT_ID}`,
          tokenResponse: {
            access_token: accessToken,
          },
        });

        // Request a Bundle of Observations for this patient
        const bundle = await client.request<fhirclient.FHIR.Bundle>(
          `Observation?patient=${patientId}`
        );

        console.log({bundle}, "Patient Observations")

        if (!bundle.entry || bundle.entry.length === 0) {
          // No Observations returned
          setObservations([]);
          setError(null);
        } else {
          // Parse each Observation resource
          const parsed = bundle.entry.map((entry) => {
            const obs = entry.resource as FHIRObservation;
            return parseObservation(obs);
          });

          setObservations(parsed);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching observations:', err);
        setError('Failed to load observations.');
        setObservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, [accessToken, patientId, refreshKey]);

  return {
    observations,
    loading,
    error,
    // Optional manual refetch
    refetch: () => {
      setLoading(true);
      setError(null);
    },
  };
}
