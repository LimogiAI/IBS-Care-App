import { IBSAssessment } from "./ibs";

export interface Patient {
    id: string;
    fullName: string;
    gender: string;
    birthDate: string;
    address?: string;
    contact?: string;
  }
  
  export interface FormattedCondition {
    id: string;
    code: string;
    recordedDate: string;
    clinicalStatus: string;
    verificationStatus: string;
  }
  
  export interface FHIRBundle {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entry?: Array<{ resource: any }>;
  }
  
  export interface LoadingState {
    patient: boolean;
    conditions: boolean;
    analysis: boolean;
  }
  
  export interface ErrorState {
    patient: string | null;
    conditions: string | null;
    analysis: string | null;
  }
  
  export interface FHIRDataState {
    patient: Patient | null;
    conditions: FormattedCondition[];
    analysis: IBSAssessment | null;
    loading: LoadingState;
    error: ErrorState;
  }
  