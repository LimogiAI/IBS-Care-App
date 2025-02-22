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
    ibsSymptoms: {
      abdominalPain?: Array<{
        value: number;
        date: string;
        duration?: number;
        frequency?: number;
        system?: string;
        code?: string;
        display?: string;
      }>;
      bloating?: Array<{
        value: number;
        date: string;
        type: "bloating" | "distension";
      }>;
      stoolCharacteristics?: Array<{
        type: number;
        date: string;
        frequency?: number;
      }>;
      associatedSymptoms?: Array<{
        type: string;
        value: number;
        date: string;
      }>;
    };
    relevantConditions: Array<{
      code: string;
      display: string;
      onset: string;
      status: string;
    }>;
    encounters: Array<{
      type: string;
      date: string;
      diagnoses?: string[];
    }>;
    tasks?: Array<{
      id: string;
      status: string;
      intent: string;
      description: string;
      authoredOn: string;
      lastModified: string;
    }>;
    allergies?: Array<{
      code: string;
      display: string;
      category: string;
      type: string;
      criticality: string;
      onset: string;
    }>;
  }
  