
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
import { ClipboardList, ArrowRight, ArrowLeft } from "lucide-react";
import { questions } from "@/utils/questions";
import { StoolFormOption } from "@/types/romeiv";


interface RomeIVQuestionnaireProps {
  isDarkMode: boolean;
}

const RomeIVQuestionnaire: React.FC<RomeIVQuestionnaireProps> = ({
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const totalQuestions = questions?.reduce(
    (acc, section) => acc + section.questions.length,
    0
  );
  const currentQuestionNumber =
    questions
      ?.slice(0, currentSection)
      .reduce((acc, section) => acc + section.questions.length, 0) +
    currentQuestion +
    1;

  const progress = (currentQuestionNumber / totalQuestions) * 100;

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    handleNext();
  };

  const handleNext = () => {
    if (currentQuestion < questions[currentSection].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < questions.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      // Questionnaire completed
      console.log("Answers:", answers);
      setIsOpen(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
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
  };

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
                  {questions[currentSection].section}
                </DialogTitle>
                <DialogDescription
                  className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                >
                  Question {currentQuestionNumber} of {totalQuestions}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto py-4">
              <h3
                className={`text-lg font-medium mb-4 ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {questions[currentSection].questions[currentQuestion].text}
              </h3>
            <div className="space-y-4">
              {questions[currentSection].questions[currentQuestion].id === "stool_form" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(questions[currentSection].questions[currentQuestion].options as StoolFormOption[]).map(
                    (option) => (
                      <div
                        key={option.value}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        } ${
                          answers[questions[currentSection].questions[currentQuestion].id] === option.value
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
                          <p className={`text-sm text-center ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {(questions[currentSection].questions[currentQuestion].options as string[]).map(
                    (option) => (
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
                    )
                  )}
                </div>
              )}
            </div>
          </div>

           
            
            <div className="sticky bottom-0 bg-inherit pt-4">
              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0 && currentQuestion === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button onClick={handleNext} className="flex items-center gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </DialogFooter>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RomeIVQuestionnaire;