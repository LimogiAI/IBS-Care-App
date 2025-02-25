import React from "react";
import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card";
import { Send, RefreshCw } from "lucide-react";

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
  const handleSendToMobile = () => {
    console.log("Sending prediction to patient mobile app:", prediction);
    // Implement mobile app integration here (e.g., API call)
  };

  return (
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
            Confidence Level: <span className={prediction.confidenceLevel === "Low" ? "text-red-500" : prediction.confidenceLevel === "Medium" ? "text-yellow-500" : "text-green-500"}>{prediction.confidenceLevel}</span>
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
  );
};

export default IBSPredictionResult;