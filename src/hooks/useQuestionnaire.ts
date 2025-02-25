import { useEffect, useState } from "react";
import FHIR from "fhirclient";

export function useQuestionnaire(accessToken: string, questionnaireId: string) {
  const [questionnaire, setQuestionnaire] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      if (!accessToken || !questionnaireId) {
        setError("Missing required credentials");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Build FHIR client (same as in `useObservations.ts`)
        const client = FHIR.client({
          serverUrl: `${import.meta.env.VITE_FHIR_BASE_URL}/${import.meta.env.VITE_FHIR_TENANT_ID}`,
          tokenResponse: {
            access_token: accessToken,
          },
        });

        // ✅ Fetching as a generic FHIR resource instead of `fhirclient.FHIR.Questionnaire`
        const data = await client.request<any>(`Questionnaire/${questionnaireId}`);

        console.log({ data }, "Fetched FHIR Questionnaire");

        setQuestionnaire(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching questionnaire:", err);
        setError("Failed to load questionnaire.");
        setQuestionnaire(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, [accessToken, questionnaireId]);

  return {
    questionnaire,
    loading,
    error,
  };
}
