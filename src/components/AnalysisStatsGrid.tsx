// src/components/AnalysisStatsGrid.tsx
import React from 'react';
import { StatsCard } from './StatsCard';
import { IBSAssessment } from '../types/ibs';

interface AnalysisStatsGridProps {
  isDarkMode: boolean;
  analysis: IBSAssessment;
}

export const AnalysisStatsGrid: React.FC<AnalysisStatsGridProps> = ({ isDarkMode, analysis }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatsCard
      title="Total IBS-SSS Score"
      value={`${analysis.clinicalAssessment.ibsSSS.totalScore.value || 'N/A'} (${analysis.clinicalAssessment.ibsSSS.totalScore.interpretation || 'N/A'})`}
      icon={null} // Optionally, replace null with an appropriate icon component
      trend={null}
      trendValue={null}
      color="blue"
      isDarkMode={isDarkMode}
    />
    <StatsCard
      title="Bristol Stool Scale"
      value={`${analysis.clinicalAssessment.bristolStoolScale.value} (${analysis.clinicalAssessment.bristolStoolScale.interpretation || 'N/A'})`}
      icon={null}
      trend={null}
      trendValue={null}
      color="green"
      isDarkMode={isDarkMode}
    />
    <StatsCard
      title="IBS Subtype"
      value={analysis.clinicalAssessment.ibsSubtype.classification || 'N/A'}
      icon={null}
      trend={null}
      trendValue={null}
      color="purple"
      isDarkMode={isDarkMode}
    />
    <StatsCard
      title="ROME IV Criteria"
      value={analysis.clinicalAssessment.romeIVCriteriaMet ? 'Met' : 'Not Met'}
      icon={null}
      trend={null}
      trendValue={null}
      color="orange"
      isDarkMode={isDarkMode}
    />
  </div>
);
