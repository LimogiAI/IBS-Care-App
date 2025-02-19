import { fhirclient } from "fhirclient/lib/types";

// Optional: Minimal fields from Encounter if you want context
export interface FHIREncounter extends fhirclient.FHIR.Resource {
    resourceType: 'Encounter';
    period?: {
      start?: string;
      end?: string;
    };
    // etc...
  }
  