// src/components/ErrorMessage.tsx
interface ErrorMessageProps {
    message: string;
    isDarkMode: boolean;
  }
  
  export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, isDarkMode }) => (
    <div className={`p-4 ${
      isDarkMode ? 'bg-red-900/50 border-red-800' : 'bg-red-50 border-red-200'
    } border rounded-lg`}>
      <p className={isDarkMode ? 'text-red-300' : 'text-red-600'}>{message}</p>
    </div>
  );
  