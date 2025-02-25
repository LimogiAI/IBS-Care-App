import React, { useState } from 'react';
import { UserCircle2, Stethoscope, Mail, Phone, MapPin, LogOut, BellDot, Moon, Sun } from 'lucide-react';

// Define the HeaderProps interface
interface HeaderProps {
  physicianName: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

// Profile Component
interface ProfileProps {
  physicianName: string;
  onLogout: () => void;
  isDarkMode: boolean;
}

const Profile: React.FC<ProfileProps> = ({ physicianName, onLogout, isDarkMode }) => {
  const [showProfile, setShowProfile] = useState(false);

  const mockProfile = {
    name: physicianName,
    title: "Medical Practitioner",
    specialty: "Gastroenterology",
    license: "MD-12345",
    email: "doc@ibscare.com",
    phone: "+1 (343) 960-1083",
    location: "117 Eltomo Pvt, Limoges, ON K0A 2M0",
    experience: "18 years",
    patients: 1200,
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="relative">
      <button
        onClick={handleProfileClick}
        className="flex items-center gap-4 pl-2 border-l border-gray-200 dark:border-gray-700"
      >
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
      </button>

      {showProfile && (
        <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } ring-1 ring-black ring-opacity-5 z-50`}>
          <div className="p-4">
            <div className={`flex items-center gap-3 border-b pb-3 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 p-[2px]">
                <div className={`h-full w-full rounded-full ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } flex items-center justify-center`}>
                  <UserCircle2 className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {mockProfile.name}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {mockProfile.title}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <Stethoscope className={`h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Specialty: {mockProfile.specialty}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className={`h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {mockProfile.email}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className={`h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {mockProfile.phone}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className={`h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {mockProfile.location}
                </p>
              </div>

              <div className={`grid grid-cols-2 gap-2 pt-2 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    License
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {mockProfile.license}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Experience
                  </p>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {mockProfile.experience}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className={`w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                isDarkMode
                  ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
              }`}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Header Component
const Header: React.FC<HeaderProps> = ({
  physicianName,
  onLogout,
  isDarkMode,
  onThemeToggle
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const mockNotifications = [
    { id: 1, message: "Patient John Doe diagnosed with IBS", time: "5 min ago" },
    { id: 2, message: "Dietary recommendations sent to John Doe", time: "15 min ago" },
    { id: 3, message: "Lab results ready for John Doe", time: "30 min ago" },
    { id: 4, message: "Prescription for Dicyclomine sent to pharmacy", time: "1 hour ago" },
    { id: 5, message: "Prescription for Dicyclomine sent to pharmacy", time: "2 hours ago" },
  ];

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleViewNotification = () => {
    setHasUnread(false);
    setShowNotifications(false);
  };

  return (
    <header className={`${
      isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-b transition-all duration-300 ease-in-out sticky top-0 z-50`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
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

          <div className="flex items-center gap-6">
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

            <div className="relative">
              <button 
                onClick={handleNotificationClick}
                className={`p-2 rounded-full transition-all duration-300 relative ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                    : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100'
                }`}
                aria-label="Notifications"
              >
                <BellDot className="h-5 w-5" />
                {hasUnread && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-72 rounded-md shadow-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className="py-1">
                    {mockNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={handleViewNotification}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          isDarkMode
                            ? 'text-gray-200 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <p>{notification.message}</p>
                        <p className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {notification.time}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Profile 
              physicianName={physicianName}
              onLogout={onLogout}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;