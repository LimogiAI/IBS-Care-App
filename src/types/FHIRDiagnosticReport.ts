// src/types/FHIRDiagnosticReport.ts
import { fhirclient } from 'fhirclient/lib/types';

/**
 * Minimal fields for a DiagnosticReport
 * Expand this as needed for your use-case
 */
export interface FHIRDiagnosticReport extends fhirclient.FHIR.Resource {
  resourceType: 'DiagnosticReport';
  status?: string; // e.g. "final", "partial", "amended", etc.
  code?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  category?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  }>;
  effectiveDateTime?: string; // The clinically relevant time
  issued?: string;            // When this was made available (final time)
  conclusion?: string;        // A free text conclusion of the report
  result?: Array<{
    reference?: string;       // e.g. "Observation/123"
  }>;
  // ... add more fields as needed
}


export interface ParsedDiagnosticReport {
    id: string;
    reportName: string;       // Derived from code.coding
    status: string;           // "final", "partial", ...
    effectiveDateTime: string;
    issued: string;
    conclusion: string;
  }
  