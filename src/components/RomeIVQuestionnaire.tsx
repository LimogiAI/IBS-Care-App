
// export default RomeIVQuestionnaire;
import React, { useState } from "react";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { questions } from "@/utils/questions";
import { StoolFormOption } from "@/types/romeiv";
// Assuming you have a toast component; if not, see the example below
import { useToast } from "@/components/ui/toast";

interface RomeIVQuestionnaireProps {
  isDarkMode: boolean;
}

const QUESTIONNAIRE_URL = import.meta.env.QUESTIONNAIRE_URL || 'https://app.meldrx.com/api/fhir/3eb16078-78c9-4b9f-9974-ea89dbb34c71/Questionnaire/fe7cb8b0-b68d-4b86-b624-6cb83cd0d429'

const QUESTIONNAIRE_RESPONSE_URL = import.meta.env.QUESTIONNAIRE_RESPONSE_URL || 'https://app.meldrx.com/api/fhir/3eb16078-78c9-4b9f-9974-ea89dbb34c71/QuestionnaireResponse/'



const RomeIVQuestionnaire: React.FC<RomeIVQuestionnaireProps> = ({
  isDarkMode,
}) => {
  const { toast } = useToast(); // Hook for toast notifications
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New loading state

  const totalQuestions = questions.reduce(
    (acc, section) => acc + section.questions.length,
    0
  );
  const currentQuestionNumber =
    questions
      .slice(0, currentSection)
      .reduce((acc, section) => acc + section.questions.length, 0) +
    currentQuestion +
    1;

  const progress = isReviewing
    ? 100
    : (currentQuestionNumber / totalQuestions) * 100;

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    if (!isReviewing) {
      handleNext();
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions[currentSection].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < questions.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      setIsReviewing(true);
    }
  };

  const handlePrevious = () => {
    if (isReviewing) {
      setIsReviewing(false);
      setCurrentSection(questions.length - 1);
      setCurrentQuestion(questions[questions.length - 1].questions.length - 1);
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(questions[currentSection - 1].questions.length - 1);
    }
  };

  const handleStart = () => {
    setIsOpen(true);
    setCurrentSection(0);
    setCurrentQuestion(0);
    setAnswers({});
    setIsReviewing(false);
    setShowConfirmDialog(false);
    setSubmissionError(null);
    setIsSubmitting(false);
  };

  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true); // Start loading state
    setSubmissionError(null); // Clear any previous errors 
    const accessToken = sessionStorage.getItem("access_token") || "";
    const patientId = sessionStorage.getItem("patientId") || "";

    if (!accessToken || !patientId) {
      setSubmissionError("Missing authentication token or patient ID.");
      setIsSubmitting(false);
      return;
    }

    const questionnaireResponse = {
      resourceType: "QuestionnaireResponse",
      identifier: {
        system: "http://limogi.ai",
        value: `answer-${Date.now()}`,
      },
      questionnaire:
      QUESTIONNAIRE_URL,
      status: "completed",
      subject: {
        reference: `Patient/${patientId}`,
      },
      authored: new Date().toISOString(),
      item: questions.map((section) => ({
        linkId: section.section.toLowerCase().replace(/\s+/g, "-"),
        item: section.questions.map((question) => ({
          linkId: question.id,
          answer: answers[question.id]
            ? [{ valueString: answers[question.id] }]
            : undefined,
        })).filter((item) => item.answer),
      })),
    };

    try {
      const response = await fetch(
        QUESTIONNAIRE_RESPONSE_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(questionnaireResponse),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.issue?.[0]?.diagnostics || "Failed to submit questionnaire"
        );
      }

      const result = await response.json();
      console.log("QuestionnaireResponse submitted successfully:", result);

      // Show success toast
      toast({
        title: "Submission Successful",
        description: "Please Refresh the Dashbaord for AI Analysis Result",
        variant: "success",
      });

      setShowConfirmDialog(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting to FHIR:", error);
      setSubmissionError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false); // End loading state
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
    setSubmissionError(null);
  };

  const renderReviewSummary = () => (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
      {questions.map((section, sectionIndex) => (
        <div key={section.section}>
          <h3
            className={`text-lg font-semibold mb-3 ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            {section.section}
          </h3>
          {section.questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className={`mb-4 p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <p
                className={`font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {question.text}
              </p>
              <p
                className={`mt-1 ${
                  answers[question.id]
                    ? isDarkMode
                      ? "text-blue-300"
                      : "text-blue-600"
                    : "text-red-500"
                }`}
              >
                {answers[question.id] || "Not answered"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className={`mt-2 ${
                  isDarkMode
                    ? "text-blue-300 hover:text-blue-200"
                    : "text-blue-600 hover:text-blue-800"
                }`}
                onClick={() => {
                  setIsReviewing(false);
                  setCurrentSection(sectionIndex);
                  setCurrentQuestion(questionIndex);
                }}
              >
                Edit Answer
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderQuestion = () => (
    <div className="space-y-4">
      <h3
        className={`text-lg font-medium mb-4 ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {questions[currentSection].questions[currentQuestion].text}
      </h3>
      <div className="space-y-2">
        {questions[currentSection].questions[currentQuestion].id ===
        "stool_form" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(
              questions[currentSection].questions[currentQuestion]
                .options as StoolFormOption[]
            ).map((option) => (
              <div
                key={option.value}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } ${
                  answers[
                    questions[currentSection].questions[currentQuestion].id
                  ] === option.value
                    ? isDarkMode
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-blue-500 text-white border-blue-400"
                    : ""
                }`}
                onClick={() =>
                  handleAnswer(
                    questions[currentSection].questions[currentQuestion].id,
                    option.value
                  )
                }
              >
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src={option.image}
                    alt={`Bristol Stool Type ${option.value}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <h4 className="font-medium text-center">{option.value}</h4>
                  <p
                    className={`text-sm text-center ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          (
            questions[currentSection].questions[currentQuestion]
              .options as string[]
          ).map((option) => (
            <Button
              key={option}
              variant="outline"
              className={`w-full justify-start text-left ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              } ${
                answers[
                  questions[currentSection].questions[currentQuestion].id
                ] === option
                  ? isDarkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() =>
                handleAnswer(
                  questions[currentSection].questions[currentQuestion].id,
                  option
                )
              }
            >
              {option}
            </Button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Button
        onClick={handleStart}
        className={`flex items-center gap-2 ${
          isDarkMode
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        Launch Rome IV Questionnaire
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={`sm:max-w-2xl max-h-[90vh] overflow-y-auto ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-inherit z-10 pb-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {isReviewing
                    ? "Review Your Answers"
                    : questions[currentSection].section}
                </DialogTitle>
                <DialogDescription
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                >
                  {isReviewing
                    ? "Please review all answers below"
                    : `Question ${currentQuestionNumber} of ${totalQuestions}`}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto py-4">
              {isReviewing ? renderReviewSummary() : renderQuestion()}
            </div>

            {submissionError && (
              <div
                className={`text-red-500 p-2 rounded ${
                  isDarkMode ? "bg-red-900" : "bg-red-100"
                }`}
              >
                {submissionError}
              </div>
            )}

            <div className="sticky bottom-0 bg-inherit pt-4">
              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0 && currentQuestion === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {isReviewing ? "Back to Questions" : "Previous"}
                </Button>
                {isReviewing ? (
                  <Button
                    onClick={handleSubmit}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Submit
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent
          className={`sm:max-w-md ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Confirm Submission
            </DialogTitle>
            <DialogDescription
              className={isDarkMode ? "text-gray-300" : "text-gray-600"}
            >
              Submitting this questionnaire will update the patient's FHIR
              QuestionnaireResponse resource. This data will be stored in the
              patient's clinical record and may be used for diagnostic and
              treatment purposes. Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancelSubmit}
              className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className={`flex items-center gap-2 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RomeIVQuestionnaire;