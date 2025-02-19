// src/types/FHIRQuestionnaire.ts
import { fhirclient } from 'fhirclient/lib/types';

/** Minimal fields you might need from Questionnaire */
export interface FHIRQuestionnaire extends fhirclient.FHIR.Resource {
  resourceType: 'Questionnaire';
  item?: Array<{
    linkId: string;
    text?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item?: any; // nested items if needed
    // plus any other fields you're interested in
  }>;
}

/**
 * Represents a single question + answers, as your UI wants it displayed.
 */
export interface ParsedQuestion {
    linkId: string;
    questionText: string;
    answers: string[]; // or a union of strings/booleans, etc.
  }