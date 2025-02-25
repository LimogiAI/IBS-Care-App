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
} from "lucide-react";
import { ibsQOLQuestions } from "../utils/qol-questions";
import IBSPredictionResult from "./IBSPredictionResult";
import { LoadingIndicator } from "./LoadingIndicator";

interface IBSQOLQuestionnaireProps {
  isDarkMode: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processedFHIRData?: any;
}

const ratingOptions = [
  { value: "1", label: "Not at all" },
  { value: "2", label: "Slightly" },
  { value: "3", label: "Moderately" },
  { value: "4", label: "Quite a bit" },
  { value: "5", label: "Extremely" },
];

const IBSQOLQuestionnaire: React.FC<IBSQOLQuestionnaireProps> = ({
  isDarkMode,
  processedFHIRData,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New: Loading state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [predictionResult, setPredictionResult] = useState<any | null>(null); // New: Store prediction

  const totalQuestions = ibsQOLQuestions.reduce(
    (acc, section) => acc + section.questions.length,
    0
  );
  const currentQuestionNumber =
    ibsQOLQuestions
      .slice(0, currentSection)
      .reduce((acc, section) => acc + section.questions.length, 0) +
    currentQuestion +
    1;

  const progress = isReviewing
    ? 100
    : (currentQuestionNumber / totalQuestions) * 100;

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    if (!isReviewing) handleNext();
  };

  const handleNext = () => {
    if (
      currentQuestion <
      ibsQOLQuestions[currentSection].questions.length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < ibsQOLQuestions.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      setIsReviewing(true);
    }
  };

  const handlePrevious = () => {
    if (isReviewing) {
      setIsReviewing(false);
      setCurrentSection(ibsQOLQuestions.length - 1);
      setCurrentQuestion(
        ibsQOLQuestions[ibsQOLQuestions.length - 1].questions.length - 1
      );
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(
        ibsQOLQuestions[currentSection - 1].questions.length - 1
      );
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
    setPredictionResult(null);
  };

  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!processedFHIRData) {
      setSubmissionError("No FHIR data available for prediction");
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL_ANALYSIS_PREDICTION}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fhirData: processedFHIRData,
            qolResponses: answers,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${await response.text()}`);
      }

      const prediction = await response.json();
      setPredictionResult(prediction);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmissionError(
        "Failed to submit data to Predictability AI. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
    setSubmissionError(null);
  };

  const renderReviewSummary = () => (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
      {ibsQOLQuestions.map((section, sectionIndex) => (
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
                {answers[question.id]
                  ? ratingOptions.find(
                      (opt) => opt.value === answers[question.id]
                    )?.label
                  : "Not answered"}
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
        {ibsQOLQuestions[currentSection].questions[currentQuestion].text}
      </h3>
      <div className="space-y-2">
        {ratingOptions.map((option) => (
          <Button
            key={option.value}
            variant="outline"
            className={`w-full justify-start text-left ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } ${
              answers[
                ibsQOLQuestions[currentSection].questions[currentQuestion].id
              ] === option.value
                ? isDarkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : ""
            }`}
            onClick={() =>
              handleAnswer(
                ibsQOLQuestions[currentSection].questions[currentQuestion].id,
                option.value
              )
            }
          >
            {option.value} - {option.label}
          </Button>
        ))}
      </div>
    </div>
  );

  if (predictionResult) {
    return (
      <IBSPredictionResult
        isDarkMode={isDarkMode}
        prediction={predictionResult}
        onRestart={handleStart}
      />
    );
  }

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
        Launch IBS-QOL Questionnaire
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
                    ? "Review Your IBS-QOL Answers"
                    : ibsQOLQuestions[currentSection].section}
                </DialogTitle>
                <DialogDescription
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                >
                  {isReviewing
                    ? "Please review all answers below (1 = Not at all, 5 = Extremely)"
                    : `Question ${currentQuestionNumber} of ${totalQuestions}`}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto py-4">
              {isSubmitting ? (
                <LoadingIndicator isDarkMode={isDarkMode} />
              ) : isReviewing ? (
                renderReviewSummary()
              ) : (
                renderQuestion()
              )}
            </div>

            {!isSubmitting && (
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
            )}
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
              Submitting this questionnaire will send your Quality of Life
              responses and FHIR data to the Predictability AI for analysis. The
              results will be stored and may influence future treatment
              recommendations. Are you sure you want to proceed?
              {submissionError && (
                <p className="text-red-500 mt-2">{submissionError}</p>
              )}
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
              className={`${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IBSQOLQuestionnaire;
