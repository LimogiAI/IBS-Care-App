// src/utils/ibsAnalysis.ts
import { IBSAssessment, ProcessedFHIRData } from "../types/ibs";

export async function fetchIBSAnalysis(
  processedFHIRData: ProcessedFHIRData
): Promise<IBSAssessment> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL_ANALYSIS_EVIDENCE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(processedFHIRData),
  });
  if (!response.ok) {
    throw new Error(`Error fetching IBS analysis: ${response.statusText}`);
  }
  return await response.json();
}

// Optional: a helper function to compute age from birthDate string.
export function computeAge(birthDateStr: string): number {
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
