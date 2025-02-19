// src/hooks/useQuestionnaireResponses.ts
import { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { FHIRQuestionnaireResponse, ParsedQuestionnaireResponse } from '../types/FHIRQuestionnaireResponse';
import { FHIRQuestionnaire } from '../types/FHIRQuestionnaire';
import { FHIREncounter } from '../types/FHIREncounter';
import { parseQuestionItems } from '../utils/parseQuestionItems';

/**
 * Extended parsed structure that can hold more Encounter details
 */
interface ExtendedParsedQuestionnaireResponse extends ParsedQuestionnaireResponse {
  encounterData?: {
    id?: string;
    start?: string;
    end?: string;
    status?: string;
    classCode?: string;
    classSystem?: string;
    // ... any other fields you want from Encounter
  };
}

/**
 * Hook to fetch all QuestionnaireResponses for a given patientId,
 * optionally including the related Questionnaire & Encounter details.
 */
export function useQuestionnaireResponses(accessToken: string, patientId: string) {
  const [dataQnA, setdataQnA] = useState<ExtendedParsedQuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!accessToken || !patientId) {
        setError('Missing required credentials or patientId');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1) Build FHIR client
        const client = FHIR.client({
          serverUrl: `${import.meta.env.VITE_FHIR_BASE_URL}/${import.meta.env.VITE_FHIR_TENANT_ID}`,
          tokenResponse: { access_token: accessToken },
        });

        // 2) Fetch all QuestionnaireResponse resources for this patient
        // If the server supports _include, you could do e.g.
        // `QuestionnaireResponse?patient=${patientId}&_include=QuestionnaireResponse:questionnaire&_include=QuestionnaireResponse:encounter`
        const bundle = await client.request<fhirclient.FHIR.Bundle>(
          `QuestionnaireResponse?patient=${patientId}`
        );

        console.log({bundle}, "Patient Questionnaire")

        if (!bundle.entry || bundle.entry.length === 0) {
          setdataQnA([]);
          setError(null);
          return;
        }

        // 3) For each QR, optionally fetch Questionnaire & Encounter and parse
        // Use Promise.all so that each item fetches references in parallel
        const tasks = bundle.entry.map(async (entry) => {
          const qr = entry.resource as FHIRQuestionnaireResponse;

          // Possibly fetch the Questionnaire if text is missing
          let questionnaire: FHIRQuestionnaire | null = null;
          const anyMissingTexts = (qr.item || []).some(item => !item.text);
          if (anyMissingTexts && qr.questionnaire) {
            questionnaire = await client.request<FHIRQuestionnaire>(qr.questionnaire);
          }

          // Optionally fetch Encounter if you need more context
          let encounter: FHIREncounter | null = null;
          if (qr.encounter?.reference) {
            encounter = await client.request<FHIREncounter>(qr.encounter.reference);
          }

          // Parse the question items
          const parsedQuestions = parseQuestionItems(qr.item, questionnaire || undefined);

          // Build your final parsed structure
          const parsed: ExtendedParsedQuestionnaireResponse = {
            id: qr.id || 'unknown',
            questionnaireRef: qr.questionnaire,
            encounterRef: qr.encounter?.reference,
            questions: parsedQuestions,
            encounterPeriodStart: encounter?.period?.start,
          };

          // Optionally store more details from the Encounter
          if (encounter) {
            parsed.encounterData = {
              id: encounter.id,
              start: encounter.period?.start,
              end: encounter.period?.end,
              status: encounter.status,  // if it exists
              classCode: encounter.class?.code,
              classSystem: encounter.class?.system,
              // etc...
            };
          }

          return parsed;
        });

        // 4) Wait for all fetches to complete in parallel
        const allParsed = await Promise.all(tasks);
        setdataQnA(allParsed);
        setError(null);
      } catch (err) {
        console.error('Error fetching QuestionnaireResponses:', err);
        setdataQnA([]);
        setError('Failed to load QuestionnaireResponses.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [accessToken, patientId]);

  return {
    dataQnA,
    loading,
    error,
    // Optional manual refetch
    refetch: () => {
      setLoading(true);
      setError(null);
    },
  };
}
