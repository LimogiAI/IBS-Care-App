import React, { useState, useEffect } from "react";
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
import { ClipboardList, ArrowRight, ArrowLeft } from "lucide-react";
import { useQuestionnaire } from "@/hooks/useQuestionnaire";

interface RomeIVQuestionnaireProps {
  isDarkMode: boolean;
  patientId: string;
  onSubmitSuccess?: () => void; // ✅ Made it optional
}

const RomeIVQuestionnaire: React.FC<RomeIVQuestionnaireProps> = ({
  isDarkMode,
  patientId,
  onSubmitSuccess = () => console.log("✅ Default onSubmitSuccess called"), // ✅ Default function
}) => {
  const accessToken = sessionStorage.getItem("access_token") || "";
  const questionnaireId = "5f2d6db0-4436-4026-a26a-41e5b321ff01"; // Rome IV Questionnaire ID
  const { questionnaire, loading, error } = useQuestionnaire(accessToken, questionnaireId);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Extract all questions and ensure section headers appear above every question
  const extractQuestionsWithSections = (items: any[]): any[] => {
    return items.flatMap((section) =>
      section.type === "group" && section.item
        ? section.item.map((question: any) => ({
            ...question,
            sectionHeader: section.text, // ✅ Attach section title to each question
          }))
        : []
    );
  };

  const questions = questionnaire?.item ? extractQuestionsWithSections(questionnaire.item) : [];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const isAllAnswered = Object.keys(answers).length === totalQuestions;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setAnswers({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    handleNext();
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!isAllAnswered) {
      console.warn("❌ Not all questions have been answered!");
      return;
    }
    setIsSubmitting(true);

    console.log("🚀 Submitting Questionnaire Response...");
    console.log("🔑 Access Token:", accessToken);
    console.log("👤 Patient ID (from props):", patientId);
    console.log("📦 Patient ID (from sessionStorage):", sessionStorage.getItem("patientId"));

    const finalPatientId = patientId || sessionStorage.getItem("patientId");
    if (!finalPatientId) {
      console.error("❌ Patient ID is missing! Cannot proceed.");
      setIsSubmitting(false);
      return;
    }

    const apiUrl = `https://app.meldrx.com/api/fhir/3eb16078-78c9-4b9f-9974-ea89dbb34c71/QuestionnaireResponse`;

    const responsePayload = {
      resourceType: "QuestionnaireResponse",
      questionnaire: `https://app.meldrx.com/api/fhir/3eb16078-78c9-4b9f-9974-ea89dbb34c71/Questionnaire/5f2d6db0-4436-4026-a26a-41e5b321ff01`,
      identifier: {
        system: "http://example.org/bristol-stool-scale",
        value: "12345", // Dummy value
      },
      subject: { reference: `Patient/${finalPatientId}` },
      status: "completed",
      item: questions.map((q) => ({
        linkId: q.linkId,
        answer: answers[q.linkId] ? [{ valueString: answers[q.linkId] }] : [], // ✅ Ensures all questions are included
      })),
    };

    console.log("📩 Payload being sent:", JSON.stringify(responsePayload, null, 2));

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/fhir+json",
          "Content-Type": "application/fhir+json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        body: JSON.stringify(responsePayload),
      });

      console.log("🛜 API Response Status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("📝 Server Response:", responseData);

        setTimeout(() => {
          console.log("🛑 Closing modal...");
          setIsOpen(false);
          onSubmitSuccess();
        }, 500);
      } else {
        console.error("❌ Failed to submit responses.");
        const errorData = await response.text();
        console.error("🛑 Server Error Response:", errorData);
      }
    } catch (error) {
      console.error("❌ Error saving questionnaire response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 ${
          isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
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
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {loading ? "Loading..." : error ? "Error fetching questionnaire" : questionnaire?.title}
            </DialogTitle>
            <DialogDescription className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              Question {currentIndex + 1} of {totalQuestions}
            </DialogDescription>
          </DialogHeader>

          <Progress value={progress} className="h-2 mt-4" />

          <div className="py-4">
            <h2 className="text-xl font-bold mb-2">{questions[currentIndex]?.sectionHeader}</h2>
            <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              {questions[currentIndex]?.text}
            </h3>
            <div className="space-y-2">
              {questions[currentIndex]?.answerOption?.map((option: any) => (
                <Button
                  key={option.valueString}
                  variant="outline"
                  className={`w-full text-left ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } ${
                    answers[questions[currentIndex]?.linkId] === option.valueString
                      ? isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => handleAnswer(questions[currentIndex]?.linkId, option.valueString)}
                >
                  {option.valueString}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between mt-6">
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
            <Button onClick={handleSubmit} disabled={!isAllAnswered || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"} <ArrowRight className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RomeIVQuestionnaire;
