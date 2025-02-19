import { FHIRBundle, FormattedCondition } from "../types/fhir";

// src/utils/conditionUtils.ts
export const formatConditions = (conditionData: FHIRBundle): FormattedCondition[] => {
    return conditionData.entry?.map(entry => {
      const condition = entry.resource;
      return {
        id: condition.id,
        code: condition.code?.coding?.[0]?.display || "Unknown Condition",
        recordedDate: condition.recordedDate || "Unknown Date",
        clinicalStatus: condition.clinicalStatus?.coding?.[0]?.code || "Unknown Status",
        verificationStatus: condition.verificationStatus?.coding?.[0]?.code || "Not Verified",
      };
    }) || [];
  };