import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "./services/authService";
import { fetchFHIRResource } from "./utils/fhirUtils";
import { AppBar, Toolbar, Typography, Box, Button, Card, CardContent, CircularProgress } from "@mui/material";

// Define Patient Type
interface Patient {
  id: string;
  fullName: string;
  gender: string;
  birthDate: string;
  address?: string;
  contact?: string;
}

const Dashboard = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access_token = sessionStorage.getItem("access_token") || '';
        console.log("Authenticated User:", access_token);

        if (!access_token) {
          navigate("/launch");
          return;
        }

        setToken(access_token);

        // Get Patient ID from sessionStorage
        const patientId = sessionStorage.getItem("patientId") || '';
        console.log("Patient ID:", patientId);
        if (!patientId) {
          throw new Error("Patient ID not found in session.");
        }

        // Fetch Patient Data
        const patientUrl = `https://app.meldrx.com/api/fhir/f30c2d7f-e428-4d06-b4ca-862676f236e5/Patient/${patientId}`;
        const patientData = await fetchFHIRResource(access_token, patientUrl);
        console.log("Fetched Patient Data:", patientData);

        // Extract and format patient's full name
        const nameObj = patientData.name?.[0]; // Official name
        const givenName = nameObj?.given?.join(" ") || "";
        const fullName = `${givenName} ${nameObj?.family || ""}`.trim() || "Unknown";

        // Extract and format address
        const addressObj = patientData.address?.[0];
        const formattedAddress = addressObj
          ? `${addressObj.line?.join(", ") || ""}, ${addressObj.city || ""}, ${addressObj.country || ""}`
          : "N/A";

        setPatient({
          id: patientData.id,
          fullName,
          gender: patientData.gender || "N/A",
          birthDate: patientData.birthDate || "N/A",
          address: formattedAddress,
          contact: patientData.telecom?.[0]?.value || "N/A",
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load patient data.");
      }
    };

    fetchData();
  }, [navigate]);

  // Handle Logout: Clear Session Storage & Redirect
  const handleLogout = async () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("patientId");
    await logout();
    navigate("/launch");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IBS Care Solutions
          </Typography>
          {token && (
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Welcome, Doctor
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>IBS Symptom Dashboard</Typography>

        {error && <Typography color="error">{error}</Typography>}

        {patient ? (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Patient Details</Typography>
              <Typography><strong>Full Name:</strong> {patient.fullName}</Typography>
              <Typography><strong>Gender:</strong> {patient.gender}</Typography>
              <Typography><strong>Date of Birth:</strong> {new Date(patient.birthDate).toLocaleDateString()}</Typography>
              <Typography><strong>Address:</strong> {patient.address}</Typography>
              <Typography><strong>Contact:</strong> {patient.contact}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Box display="flex" alignItems="center">
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Loading patient data...</Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
