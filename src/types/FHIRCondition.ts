// FHIRCondition.ts
import { fhirclient } from 'fhirclient/lib/types';

export interface FHIRCondition extends fhirclient.FHIR.Resource {
  resourceType: 'Condition';
  code?: {
    coding?: Array<{
      display?: string;
      code?: string;
    }>;
  };
  recordedDate?: string;
  clinicalStatus?: {
    coding?: Array<{
      code?: string;
    }>;
  };
  verificationStatus?: {
    coding?: Array<{
      code?: string;
    }>;
  };
}
