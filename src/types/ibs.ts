// src/types/ibs.ts
export interface IBSAssessment {
  overallNarrativeSummary: string;
  clinicalAssessment: {
    romeIVCriteriaMet: boolean;
    narrativeSummary: string;
    ibsSSS: {
      narrativeSummary: string;
      abdominalPainSeverity: {
        value: number;
        sourceData: string;
        clinicalGap: string;
      };
      abdominalPainFrequency: {
        value: number;
        sourceData: string;
        clinicalGap: string;
      };
      bloatingSeverity: {
        value: number;
        sourceData: string;
        clinicalGap: string;
      };
      bowelHabitDissatisfaction: {
        value: number;
        sourceData: string;
        clinicalGap: string;
      };
      lifeInterference: {
        value: number;
        sourceData: string;
        clinicalGap: string;
      };
      totalScore: {
        value: number;
        interpretation: string;
      };
    };
    bristolStoolScale: {
      value: number;
      sourceData: string;
      interpretation: string;
      narrativeSummary: string;
    };
    ibsSubtype: {
      classification: "IBS-C" | "IBS-D" | "IBS-M" | "IBS-U" | "Undetermined";
      reasoning: string;
      confidenceLevel: string;
      narrativeSummary: string;
    };
  };
  missingInformation: {
    narrativeSummary: string;
    criticalGaps: string[];
    recommendedAssessments: string[];
  };
  clinicalRecommendations: {
    narrativeSummary: string;
    immediateActions: string[];
    suggestedLabTests: string[];
    dataCollectionNeeded: string[];
  };
  reliabilityAssessment: {
    narrativeSummary: string;
    limitingFactors: string[];
    confidenceLevel: string;
  };
}

export interface ProcessedFHIRData {
  patient: {
    id: string;
    gender?: string;
    age?: number;
  };
  relevantConditions: Array<{
    code: string;
    display: string;
    onset: string;
    status: string;
  }>;
  relevantObservations: Array<{
    id: string;
    code: string;
    value: string;
    effectiveDateTime: string;
  }>;
  relevantClinicalImpressions: Array<{
    id: string;
    status: string;
    description: string;
    effectiveDateTime?: string;
  }>;
  relevantDiagnosticReports: Array<{
    id: string;
    status: string;
    conclusion: string;
    effectiveDateTime?: string;
  }>;
  relevantQuestionnaireResponses: Array<{
    id: string;
    questionnaireRef?: string;
    authored?: string;
    questions: Array<{
      linkId: string;
      questionText: string;
      answers: string[];
    }>;
  }>;
}