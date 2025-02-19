import React from 'react';
import { IBSAssessment } from '../types/ibs';
import { Activity, AlertTriangle, Brain, ClipboardList } from 'lucide-react';

interface DetailedAnalysisProps {
  isDarkMode: boolean;
  analysis: IBSAssessment;
}

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ isDarkMode, analysis }) => {
  const textColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const sectionBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className="space-y-8">
      {/* Narrative Summary */}
      <div className={`${sectionBg} ${borderColor} rounded-lg border p-6`}>
        <div className="mb-4">
          <h3 className={`flex items-center gap-2 text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            <Brain className="h-5 w-5" />
            Overall Assessment
          </h3>
        </div>
        <p className={textColor}>{analysis.overallNarrativeSummary}</p>
      </div>

      {/* Clinical Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* IBS-SSS Scoring */}
        <div className={`${sectionBg} ${borderColor} rounded-lg border p-6`}>
          <div className="mb-4">
            <h3 className={`flex items-center gap-2 text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              <Activity className="h-5 w-5" />
              IBS-SSS Components
            </h3>
          </div>
          <div className="space-y-4">
            {Object.entries(analysis.clinicalAssessment.ibsSSS)
              .filter(([key]) => key !== 'narrativeSummary' && key !== 'totalScore')
              .map(([key, value]: [string, any]) => (
                <div key={key} className="border-b last:border-b-0 pb-3">
                  <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className={`${textColor} mb-2`}>Score: {value.value}</p>
                  {value.clinicalGap && (
                    <div className="flex items-start gap-2 p-3 bg-red-100/10 border border-red-200/20 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{value.clinicalGap}</p>
                    </div>
                  )}
                </div>
              ))}
            <div className="mt-4 pt-4 border-t">
              <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Total Score
              </h4>
              <p className={`${textColor} text-lg font-semibold`}>
                {analysis.clinicalAssessment.ibsSSS.totalScore.value} 
                <span className="text-sm font-normal ml-2">
                  ({analysis.clinicalAssessment.ibsSSS.totalScore.interpretation})
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bristol Stool Scale and IBS Subtype */}
        <div className={`${sectionBg} ${borderColor} rounded-lg border p-6`}>
          <div className="mb-4">
            <h3 className={`flex items-center gap-2 text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              <ClipboardList className="h-5 w-5" />
              Classification Details
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Bristol Stool Scale
              </h4>
              <p className={textColor}>Type: {analysis.clinicalAssessment.bristolStoolScale.value}</p>
              <p className={`${textColor} mt-1`}>
                {analysis.clinicalAssessment.bristolStoolScale.interpretation}
              </p>
            </div>
            
            <div>
              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                IBS Subtype
              </h4>
              <div className="space-y-2">
                <p className={`${textColor} font-medium`}>
                  Classification: {analysis.clinicalAssessment.ibsSubtype.classification}
                </p>
                <p className={textColor}>
                  Confidence: {analysis.clinicalAssessment.ibsSubtype.confidenceLevel}
                </p>
                <p className={textColor}>
                  {analysis.clinicalAssessment.ibsSubtype.reasoning}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className={`${sectionBg} ${borderColor} rounded-lg border p-6`}>
        <div className="mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            Clinical Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Immediate Actions
            </h4>
            <ul className={`${textColor} space-y-2`}>
              {analysis.clinicalRecommendations.immediateActions.map((action, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Suggested Lab Tests
            </h4>
            <ul className={`${textColor} space-y-2`}>
              {analysis.clinicalRecommendations.suggestedLabTests.map((test, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{test}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Required Data Collection
            </h4>
            <ul className={`${textColor} space-y-2`}>
              {analysis.clinicalRecommendations.dataCollectionNeeded.map((data, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{data}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Missing Information */}
      <div className={`${sectionBg} ${borderColor} rounded-lg border p-6`}>
        <div className="mb-4">
          <h3 className={`flex items-center gap-2 text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            <AlertTriangle className="h-5 w-5" />
            Data Gaps & Reliability
          </h3>
        </div>
        <div className="space-y-4">
          <p className={textColor}>{analysis.missingInformation.narrativeSummary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Critical Gaps
              </h4>
              <ul className={`${textColor} space-y-2`}>
                {analysis.missingInformation.criticalGaps.map((gap, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                Recommended Assessments
              </h4>
              <ul className={`${textColor} space-y-2`}>
                {analysis.missingInformation.recommendedAssessments.map((assessment, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{assessment}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysis;