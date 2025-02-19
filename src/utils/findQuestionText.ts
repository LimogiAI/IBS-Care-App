// findQuestionText.ts
import { FHIRQuestionnaire } from "../types/FHIRQuestionnaire";

/**
 * Retrieves question text from a Questionnaire by matching linkId,
 * walking nested items if needed.
 */
export function findQuestionText(
  questionnaireItems: FHIRQuestionnaire['item'] | undefined,
  linkId: string
): string | undefined {
  if (!questionnaireItems) return undefined;
  for (const item of questionnaireItems) {
    if (item.linkId === linkId) {
      return item.text;
    }
    if (item.item) {
      const found = findQuestionText(item.item, linkId);
      if (found) return found;
    }
  }
  return undefined;
}
