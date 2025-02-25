// src/utils/parseQuestionItems.ts
import { FHIRQuestionnaire } from '../types/FHIRQuestionnaire';
import { FHIRQuestionnaireResponse } from '../types/FHIRQuestionnaireResponse';
import { ParsedQuestion } from '../types/FHIRQuestionnaire';
import { findQuestionText } from './findQuestionText';

export function parseQuestionItems(
  qrItems: FHIRQuestionnaireResponse['item'] | undefined,
  questionnaire?: FHIRQuestionnaire
): ParsedQuestion[] {
  if (!qrItems) return [];

  const result: ParsedQuestion[] = [];

  // Define flattenItems with a non-undefined array type
  const flattenItems = (items: NonNullable<FHIRQuestionnaireResponse['item']>) => {
    items.forEach((i) => {
      // If this item has nested items (e.g., a section), process them
      if (i.item && i.item.length > 0) {
        flattenItems(i.item); // i.item is guaranteed to be an array here
      } 
      // If this item has an answer, it’s a question we want to include
      else if (i.answer && i.answer.length > 0) {
        let questionText = i.text || 'No question text provided';

        // If text is missing and we have a questionnaire, try to find it
        if ((!i.text || !i.text.trim()) && questionnaire) {
          const foundText = findQuestionText(questionnaire.item, i.linkId);
          if (foundText) {
            questionText = foundText;
          }
        }

        const answers: string[] = i.answer.map(ans => {
          if (ans.valueString != null) return ans.valueString;
          if (ans.valueBoolean != null) return ans.valueBoolean ? 'Yes' : 'No';
          if (ans.valueCoding != null) {
            return ans.valueCoding.display || ans.valueCoding.code || 'Unknown coding';
          }
          return '(no recognized answer)';
        });

        result.push({
          linkId: i.linkId,
          questionText,
          answers,
        });
      }
    });
  };

  flattenItems(qrItems); // qrItems is already checked for undefined above
  return result;
}