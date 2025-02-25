import { FHIRQuestionnaireResponse } from "@/types/FHIRQuestionnaireResponse";

export const fetchQuestionnaireResponse = async (patientId: string, questionnaireRef: string): Promise<FHIRQuestionnaireResponse | null> => {
  const response = await fetch(`/fhir/QuestionnaireResponse?patient=Patient/${patientId}&questionnaire=${questionnaireRef}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
  });
  return response.ok ? await response.json() : null;
};

export const submitQuestionnaireResponse = async (response: FHIRQuestionnaireResponse): Promise<void> => {
  await fetch("/fhir/QuestionnaireResponse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
    body: JSON.stringify(response),
  });
};