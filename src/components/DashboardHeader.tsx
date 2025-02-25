import { RefreshCw } from "lucide-react";

// src/components/DashboardHeader.tsx
interface DashboardHeaderProps {
    isDarkMode: boolean;
    onRefresh: () => void;
  }
  
  export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isDarkMode, onRefresh }) => (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div>
        <h1 className={`text-3xl font-bold ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          IBS Symptom Dashboard
        </h1>
        <p className={`mt-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Comprehensive patient IBS overview and AI analysis
        </p>
      </div>
      <button
        onClick={onRefresh}
        className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        } hover:shadow-md`}
      >
        <RefreshCw className="w-4 h-4" />
        <span>Refresh Dashboard</span>
      </button>
    </div>
  );