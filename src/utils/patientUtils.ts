import { Patient } from "../types/fhir";

// src/utils/patientUtils.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatPatientData = (patientData: any): Patient => {
    const nameObj = patientData.name?.[0];
    const givenName = nameObj?.given?.join(" ") || "";
    const fullName = `${givenName} ${nameObj?.family || ""}`.trim() || "Unknown";
  
    const addressObj = patientData.address?.[0];
    const formattedAddress = addressObj
      ? `${addressObj.line?.join(", ") || ""}, ${addressObj.city || ""}, ${addressObj.country || ""}`
      : "N/A";
  
    return {
      id: patientData.id,
      fullName,
      gender: patientData.gender || "N/A",
      birthDate: patientData.birthDate || "N/A",
      address: formattedAddress,
      contact: patientData.telecom?.[0]?.value || "N/A",
    };
  };