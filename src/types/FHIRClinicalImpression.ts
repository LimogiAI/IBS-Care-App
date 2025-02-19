// src/types/FHIRClinicalImpression.ts
import { fhirclient } from 'fhirclient/lib/types';

export interface FHIRClinicalImpression extends fhirclient.FHIR.Resource {
  resourceType: 'ClinicalImpression';
  status?: string; // e.g. "in-progress", "completed", "entered-in-error"
  description?: string;
  subject?: {
    reference?: string;  // e.g. "Patient/123"
  };
  encounter?: {
    reference?: string;  // e.g. "Encounter/456"
  };
  effectiveDateTime?: string;
  date?: string; // Typically a single point in time when the impression was created
  assessor?: {
    reference?: string;  // e.g. "Practitioner/789"
  };
  finding?: Array<{
    itemCodeableConcept?: {
      coding?: Array<{
        system?: string;
        code?: string;
        display?: string;
      }>;
      text?: string;
    };
    itemReference?: {
      reference?: string; // e.g. "Condition/abc"
    };
    basis?: string; // Additional details about the basis for the finding
  }>;
  // ... add other fields if needed
}


export interface ParsedClinicalImpression {
    id: string;
    status: string;
    description: string;
    date: string;
    effectiveDateTime: string;
    encounterRef?: string;
    assessorRef?: string;
    findings: string[]; // or a more structured array if you prefer
  }