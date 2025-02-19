// // src/components/StatsCard.tsx
// import React from 'react';
// import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';

// interface StatsCardProps {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
//   trend?: 'up' | 'down';
//   trendValue?: string;
//   color: 'blue' | 'green' | 'purple' | 'orange';
//   isDarkMode: boolean;
// }

// export const StatsCard: React.FC<StatsCardProps> = ({
//   title,
//   value,
//   icon,
//   trend,
//   trendValue,
//   color,
//   isDarkMode,
// }) => {
//   const colorClasses = {
//     blue: {
//       bg: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50',
//       text: isDarkMode ? 'text-blue-400' : 'text-blue-600',
//       trend: isDarkMode ? 'text-blue-400' : 'text-blue-600',
//     },
//     green: {
//       bg: isDarkMode ? 'bg-green-900/30' : 'bg-green-50',
//       text: isDarkMode ? 'text-green-400' : 'text-green-600',
//       trend: isDarkMode ? 'text-green-400' : 'text-green-600',
//     },
//     purple: {
//       bg: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50',
//       text: isDarkMode ? 'text-purple-400' : 'text-purple-600',
//       trend: isDarkMode ? 'text-purple-400' : 'text-purple-600',
//     },
//     orange: {
//       bg: isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50',
//       text: isDarkMode ? 'text-orange-400' : 'text-orange-600',
//       trend: isDarkMode ? 'text-orange-400' : 'text-orange-600',
//     },
//   };

//   return (
//     <div className={`${
//       isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
//     } rounded-xl border p-6 transition-all duration-300 hover:shadow-lg`}>
//       <div className="flex items-center justify-between">
//         <div className={`${colorClasses[color].bg} p-3 rounded-lg`}>
//           <div className={colorClasses[color].text}>{icon}</div>
//         </div>
//         {trend && (
//           <div className={`flex items-center gap-1 text-sm ${
//             trend === 'up' ? 'text-green-500' : 'text-red-500'
//           }`}>
//             {trend === 'up' ? 
//               <ArrowUpRightIcon className="h-4 w-4" /> : 
//               <ArrowDownRightIcon className="h-4 w-4" />
//             }
//             <span>{trendValue}</span>
//           </div>
//         )}
//       </div>
//       <div className="mt-4">
//         <h3 className={`text-sm ${
//           isDarkMode ? 'text-gray-400' : 'text-gray-500'
//         }`}>{title}</h3>
//         <p className={`text-2xl font-semibold mt-1 ${
//           isDarkMode ? 'text-gray-200' : 'text-gray-900'
//         }`}>{value}</p>
//       </div>
//     </div>
//   );
// };


// src/components/StatsCard.tsx
import React from 'react';
import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | null;  // Allow null for trend
  trendValue?: string | null;
  color: 'blue' | 'green' | 'purple' | 'orange';
  isDarkMode: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color,
  isDarkMode,
}) => {
  const colorClasses = {
    blue: {
      bg: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50',
      text: isDarkMode ? 'text-blue-400' : 'text-blue-600',
      trend: isDarkMode ? 'text-blue-400' : 'text-blue-600',
    },
    green: {
      bg: isDarkMode ? 'bg-green-900/30' : 'bg-green-50',
      text: isDarkMode ? 'text-green-400' : 'text-green-600',
      trend: isDarkMode ? 'text-green-400' : 'text-green-600',
    },
    purple: {
      bg: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50',
      text: isDarkMode ? 'text-purple-400' : 'text-purple-600',
      trend: isDarkMode ? 'text-purple-400' : 'text-purple-600',
    },
    orange: {
      bg: isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50',
      text: isDarkMode ? 'text-orange-400' : 'text-orange-600',
      trend: isDarkMode ? 'text-orange-400' : 'text-orange-600',
    },
  };

  return (
    <div
      className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-xl border p-6 transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className={`${colorClasses[color].bg} p-3 rounded-lg`}>
          <div className={colorClasses[color].text}>
            {icon || <span>-</span>}
          </div>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRightIcon className="h-4 w-4" />
            ) : (
              <ArrowDownRightIcon className="h-4 w-4" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3
          className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-2xl font-semibold mt-1 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-900'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};
