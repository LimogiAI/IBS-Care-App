import React from "react";
import {
  Activity,
  ClipboardList,
  Brain,
  AlertTriangle,
  Info,
  FileWarning,
  Stethoscope,
  Scale,
} from "lucide-react";

interface IBSAnalysisProps {
  isDarkMode: boolean;
  analysis: {
    overallNarrativeSummary: string;
    clinicalAssessment: {
      romeIVCriteriaMet: boolean;
      narrativeSummary: string;
      ibsSSS: {
        narrativeSummary: string;
        abdominalPainSeverity: {
          value: number;
          sourceData: string;
          clinicalGap: string;
        };
        abdominalPainFrequency: {
          value: number;
          sourceData: string;
          clinicalGap: string;
        };
        bloatingSeverity: {
          value: number;
          sourceData: string;
          clinicalGap: string;
        };
        bowelHabitDissatisfaction: {
          value: number | null;
          sourceData: string;
          clinicalGap: string;
        };
        lifeInterference: {
          value: number | null;
          sourceData: string;
          clinicalGap: string;
        };
        totalScore: {
          value: number;
          interpretation: string;
        };
      };
      bristolStoolScale: {
        value: number;
        sourceData: string;
        interpretation: string;
        narrativeSummary: string;
      };
      ibsSubtype: {
        classification: "IBS-C" | "IBS-D" | "IBS-M" | "IBS-U";
        reasoning: string;
        confidenceLevel: string;
        narrativeSummary: string;
      };
    };
    missingInformation: {
      narrativeSummary: string;
      criticalGaps: string[];
      recommendedAssessments: string[];
    };
    clinicalRecommendations: {
      narrativeSummary: string;
      immediateActions: string[];
      suggestedLabTests: string[];
      dataCollectionNeeded: string[];
    };
    reliabilityAssessment: {
      narrativeSummary: string;
      limitingFactors: string[];
      confidenceLevel: string;
    };
  };
}

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isDarkMode: boolean;
}> = ({ title, icon, children, isDarkMode }) => (
  <div
    className={`rounded-xl border p-6 ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}
  >
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3
        className={`text-lg font-semibold ${
          isDarkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const ScoreIndicator: React.FC<{
  label: string;
  value: number | null;
  maxValue: number;
  isDarkMode: boolean;
}> = ({ label, value, maxValue, isDarkMode }) => {
  if (value === null) return null;

  const percentage = (value / maxValue) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {value}/{maxValue}
        </span>
      </div>
      <div
        className={`w-full h-2 rounded-full ${
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ListSection: React.FC<{
  items: string[];
  isDarkMode: boolean;
}> = ({ items, isDarkMode }) => (
  <ul className="space-y-2">
    {items?.map((item, index) => (
      <li
        key={index}
        className={`flex items-start gap-2 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        <span className="mt-1">•</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const IBSAnalysisDashboard: React.FC<IBSAnalysisProps> = ({
  isDarkMode,
  analysis,
}) => {
  return (
    <div className="space-y-6">
      <h2
        className={`text-xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        IBS Analysis Based on ROME IV Criteria
      </h2>
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className={`rounded-xl border p-6 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`p-3 rounded-lg inline-block ${
              isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
            }`}
          >
            <Activity
              className={isDarkMode ? "text-blue-400" : "text-blue-600"}
              size={24}
            />
          </div>
          <h3
            className={`mt-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            IBS-SSS Score
          </h3>
          <p
            className={`text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            {analysis?.clinicalAssessment?.ibsSSS?.totalScore?.value
              ? analysis?.clinicalAssessment?.ibsSSS?.totalScore?.value
              : null}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {analysis?.clinicalAssessment?.ibsSSS?.totalScore?.interpretation
              ? analysis?.clinicalAssessment?.ibsSSS?.totalScore?.interpretation
              : "N/A"}
          </p>
        </div>

        <div
          className={`rounded-xl border p-6 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`p-3 rounded-lg inline-block ${
              isDarkMode ? "bg-green-900/30" : "bg-green-50"
            }`}
          >
            <ClipboardList
              className={isDarkMode ? "text-green-400" : "text-green-600"}
              size={24}
            />
          </div>
          <h3
            className={`mt-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Bristol Stool Scale
          </h3>
          <p
            className={`text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            {analysis?.clinicalAssessment?.bristolStoolScale?.value
              ? `Type: ${analysis?.clinicalAssessment?.bristolStoolScale?.value}`
              : null}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {analysis?.clinicalAssessment?.bristolStoolScale?.interpretation ||
              "N/A"}
          </p>
        </div>

        <div
          className={`rounded-xl border p-6 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`p-3 rounded-lg inline-block ${
              isDarkMode ? "bg-purple-900/30" : "bg-purple-50"
            }`}
          >
            <Brain
              className={isDarkMode ? "text-purple-400" : "text-purple-600"}
              size={24}
            />
          </div>
          <h3
            className={`mt-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            IBS Subtype
          </h3>
          <p
            className={`text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            {analysis?.clinicalAssessment?.ibsSubtype?.classification
              ? analysis?.clinicalAssessment?.ibsSubtype?.classification
              : null}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {analysis?.clinicalAssessment?.ibsSubtype?.confidenceLevel
              ? `${analysis?.clinicalAssessment?.ibsSubtype?.confidenceLevel} confidence`
              : "N/A"}
          </p>
        </div>

        <div
          className={`rounded-xl border p-6 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`p-3 rounded-lg inline-block ${
              isDarkMode ? "bg-orange-900/30" : "bg-orange-50"
            }`}
          >
            <AlertTriangle
              className={isDarkMode ? "text-orange-400" : "text-orange-600"}
              size={24}
            />
          </div>
          <h3
            className={`mt-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            ROME IV Criteria
          </h3>
          <p
            className={`text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-900"
            }`}
          >
            {analysis?.clinicalAssessment?.romeIVCriteriaMet
              ? "Met"
              : "Not Met"}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {analysis?.clinicalAssessment?.romeIVCriteriaMet
              ? "Criteria satisfied"
              : "Further evaluation needed"}
          </p>
        </div>
      </div>

      {/* Overall Summary */}
      <SectionCard
        title="Overall Assessment"
        icon={
          <Info
            className={isDarkMode ? "text-blue-400" : "text-blue-600"}
            size={24}
          />
        }
        isDarkMode={isDarkMode}
      >
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          {analysis?.overallNarrativeSummary
            ? analysis?.overallNarrativeSummary
            : "None"}
        </p>
      </SectionCard>

      {/* Reliability Assessment */}
      <SectionCard
        title="Reliability Assessment"
        icon={
          <Scale
            className={isDarkMode ? "text-blue-400" : "text-blue-600"}
            size={24}
          />
        }
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {analysis?.reliabilityAssessment?.narrativeSummary
              ? analysis?.reliabilityAssessment?.narrativeSummary
              : "None"}
          </p>
          <div>
            <h4
              className={`font-medium mb-2 ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Limiting Factors
            </h4>
            <ListSection
              items={analysis?.reliabilityAssessment?.limitingFactors}
              isDarkMode={isDarkMode}
            />
          </div>
          {analysis?.reliabilityAssessment?.confidenceLevel && (
            <div>
              <h4
                className={`font-medium mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Confidence Level
              </h4>
              <p
                className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {analysis?.reliabilityAssessment?.confidenceLevel}
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* IBS-SSS Detail Scores */}
      <SectionCard
        title="IBS-SSS Components"
        icon={
          <Activity
            className={isDarkMode ? "text-blue-400" : "text-blue-600"}
            size={24}
          />
        }
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <ScoreIndicator
            label="Abdominal Pain Severity"
            value={
              analysis?.clinicalAssessment?.ibsSSS?.abdominalPainSeverity?.value
            }
            maxValue={100}
            isDarkMode={isDarkMode}
          />
          <ScoreIndicator
            label="Abdominal Pain Frequency"
            value={
              analysis?.clinicalAssessment?.ibsSSS?.abdominalPainFrequency
                ?.value
            }
            maxValue={100}
            isDarkMode={isDarkMode}
          />
          <ScoreIndicator
            label="Bloating Severity"
            value={
              analysis?.clinicalAssessment?.ibsSSS?.bloatingSeverity?.value
            }
            maxValue={100}
            isDarkMode={isDarkMode}
          />
          <ScoreIndicator
            label="Bowel Habit Dissatisfaction"
            value={
              analysis?.clinicalAssessment?.ibsSSS?.bowelHabitDissatisfaction
                ?.value
            }
            maxValue={100}
            isDarkMode={isDarkMode}
          />
          <ScoreIndicator
            label="Life Interference"
            value={
              analysis?.clinicalAssessment?.ibsSSS?.lifeInterference?.value
            }
            maxValue={100}
            isDarkMode={isDarkMode}
          />
        </div>
      </SectionCard>

      {/* Clinical Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          title="Clinical Recommendations"
          icon={
            <Stethoscope
              className={isDarkMode ? "text-green-400" : "text-green-600"}
              size={24}
            />
          }
          isDarkMode={isDarkMode}
        >
          <div className="space-y-4">
            <div>
              <h4
                className={`font-medium mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Clinical Summary
              </h4>
              <p
                className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                -{" "}
                {analysis?.clinicalRecommendations?.narrativeSummary || "None"}
              </p>
            </div>
            <div>
              <h4
                className={`font-medium mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Immediate Actions
              </h4>
              <ListSection
                items={analysis?.clinicalRecommendations?.immediateActions}
                isDarkMode={isDarkMode}
              />
            </div>
            <div>
              <h4
                className={`font-medium mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Suggested Lab Tests
              </h4>
              <ListSection
                items={analysis?.clinicalRecommendations?.suggestedLabTests}
                isDarkMode={isDarkMode}
              />
            </div>
            <div>
              <h4
                className={`font-medium mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Data Collections Needed
              </h4>
              <ListSection
                items={analysis?.clinicalRecommendations?.dataCollectionNeeded}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Missing Information"
          icon={
            <FileWarning
              className={isDarkMode ? "text-orange-400" : "text-orange-600"}
              size={24}
            />
          }
          isDarkMode={isDarkMode}
        >
          <div className="space-y-4">
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              {analysis?.missingInformation?.narrativeSummary}
            </p>
            <div>
              <h4
                className={`font-medium mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Critical Gaps
              </h4>
              <ListSection
                items={analysis?.missingInformation?.criticalGaps}
                isDarkMode={isDarkMode}
              />
            </div>

            <div>
              <h4
                className={`font-medium mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
              >
                Recommended Assessments
              </h4>
              <ListSection
                items={analysis?.missingInformation?.recommendedAssessments}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default IBSAnalysisDashboard;
