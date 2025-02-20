// src/hooks/usePatient.ts
import { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

// Import the namespace type
type FHIRPatient = fhirclient.FHIR.Patient;

// Our app's Patient interface that matches the PatientCard props
export interface Patient {
  id: string;
  fullName: string;
  gender: string;
  birthDate: string;
  address?: string;
  contact?: string;
}

interface ContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: string;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: number;
  // ...Add any other fields you need
}

const parsePatientData = (data: FHIRPatient): Patient => {
  // Handle name
  const nameObj = data.name?.[0];
  const givenName = nameObj?.given?.join(' ') || '';
  const fullName = `${givenName} ${nameObj?.family || ''}`.trim() || 'Unknown';
  console.log({ data }, "PatientData")
  // Handle address
  const addressObj = data.address?.[0];
  const formattedAddress = addressObj
    ? [
      addressObj.line?.join(', '),
      addressObj.city,
      addressObj.state,
      addressObj.postalCode,
      addressObj.country,
    ]
      .filter(Boolean)
      .join(', ')
    : 'N/A';

  // // Handle contact (phone or email)
  // Then use ContactPoint locally:
  const contactInfo = data.telecom?.find(
    (t: ContactPoint) => t.system === 'phone' || t.system === 'email'
  );

  return {
    id: data.id || 'unknown',
    fullName,
    gender: data.gender || 'N/A',
    birthDate: data.birthDate || 'N/A',
    address: formattedAddress,
    contact: contactInfo?.value || 'N/A',
  };
};

export function usePatient(accessToken: string, patientId: string, refreshKey: number) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!accessToken || !patientId) {
        setError('Missing required credentials');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Create FHIR client instance
        const client = FHIR.client({
          serverUrl: `${import.meta.env.VITE_FHIR_BASE_URL}/${import.meta.env.VITE_FHIR_TENANT_ID}`,
          tokenResponse: {
            access_token: accessToken
          }
        });

        // Fetch patient data with proper typing
        const patientData = await client.request<FHIRPatient>(`Patient/${patientId}`);

        // Parse and set patient data
        const parsedPatient = parsePatientData(patientData);
        setPatient(parsedPatient);
        setError(null);

      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Failed to load patient data.');
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [accessToken, patientId, refreshKey]);

  return {
    patient,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
    }
  };
}

// Helper to create a reusable FHIR client
export const createFHIRClient = (accessToken: string) => {
  if (!accessToken) {
    throw new Error('Access token is required to create FHIR client');
  }

  return FHIR.client({
    serverUrl: `${import.meta.env.VITE_FHIR_BASE_URL}/${import.meta.env.VITE_FHIR_TENANT_ID}`,
    tokenResponse: {
      access_token: accessToken
    }
  });
};