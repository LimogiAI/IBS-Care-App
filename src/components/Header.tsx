import React from 'react';
import { UserCircle2, BellDot, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  physicianName: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  physicianName,
  onLogout,
  isDarkMode,
  onThemeToggle
}) => {
  return (
    <header className={`${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-b transition-all duration-300 ease-in-out sticky top-0 z-50`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  IBS
                </span>
                <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-900'} ml-2`}>
                  Care
                </span>
              </h1>
            </div>
          </div>

          {/* Right section - Navigation and Profile */}
          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? 'text-gray-400 hover:text-yellow-300 hover:bg-gray-800'
                  : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? 
                <Sun className="h-5 w-5 transition-transform hover:rotate-12" /> : 
                <Moon className="h-5 w-5 transition-transform hover:-rotate-12" />
              }
            </button>

            {/* Notification Bell */}
            <button 
              className={`p-2 rounded-full transition-all duration-300 relative ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                  : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
              }`}
              aria-label="Notifications"
            >
              <BellDot className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Section */}
            <div className="flex items-center gap-4 pl-2 border-l border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 p-[2px]">
                  <div className={`h-full w-full rounded-full ${
                    isDarkMode ? 'bg-gray-900' : 'bg-white'
                  } flex items-center justify-center`}>
                    <UserCircle2 className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {physicianName}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Medical Practitioner
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors duration-300 ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
                    : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;