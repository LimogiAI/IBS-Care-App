import { FHIRClinicalImpression, ParsedClinicalImpression } from "../types/FHIRClinicalImpression";


export default function parseClinicalImpression(resource: FHIRClinicalImpression): ParsedClinicalImpression {
    // Collect findings from itemCodeableConcept.display or .text
    const findings: string[] = resource.finding?.map((f) => {
      const display = f.itemCodeableConcept?.coding?.[0]?.display ?? f.itemCodeableConcept?.text;
      if (display) {
        return display;
      }
      if (f.itemReference?.reference) {
        // e.g. "Condition/abc" if no textual label is available
        return f.itemReference.reference;
      }
      return f.basis ?? 'Unknown finding';
    }) || [];
  
    return {
      id: resource.id ?? 'unknown',
      status: resource.status ?? 'unknown',
      description: resource.description ?? 'No description provided',
      date: resource.date ?? 'N/A',
      effectiveDateTime: resource.effectiveDateTime ?? 'N/A',
      encounterRef: resource.encounter?.reference,
      assessorRef: resource.assessor?.reference,
      findings,
    };
  }
  