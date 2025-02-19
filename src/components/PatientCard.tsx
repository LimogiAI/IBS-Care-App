import React from "react";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";

interface PatientCardProps {
  fullName: string;
  gender: string;
  birthDate: string;
  address: string;
  contact: string;
  isDarkMode: boolean;
  isLoading?: boolean;
  error?: string;
}

const PatientCard: React.FC<PatientCardProps> = ({
  fullName,
  gender,
  birthDate,
  address,
  contact,
  isDarkMode,
  isLoading = false,
  error,
}) => {
  const patientId = sessionStorage.getItem("patientId") || "Nil";

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const handleSendMessage = () => {
    // Implement message functionality
    console.log("Send message to:", contact);
  };

  const handleSendEmail = () => {
    // Implement email functionality
    console.log("Send email to patient:", fullName);
  };

  if (error) {
    return (
      <div className={`${
        isDarkMode ? "bg-gray-800 text-red-400" : "bg-white text-red-600"
      } rounded-xl border p-8 flex items-center justify-center`}>
        <p>Error loading patient data: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} 
        rounded-xl border p-8 animate-pulse`}>
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-2xl bg-gray-300"></div>
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gray-300"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    } rounded-xl border overflow-hidden transition-all duration-300 ease-in-out 
    hover:shadow-lg transform hover:-translate-y-1 group`}>
      <div className="p-8">
        {/* Header Section with Actions */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 p-[2px]
                group-hover:from-blue-500 group-hover:to-teal-400 transition-colors duration-300">
                <div className={`h-full w-full rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } flex items-center justify-center`}>
                  <User className="h-10 w-10 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                {fullName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-800"
                }`}>
                  Patient ID: {patientId}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSendMessage}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              } group`}
              title="Send Message"
            >
              <MessageSquare className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              onClick={handleSendEmail}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              } group`}
              title="Send Email"
            >
              <Mail className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <InfoItem
              icon={<User className="h-5 w-5" />}
              label="Gender"
              value={capitalizeFirstLetter(gender)}
              isDarkMode={isDarkMode}
              color="blue"
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5" />}
              label="Date of Birth"
              value={new Date(birthDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              isDarkMode={isDarkMode}
              color="purple"
            />
          </div>

          <div className="space-y-6">
            <InfoItem
              icon={<MapPin className="h-5 w-5" />}
              label="Address"
              value={address}
              isDarkMode={isDarkMode}
              color="teal"
            />
            <InfoItem
              icon={<Phone className="h-5 w-5" />}
              label="Contact"
              value={contact}
              isDarkMode={isDarkMode}
              color="indigo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDarkMode: boolean;
  color: "blue" | "purple" | "teal" | "indigo";
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  isDarkMode,
  color,
}) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: isDarkMode ? "bg-blue-900/30" : "bg-blue-50",
        text: isDarkMode ? "text-blue-400" : "text-blue-600",
      },
      purple: {
        bg: isDarkMode ? "bg-purple-900/30" : "bg-purple-50",
        text: isDarkMode ? "text-purple-400" : "text-purple-600",
      },
      teal: {
        bg: isDarkMode ? "bg-teal-900/30" : "bg-teal-50",
        text: isDarkMode ? "text-teal-400" : "text-teal-600",
      },
      indigo: {
        bg: isDarkMode ? "bg-indigo-900/30" : "bg-indigo-50",
        text: isDarkMode ? "text-indigo-400" : "text-indigo-600",
      },
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="flex items-center gap-4">
      <div className={`h-10 w-10 rounded-lg ${colorClasses.bg} 
        flex items-center justify-center transition-colors duration-300`}>
        <div className={colorClasses.text}>{icon}</div>
      </div>
      <div>
        <p className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}>
          {label}
        </p>
        <p className={`text-sm font-medium ${
          isDarkMode ? "text-gray-200" : "text-gray-900"
        }`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default PatientCard;