// import { useState, type FC, type ReactNode } from "react";
// import { ChevronDown } from "lucide-react";
// import { LoadingIndicator } from "../LoadingIndicator";
// import { ErrorMessage } from "../ErrorMessage";
// import { FormattedCondition } from "../../hooks/useConditions";
// import { FormattedObservation } from "../../types/FHIRObservation";
// import { ParsedClinicalImpression } from "../../types/FHIRClinicalImpression";
// import { ParsedDiagnosticReport } from "../../types/FHIRDiagnosticReport";

// interface AccordionCardProps {
//   title: string;
//   children: ReactNode;
//   isDarkMode: boolean;
//   isOpen: boolean;
//   onToggle: () => void;
//   count: number;
// }

// interface ClinicalItemProps {
//   title: string;
//   value: string;
//   date: string;
//   isDarkMode: boolean;
// }

// interface ConditionsCardProps {
//   conditions: FormattedCondition[];
//   loading: boolean;
//   error: string | null;
//   isDarkMode: boolean;
// }

// interface ObservationsCardProps {
//   observations: FormattedObservation[];
//   loading: boolean;
//   error: string | null;
//   isDarkMode: boolean;
// }

// interface ClinicalImpressionCardProps {
//   impressions: ParsedClinicalImpression[];
//   loading: boolean;
//   error: string | null;
//   isDarkMode: boolean;
// }
// interface DiagnosticReportCardProps {
//   reports: ParsedDiagnosticReport[];
//   loading: boolean;
//   error: string | null;
//   isDarkMode: boolean;
// }
// interface ClinicalDataSectionProps {
//   conditions: FormattedCondition[];
//   conditionsLoading: boolean;
//   conditionsError: string | null;
//   observations: FormattedObservation[];
//   observationsLoading: boolean;
//   observationsError: string | null;
//   impressions: ParsedClinicalImpression[];
//   impressionsLoading: boolean;
//   impressionsError: string | null;
//   reports: ParsedDiagnosticReport[];
//   reportsLoading: boolean;
//   reportsError: string | null;
//   isDarkMode: boolean;
// }

// const AccordionCard: FC<AccordionCardProps> = ({
//   title,
//   children,
//   isDarkMode,
//   isOpen,
//   onToggle,
//   count,
// }) => {
//   return (
//     <div
//       className={`rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
//         isDarkMode ? "bg-gray-800" : "bg-white"
//       }`}
//     >
//       <button
//         onClick={onToggle}
//         className={`w-full px-8 py-5 flex justify-between items-center transition-colors ${
//           isDarkMode
//             ? "text-white hover:bg-gray-700"
//             : "text-gray-800 hover:bg-gray-50"
//         }`}
//       >
//         <div className="flex items-center gap-4">
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <span
//             className={`px-3 py-1 rounded-full text-sm ${
//               isDarkMode
//                 ? "bg-gray-700 text-gray-300"
//                 : "bg-gray-100 text-gray-600"
//             }`}
//           >
//             {count}
//           </span>
//         </div>
//         <div
//           className={`transform transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//         >
//           <ChevronDown size={24} />
//         </div>
//       </button>
//       <div
//         className={`overflow-hidden transition-all duration-200 ${
//           isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div
//           className={`p-6 overflow-y-auto max-h-96 ${
//             isDarkMode
//               ? "border-t border-gray-700 scrollbar-dark"
//               : "border-t border-gray-200"
//           }`}
//         >
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// const ClinicalItem: FC<ClinicalItemProps> = ({
//   title,
//   value,
//   date,
//   isDarkMode,
// }) => {
//   return (
//     <div
//       className={`p-4 rounded-lg transition-colors ${
//         isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
//       }`}
//     >
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
//         <div className="flex-1 min-w-0">
//           <h4
//             className={`font-medium text-base break-words ${
//               isDarkMode ? "text-white" : "text-gray-900"
//             }`}
//           >
//             {title}
//           </h4>
//           <p
//             className={`mt-2 text-sm break-words ${
//               isDarkMode ? "text-gray-400" : "text-gray-600"
//             }`}
//           >
//             {value}
//           </p>
//         </div>
//         <span
//           className={`text-sm shrink-0 ${
//             isDarkMode ? "text-gray-500" : "text-gray-400"
//           }`}
//         >
//           {new Date(date).toLocaleDateString()}
//         </span>
//       </div>
//     </div>
//   );
// };

// export const ConditionsCard: FC<ConditionsCardProps> = ({
//   conditions,
//   loading,
//   error,
//   isDarkMode,
// }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
//   if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
//   if (!conditions.length) return null;

//   return (
//     <AccordionCard
//       title="Conditions"
//       isDarkMode={isDarkMode}
//       isOpen={!isOpen}
//       onToggle={() => setIsOpen(!isOpen)}
//       count={conditions.length}
//     >
//       <div className="space-y-2">
//         {conditions.map((condition) => (
//           <ClinicalItem
//             key={condition.id}
//             title={condition.code}
//             value={`Status: ${condition.clinicalStatus}`}
//             date={condition.recordedDate}
//             isDarkMode={isDarkMode}
//           />
//         ))}
//       </div>
//     </AccordionCard>
//   );
// };

// export const ObservationsCard: FC<ObservationsCardProps> = ({
//   observations,
//   loading,
//   error,
//   isDarkMode,
// }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
//   if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
//   if (!observations.length) return null;

//   return (
//     <AccordionCard
//       title="Observations"
//       isDarkMode={isDarkMode}
//       isOpen={!isOpen}
//       onToggle={() => setIsOpen(!isOpen)}
//       count={observations.length}
//     >
//       <div className="space-y-2">
//         {observations.map((observation) => (
//           <ClinicalItem
//             key={observation.id}
//             title={observation.code}
//             value={observation.value}
//             date={observation.effectiveDateTime}
//             isDarkMode={isDarkMode}
//           />
//         ))}
//       </div>
//     </AccordionCard>
//   );
// };
// export const ClinicalImpressionCard: FC<ClinicalImpressionCardProps> = ({
//   impressions = [],
//   loading,
//   error,
//   isDarkMode,
// }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   console.log("ClinicalImpressionCard received impressions:", impressions);

//   if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
//   if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
//   if (!impressions.length) return null;

//   return (
//     <AccordionCard
//       title="Clinical Impressions"
//       isDarkMode={isDarkMode}
//       isOpen={!isOpen}
//       onToggle={() => setIsOpen(!isOpen)}
//       count={impressions.length}
//     >
//       <div className="space-y-2">
//         {impressions.map((clinicalimpression) => (
//           <ClinicalItem
//             key={clinicalimpression.id}
//             title={clinicalimpression.status}
//             value={clinicalimpression.description}
//             date={
//               clinicalimpression.effectiveDateTime ||
//               clinicalimpression.date ||
//               ""
//             }
//             isDarkMode={isDarkMode}
//           />
//         ))}
//       </div>
//     </AccordionCard>
//   );
// };

// export const DiagnosticReportsCard: FC<DiagnosticReportCardProps> = ({
//   reports = [],
//   loading,
//   error,
//   isDarkMode,
// }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   console.log("daignosticcard received diagnostic:", reports);

//   if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
//   if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
//   if (!reports.length) return null;

//   return (
//     <AccordionCard
//       title="Daignostic Report"
//       isDarkMode={isDarkMode}
//       isOpen={!isOpen}
//       onToggle={() => setIsOpen(!isOpen)}
//       count={reports.length}
//     >
//       <div className="space-y-2">
//         {reports.map((reports) => (
//           <ClinicalItem
//             key={reports.id}
//             title={reports.status}
//             value={reports.conclusion}
//             date={reports.effectiveDateTime || ""}
//             isDarkMode={isDarkMode}
//           />
//         ))}
//       </div>
//     </AccordionCard>
//   );
// };

// export const ClinicalDataSection: FC<ClinicalDataSectionProps> = ({
//   conditions,
//   conditionsLoading,
//   conditionsError,
//   observations,
//   observationsLoading,
//   observationsError,
//   impressions,
//   impressionsLoading,
//   impressionsError,
//   reports,
//   reportsLoading,
//   reportsError,
//   isDarkMode,
// }) => {
//   console.log(
//     "Clinical Impressions received in ClinicalDataSection:",
//     impressions
//   );
//   return (
//     <section className="col-span-full">
//       <h2
//         className={`text-xl font-bold mb-6 ${
//           isDarkMode ? "text-white" : "text-gray-900"
//         }`}
//       >
//         Clinical Data from EHR
//       </h2>
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//         <div className="w-full min-w-0">
//           <ConditionsCard
//             conditions={conditions}
//             loading={conditionsLoading}
//             error={conditionsError}
//             isDarkMode={isDarkMode}
//           />
//         </div>
//         <div className="w-full min-w-0">
//           <ObservationsCard
//             observations={observations}
//             loading={observationsLoading}
//             error={observationsError}
//             isDarkMode={isDarkMode}
//           />
//         </div>
//         <div className="w-full min-w-0">
//           <ClinicalImpressionCard
//             impressions={impressions || []}
//             loading={impressionsLoading}
//             error={impressionsError}
//             isDarkMode={isDarkMode}
//           />
//         </div>
//         <div className="w-full min-w-0">
//           <DiagnosticReportsCard
//             reports={reports || []}
//             loading={reportsLoading}
//             error={reportsError}
//             isDarkMode={isDarkMode}
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ClinicalDataSection;

// src/components/clinical/ClinicalDataComponents.tsx
import { useState, type FC, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { LoadingIndicator } from "../LoadingIndicator";
import { ErrorMessage } from "../ErrorMessage";
import { FormattedCondition } from "../../hooks/useConditions";
import { FormattedObservation } from "../../types/FHIRObservation";
import { ParsedClinicalImpression } from "../../types/FHIRClinicalImpression";
import { ParsedDiagnosticReport } from "../../types/FHIRDiagnosticReport";
import { ParsedQuestionnaireResponse } from "../../types/FHIRQuestionnaireResponse";

interface AccordionCardProps {
  title: string;
  children: ReactNode;
  isDarkMode: boolean;
  isOpen: boolean;
  onToggle: () => void;
  count: number;
}

interface ClinicalItemProps {
  title: string;
  value: string;
  date: string;
  isDarkMode: boolean;
}

interface ConditionsCardProps {
  conditions: FormattedCondition[];
  loading: boolean;
  error: string | null;
  isDarkMode: boolean;
}

interface ObservationsCardProps {
  observations: FormattedObservation[];
  loading: boolean;
  error: string | null;
  isDarkMode: boolean;
}

interface ClinicalImpressionCardProps {
  impressions: ParsedClinicalImpression[];
  loading: boolean;
  error: string | null;
  isDarkMode: boolean;
}

interface DiagnosticReportCardProps {
  reports: ParsedDiagnosticReport[];
  loading: boolean;
  error: string | null;
  isDarkMode: boolean;
}

interface QuestionnaireResponsesCardProps {
  responses: ParsedQuestionnaireResponse[];
  loading: boolean;
  error: string | null;
  isDarkMode: boolean;
}

interface ClinicalDataSectionProps {
  conditions: FormattedCondition[];
  conditionsLoading: boolean;
  conditionsError: string | null;
  observations: FormattedObservation[];
  observationsLoading: boolean;
  observationsError: string | null;
  impressions: ParsedClinicalImpression[];
  impressionsLoading: boolean;
  impressionsError: string | null;
  reports: ParsedDiagnosticReport[];
  reportsLoading: boolean;
  reportsError: string | null;
  responses: ParsedQuestionnaireResponse[];
  responsesLoading: boolean;
  responsesError: string | null;
  isDarkMode: boolean;
}

const AccordionCard: FC<AccordionCardProps> = ({
  title,
  children,
  isDarkMode,
  isOpen,
  onToggle,
  count,
}) => {
  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden transition-all duration-200 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full px-8 py-5 flex justify-between items-center transition-colors ${
          isDarkMode
            ? "text-white hover:bg-gray-700"
            : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {count}
          </span>
        </div>
        <div
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={24} />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`p-6 overflow-y-auto max-h-96 ${
            isDarkMode
              ? "border-t border-gray-700 scrollbar-dark"
              : "border-t border-gray-200"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const ClinicalItem: FC<ClinicalItemProps> = ({
  title,
  value,
  date,
  isDarkMode,
}) => {
  return (
    <div
      className={`p-4 rounded-lg transition-colors ${
        isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium text-base break-words ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h4>
          <p
            className={`mt-2 text-sm break-words ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {value}
          </p>
        </div>
        <span
          className={`text-sm shrink-0 ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {date ? new Date(date).toLocaleDateString() : "Unknown Date"}
        </span>
      </div>
    </div>
  );
};

export const ConditionsCard: FC<ConditionsCardProps> = ({
  conditions,
  loading,
  error,
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
  if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
  if (!conditions.length) return null;

  return (
    <AccordionCard
      title="Conditions"
      isDarkMode={isDarkMode}
      isOpen={!isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      count={conditions.length}
    >
      <div className="space-y-2">
        {conditions.map((condition) => (
          <ClinicalItem
            key={condition.id}
            title={condition.code}
            value={`Status: ${condition.clinicalStatus}`}
            date={condition.recordedDate}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </AccordionCard>
  );
};

export const ObservationsCard: FC<ObservationsCardProps> = ({
  observations,
  loading,
  error,
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
  if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
  if (!observations.length) return null;

  return (
    <AccordionCard
      title="Observations"
      isDarkMode={isDarkMode}
      isOpen={!isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      count={observations.length}
    >
      <div className="space-y-2">
        {observations.map((observation) => (
          <ClinicalItem
            key={observation.id}
            title={observation.code}
            value={observation.value}
            date={observation.effectiveDateTime}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </AccordionCard>
  );
};

export const ClinicalImpressionCard: FC<ClinicalImpressionCardProps> = ({
  impressions = [],
  loading,
  error,
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
  if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
  if (!impressions.length) return null;

  return (
    <AccordionCard
      title="Clinical Impressions"
      isDarkMode={isDarkMode}
      isOpen={!isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      count={impressions.length}
    >
      <div className="space-y-2">
        {impressions.map((clinicalimpression) => (
          <ClinicalItem
            key={clinicalimpression.id}
            title={clinicalimpression.status}
            value={clinicalimpression.description}
            date={
              clinicalimpression.effectiveDateTime ||
              clinicalimpression.date ||
              ""
            }
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </AccordionCard>
  );
};

export const DiagnosticReportsCard: FC<DiagnosticReportCardProps> = ({
  reports = [],
  loading,
  error,
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
  if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
  if (!reports.length) return null;

  return (
    <AccordionCard
      title="Diagnostic Reports"
      isDarkMode={isDarkMode}
      isOpen={!isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      count={reports.length}
    >
      <div className="space-y-2">
        {reports.map((report) => (
          <ClinicalItem
            key={report.id}
            title={report.status}
            value={report.conclusion}
            date={report.effectiveDateTime || ""}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </AccordionCard>
  );
};

export const QuestionnaireResponsesCard: FC<QuestionnaireResponsesCardProps> = ({
  responses = [],
  loading,
  error,
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (loading) return <LoadingIndicator isDarkMode={isDarkMode} />;
  if (error) return <ErrorMessage message={error} isDarkMode={isDarkMode} />;
  if (!responses.length) return null;

  return (
    <AccordionCard
      title="Rome IV Questionnaire Responses"
      isDarkMode={isDarkMode}
      isOpen={!isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      count={responses.length}
    >
      <div className="space-y-4">
        {responses.map((response) => (
          <div key={response.id} className="space-y-2">
            <p
              className={`text-sm font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Submitted: {response.encounterPeriodStart ? new Date(response.encounterPeriodStart).toLocaleString() : "Unknown"}
            </p>
            {response.questions.map((q) => (
              <ClinicalItem
                key={q.linkId}
                title={q.questionText}
                value={q.answers.join(", ") || "No answer"}
                date={response.encounterPeriodStart || ""}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        ))}
      </div>
    </AccordionCard>
  );
};

export const ClinicalDataSection: FC<ClinicalDataSectionProps> = ({
  conditions,
  conditionsLoading,
  conditionsError,
  observations,
  observationsLoading,
  observationsError,
  impressions,
  impressionsLoading,
  impressionsError,
  reports,
  reportsLoading,
  reportsError,
  responses,
  responsesLoading,
  responsesError,
  isDarkMode,
}) => {
  return (
    <section className="col-span-full">
      <h2
        className={`text-xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Clinical Data from EHR
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="w-full min-w-0">
          <ConditionsCard
            conditions={conditions}
            loading={conditionsLoading}
            error={conditionsError}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="w-full min-w-0">
          <ObservationsCard
            observations={observations}
            loading={observationsLoading}
            error={observationsError}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="w-full min-w-0">
          <ClinicalImpressionCard
            impressions={impressions || []}
            loading={impressionsLoading}
            error={impressionsError}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="w-full min-w-0">
          <DiagnosticReportsCard
            reports={reports || []}
            loading={reportsLoading}
            error={reportsError}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="w-full min-w-0 col-span-1 xl:col-span-2">
          <QuestionnaireResponsesCard
            responses={responses || []}
            loading={responsesLoading}
            error={responsesError}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </section>
  );
};

export default ClinicalDataSection;