// src/types/FHIRObservation.ts
import { fhirclient } from 'fhirclient/lib/types';

export interface FHIRObservation extends fhirclient.FHIR.Resource {
  resourceType: 'Observation';
  code?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  valueQuantity?: {
    value?: number;
    unit?: string;
    system?: string;
    code?: string;
  };
  valueString?: string;
  // Typically the "effective" date/time
  effectiveDateTime?: string;
  // Add more fields here as needed (e.g., "component" for multi-observation)
}

// The shape of data your UI will consume
export interface FormattedObservation {
    id: string;
    code: string;              // e.g., "Heart rate"
    value: string;            // e.g., "72 beats/min"
    effectiveDateTime: string; // e.g., "2023-01-15T10:00:00Z"
  }
  