// src/hooks/useQuestionnaireResponses.ts
import { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';
import { FHIRQuestionnaireResponse, ParsedQuestionnaireResponse } from '../types/FHIRQuestionnaireResponse';
import { FHIRQuestionnaire } from '../types/FHIRQuestionnaire';
import { parseQuestionItems } from '../utils/parseQuestionItems';

const ROME_IV_QUESTIONNAIRE_URL = import.meta.env.ROME_IV_QUESTIONNAIRE_URL || 'https://app.meldrx.com/api/fhir/3eb16078-78c9-4b9f-9974-ea89dbb34c71/Questionnaire/fe7cb8b0-b68d-4b86-b624-6cb83cd0d429'


export function useQuestionnaireResponses(accessToken: string, patientId: string, refreshKey: number) {
  const [responses, setResponses] = useState<ParsedQuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!accessToken || !patientId) {
        setError('Missing required credentials or patient ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const client = FHIR.client({
          serverUrl: `${import.meta.env.VITE_FHIR_BASE_URL}/${import.meta.env.VITE_FHIR_TENANT_ID}`,
          tokenResponse: { access_token: accessToken },
        });

        // Fetch QuestionnaireResponses
        const bundle = await client.request<fhirclient.FHIR.Bundle>(
          `QuestionnaireResponse?patient=${patientId}&questionnaire=${ROME_IV_QUESTIONNAIRE_URL}&_count=100`
        );

        console.log({ bundle }, "Patient Rome IV Questionnaire Responses");

        if (!bundle.entry || bundle.entry.length === 0) {
          setResponses([]);
          setError(null);
        } else {
          // Fetch the Questionnaire to get question text
          const questionnaire = await client.request<FHIRQuestionnaire>(ROME_IV_QUESTIONNAIRE_URL);

          const parsedResponses = bundle.entry.map((entry) => {
            const qr = entry.resource as FHIRQuestionnaireResponse;
            const parsedQuestions = parseQuestionItems(qr.item || [], questionnaire);
            return {
              id: qr.id || 'unknown',
              questionnaireRef: qr.questionnaire,
              encounterRef: qr.encounter?.reference,
              questions: parsedQuestions,
              encounterPeriodStart: qr.authored,
            };
          }).sort((a, b) => 
            new Date(b.encounterPeriodStart || '').getTime() - 
            new Date(a.encounterPeriodStart || '').getTime()
          );

          setResponses(parsedResponses);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching QuestionnaireResponses:', err);
        setError('Failed to load Rome IV questionnaire responses.');
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [accessToken, patientId, refreshKey]);

  return {
    responses,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
    },
  };
}