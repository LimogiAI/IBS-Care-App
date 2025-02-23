import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Header from "./components/Header";
import PatientCard from "./components/PatientCard";
import { DashboardHeader } from "./components/DashboardHeader";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { ErrorMessage } from "./components/ErrorMessage";
import { useTheme } from "./hooks/useTheme";
import { usePatient } from "./hooks/usePatient";
import { useConditions } from "./hooks/useConditions";
import { useObservations } from "./hooks/useObservations";
import { useClinicalImpressions } from "./hooks/useClinicalImpressions";
import { useDiagnosticReports } from "./hooks/useDiagnosticReports";
import { useIBSAnalysis } from "./hooks/useIBSAnalysis";
import { fetchUserInfo } from "./services/userService";
import { UserProfile } from "oidc-client-ts";
import { computeAge } from "./utils/ibsAnalysis";
import ClinicalDataSection from "./components/clinical/ClinicalDataComponents";
import IBSAnalysisDashboard from "./components/IBSAnalysisDashboard";
import RomeIVQuestionnaire from "./components/RomeIVQuestionnaire";


const Dashboard: React.FC = () => {
  const { isDarkMode, handleThemeToggle } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const accessToken = sessionStorage.getItem("access_token") || "";
  const patientId = sessionStorage.getItem("patientId") || "";

  useEffect(() => {
    if (!accessToken || !patientId) {
      navigate("/launch");
    }
  }, [accessToken, patientId, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const userInfoData = await fetchUserInfo(accessToken);
          setUser(userInfoData);
        } catch (err) {
          console.error("Error fetching user info:", err);
        }
      }
    };
    fetchUser();
  }, [accessToken]);

  const {
    patient,
    loading: patientLoading,
    error: patientError,
  } = usePatient(accessToken, patientId, refreshKey);

  const {
    conditions,
    loading: conditionsLoading,
    error: conditionsError,
  } = useConditions(accessToken, patientId, refreshKey);

  const {
    observations,
    loading: observationsLoading,
    error: observationsError,
  } = useObservations(accessToken, patientId, refreshKey);

  const {
    impressions,
    loading: ImpressionsLoading,
    error: ImpressionsError,
  } = useClinicalImpressions(accessToken, patientId, refreshKey);
  
  const {
    reports,
    loading: reportsLoading,
    error: reportsError,
  } = useDiagnosticReports(accessToken, patientId, refreshKey);

  // Construct processed FHIR data for analysis
  const processedFHIRData = useMemo(() => {
    if (
      !patient ||
      patientLoading ||
      conditionsLoading ||
      observationsLoading
    ) {
      return null; // Wait until all data is fully loaded
    }
    return {
      patient: {
        id: patient.id,
        gender: patient.gender,
        age: patient.birthDate ? computeAge(patient.birthDate) : undefined,
      },
      relevantConditions: conditions.map((cond) => ({
        code: cond.code,
        display: cond.code,
        onset: cond.recordedDate,
        status: cond.clinicalStatus,
      })),
      relevantObservations: observations.map((observation) => ({
        id: observation.id,
        code: observation.code,
        value: observation.value,
        effectiveDateTime: observation.effectiveDateTime,
      })),
    };
  }, [
    patient,
    conditions,
    observations,
    patientLoading,
    conditionsLoading,
    observationsLoading,
  ]);

  console.log({ processedFHIRData }, "Processed FHIR Data for AI");

  // Use the IBS Analysis hook only when data is ready
  const {
    analysis,
    loading: analysisLoading,
    error: analysisError,
  } = useIBSAnalysis(processedFHIRData);

  const handleLogout = async () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("patientId");
    navigate("/launch");
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header
        physicianName={user?.name || "Physician"}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <DashboardHeader isDarkMode={isDarkMode} onRefresh={handleRefresh} />

        {/* Patient Demographics Section */}
        <section className="mb-8">
          {patientLoading ? (
            <LoadingIndicator isDarkMode={isDarkMode} />
          ) : patientError ? (
            <ErrorMessage message={patientError} isDarkMode={isDarkMode} />
          ) : patient ? (
            <PatientCard
              fullName={patient.fullName}
              gender={patient.gender}
              birthDate={patient.birthDate}
              address={patient.address || "N/A"}
              contact={patient.contact || "N/A"}
              isDarkMode={isDarkMode}
            />
          ) : (
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              No patient data available.
            </p>
          )}
        </section>

        {/* Clinical Data Section */}
        <section className="mb-8">
          <ClinicalDataSection
            conditions={conditions}
            conditionsLoading={conditionsLoading}
            conditionsError={conditionsError}
            observations={observations}
            observationsLoading={observationsLoading}
            observationsError={observationsError}
            impressions={impressions}  // ✅ Ensure impressions are passed
            impressionsLoading={ImpressionsLoading}
            impressionsError={ImpressionsError}
  reports={reports}  // ✅ Ensure reports are passed
  reportsLoading={reportsLoading}
  reportsError={reportsError}
            isDarkMode={isDarkMode}
          />
        </section>

        {/* IBS Analysis Dashboard */}
        {processedFHIRData && (
          <section className="mb-8">
            {analysisLoading ? (
              <LoadingIndicator isDarkMode={isDarkMode} />
            ) : analysisError ? (
              <ErrorMessage message={analysisError} isDarkMode={isDarkMode} />
            ) : analysis ? (
              <IBSAnalysisDashboard
                isDarkMode={isDarkMode}
                analysis={analysis}
              />
            ) : null}
          </section>
        )}

        {/* Rome IV Questionnaire Section */}
        {!analysisLoading &&
        !analysis?.clinicalAssessment?.romeIVCriteriaMet ? (
          <section className="mb-8">
            <Card
              className={`p-6 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    IBS Assessment
                  </h2>
                  <p
                    className={`mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Complete the Rome IV criteria questionnaire for IBS
                    diagnosis
                  </p>
                </div>
                <RomeIVQuestionnaire isDarkMode={isDarkMode} />
              </div>
            </Card>
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default Dashboard;
