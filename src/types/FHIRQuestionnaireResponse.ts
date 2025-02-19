// src/types/FHIRQuestionnaireResponse.ts
import { fhirclient } from 'fhirclient/lib/types';
import { ParsedQuestion } from './FHIRQuestionnaire';

/** Minimal fields for QuestionnaireResponse */
export interface FHIRQuestionnaireResponse extends fhirclient.FHIR.Resource {
    resourceType: 'QuestionnaireResponse';
    questionnaire?: string; // e.g. "Questionnaire/123"
    encounter?: {
        reference?: string; // e.g. "Encounter/456"
    };
    item?: Array<{
        linkId: string;
        text?: string;
        answer?: Array<{
            valueString?: string;
            valueBoolean?: boolean;
            valueCoding?: {
                system?: string;
                code?: string;
                display?: string;
            };
            // and so on...
        }>;
        // Possibly nested sub-items
        item?: any; // nested items if needed
    }>;
}


export interface ParsedQuestionnaireResponse {
    id: string;
    encounterRef?: string; // e.g. "Encounter/123"
    questionnaireRef?: string; // e.g. "Questionnaire/456"
    questions: ParsedQuestion[];
    // Possibly store the encounter data (if you choose to fetch it)
    encounterPeriodStart?: string; // from the Encounter resource
  }