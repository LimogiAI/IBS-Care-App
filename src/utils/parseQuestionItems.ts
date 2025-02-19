// parseQuestionItems.ts
import { FHIRQuestionnaire } from '../types/FHIRQuestionnaire';
import { FHIRQuestionnaireResponse } from '../types/FHIRQuestionnaireResponse';
import { ParsedQuestion } from '../types/FHIRQuestionnaire';
import { findQuestionText } from './findQuestionText';

/**
 * Convert raw QuestionnaireResponse items to user-friendly ParsedQuestion.
 * If item.text is missing, we optionally look it up from the Questionnaire.
 */
export function parseQuestionItems(
  qrItems: FHIRQuestionnaireResponse['item'] | undefined,
  questionnaire?: FHIRQuestionnaire
): ParsedQuestion[] {
  if (!qrItems) return [];

  return qrItems.map((i) => {
    let questionText = i.text || 'No question text provided';

    // If text is missing, try to find it in the Questionnaire
    if ((!i.text || !i.text.trim()) && questionnaire) {
      const foundText = findQuestionText(questionnaire.item, i.linkId);
      if (foundText) {
        questionText = foundText;
      }
    }

    // Gather answer strings
    const answers: string[] = i.answer?.map(ans => {
      if (ans.valueString != null) return ans.valueString;
      if (ans.valueBoolean != null) return ans.valueBoolean ? 'Yes' : 'No';
      if (ans.valueCoding != null) {
        return ans.valueCoding.display || ans.valueCoding.code || 'Unknown coding';
      }
      return '(no recognized answer)';
    }) || [];

    // Handle nested items if present
    let childQuestions: ParsedQuestion[] = [];
    if (i.item) {
      childQuestions = parseQuestionItems(i.item, questionnaire);
    }

    return {
      linkId: i.linkId,
      questionText,
      answers,
      ...(childQuestions.length ? { nestedQuestions: childQuestions } : {})
    };
  });
}
