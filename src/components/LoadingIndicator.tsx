// src/components/LoadingIndicator.tsx
interface LoadingIndicatorProps {
    isDarkMode: boolean;
  }
  
  export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isDarkMode }) => (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>
    </div>
  );