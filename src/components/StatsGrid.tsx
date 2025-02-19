// src/components/StatsGrid.tsx
import { Activity, Pill, ArrowUpRightIcon } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface StatsGridProps {
  isDarkMode: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ isDarkMode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatsCard
      title="Symptom Score"
      value="245"
      icon={<Activity className="h-6 w-6" />}
      trend="down"
      trendValue="12%"
      color="blue"
      isDarkMode={isDarkMode}
    />
    <StatsCard
      title="Medication Adherence"
      value="87%"
      icon={<Pill className="h-6 w-6" />}
      trend="up"
      trendValue="8%"
      color="green"
      isDarkMode={isDarkMode}
    />
    <StatsCard
      title="Pain Episodes"
      value="3"
      icon={<Activity className="h-6 w-6" />}
      color="purple"
      isDarkMode={isDarkMode}
    />
    <StatsCard
      title="Treatment Progress"
      value="75%"
      icon={<ArrowUpRightIcon className="h-6 w-6" />}
      trend="up"
      trendValue="5%"
      color="orange"
      isDarkMode={isDarkMode}
    />
  </div>
);
