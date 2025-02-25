import React, { useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card";
import { Send, RefreshCw, Rocket } from "lucide-react";

interface PredictionResult {
  predictabilitySummary: string;
  symptomTrend: {
    abdominalPain: string;
    bloating: string;
    diarrhea: string;
    constipation: string;
  };
  riskFactors: string[];
  recommendations: {
    lifestyleChanges: string[];
    followUpAssessments: string[];
  };
  confidenceLevel: string;
}

interface IBSPredictionResultProps {
  isDarkMode: boolean;
  prediction: PredictionResult;
  onRestart: () => void;
}

const IBSPredictionResult: React.FC<IBSPredictionResultProps> = ({
  isDarkMode,
  prediction,
  onRestart,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendToMobile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail(""); // Reset email input on close
    setIsSubmitted(false); // Reset submission state
  };

  const handleNotifyMe = () => {
    if (email) {
      console.log("Notify me email submitted:", email);
      // Here you could add an API call to save the email
      setIsSubmitted(true);
    }
  };

  return (
    <>
      <Card className={`p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          IBS Predictability Analysis
        </h2>
        <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Results from Predictability AI
        </p>

        <div className="mt-4 space-y-6">
          {/* Summary */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              Summary
            </h3>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              {prediction.predictabilitySummary}
            </p>
            <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Confidence Level:{" "}
              <span
                className={
                  prediction.confidenceLevel === "Low"
                    ? "text-red-500"
                    : prediction.confidenceLevel === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              >
                {prediction.confidenceLevel}
              </span>
            </p>
          </div>

          {/* Symptom Trends */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              Symptom Trends
            </h3>
            <ul className={`list-disc pl-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <li>Abdominal Pain: {prediction.symptomTrend.abdominalPain}</li>
              <li>Bloating: {prediction.symptomTrend.bloating}</li>
              <li>Diarrhea: {prediction.symptomTrend.diarrhea}</li>
              <li>Constipation: {prediction.symptomTrend.constipation}</li>
            </ul>
          </div>

          {/* Risk Factors */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              Risk Factors
            </h3>
            <ul className={`list-disc pl-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {prediction.riskFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              Recommendations
            </h3>
            <div className="space-y-2">
              <div>
                <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                  Lifestyle Changes:
                </p>
                <ul className={`list-disc pl-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {prediction.recommendations.lifestyleChanges.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                  Follow-Up Assessments:
                </p>
                <ul className={`list-disc pl-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {prediction.recommendations.followUpAssessments.map((assessment, index) => (
                    <li key={index}>{assessment}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <Button
            onClick={onRestart}
            className={`flex items-center gap-2 ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            <RefreshCw className="w-4 h-4" />
            Launch Questionnaire Again
          </Button>
          <Button
            onClick={handleSendToMobile}
            className={`flex items-center gap-2 ${isDarkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"}`}
          >
            <Send className="w-4 h-4" />
            Send to Patient Mobile App
          </Button>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className={`rounded-lg p-6 shadow-lg w-96 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              {/* Rocket Icon with Pulse Animation */}
              <Rocket className="w-8 h-8 animate-pulse text-blue-500" />

              {/* Message or Thank You Note */}
              {!isSubmitted ? (
                <>
                  <p className={`text-center ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Stay tuned! We're launching an innovative mobile app powered by SSI and decentralized technology. Want to be notified when it’s ready?
                  </p>

                  {/* Email Input */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full p-2 rounded-md border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />

                  {/* Buttons */}
                  <div className="flex gap-4 mt-2">
                    <Button
                      onClick={handleNotifyMe}
                      disabled={!email}
                      className={`${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      Notify Me
                    </Button>
                    <Button
                      onClick={handleCloseModal}
                      className={`${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      }`}
                    >
                      Close
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className={`text-center ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    Thank you! We'll let you know when our mobile app launches.
                  </p>
                  <Button
                    onClick={handleCloseModal}
                    className={`${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    Close
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IBSPredictionResult;