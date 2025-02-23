// src/hooks/useClinicalImpressions.ts
import { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import {
    FHIRClinicalImpression,
    ParsedClinicalImpression,
} from '../types/FHIRClinicalImpression';

function parseClinicalImpression(resource: FHIRClinicalImpression): ParsedClinicalImpression {
    const findings: string[] = resource.finding?.map((f) => {
        const display = f.itemCodeableConcept?.coding?.[0]?.display ?? f.itemCodeableConcept?.text;
        if (display) {
            return display;
        }
        if (f.itemReference?.reference) {
            return f.itemReference.reference;
        }
        return f.basis ?? 'Unknown finding';
    }) || [];

    return {
        id: resource.id ?? 'unknown',
        status: resource.status ?? 'unknown',
        description: resource.description ?? 'No description provided',
        date: resource.date ?? 'N/A',
        effectiveDateTime: resource.effectiveDateTime ?? 'N/A',
        encounterRef: resource.encounter?.reference,
        assessorRef: resource.assessor?.reference,
        findings,
    };
}

/**
 * Hook to fetch all ClinicalImpression resources for a given patientId.
 */
export function useClinicalImpressions(accessToken: string, patientId: string, refreshKey: number) {
    const [impressions, setImpressions] = useState<ParsedClinicalImpression[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImpressions = async () => {
            if (!accessToken || !patientId) {
                setError('Missing required credentials or patientId');
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

                // Request a Bundle of ClinicalImpression resources
                const bundle = await client.request<fhirclient.FHIR.Bundle>(
                    `ClinicalImpression?patient=${patientId}&_count=500`
                );
                console.log("Fetched ClinicalImpressions (Raw FHIR Response):", bundle); // ✅ Debug raw API
                if (!bundle.entry || bundle.entry.length === 0) {
                    // No impressions found
                    setImpressions([]);
                    setError(null);
                } else {
                    // Parse each ClinicalImpression resource
                    const parsed = bundle.entry.map((entry) => {
                        const ci = entry.resource as FHIRClinicalImpression;
                        return parseClinicalImpression(ci);
                    });
                    setImpressions(parsed);
                    setError(null);
                }
            } catch (err) {
                console.error('Error fetching ClinicalImpression:', err);
                setError('Failed to load clinical impressions.');
                setImpressions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchImpressions();
    }, [accessToken, patientId, refreshKey]);
    console.log("State Updated: ClinicalImpressions:", impressions); // ✅ Debug state update

    return {
        impressions,
        loading,
        error,
        // Optional: manual refetch
        refetch: () => {
            setLoading(true);
            setError(null);
        },
    };
}
