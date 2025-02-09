import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "./services/authService";
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

interface User {
  familyName?: string;
  userType?: string;
  name: string;
  username?: string;
  givenName?: string;
}
const Dashboard = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [conditions, setConditions] = useState<any[]>([]);
  
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {

        const userInfo = await getUser ()
        console.log("userInfo:",userInfo)

        const access_token = sessionStorage.getItem("access_token") || '';
        console.log("Authenticated User:", access_token);

        if (!access_token) {
          navigate("/launch");
          return;
        }

        setToken(access_token);
        
        try {
          const userInfoResponse = await fetch('https://app.meldrx.com/connect/userinfo', {
            headers: {
              'Authorization': `Bearer ${access_token}`
            }
          });
          console.log('User Inforesopnse:', userInfoResponse);
          if (userInfoResponse.ok) {
            const userInfoData = await userInfoResponse.json();
            setUser(userInfoData);
           
          } else {
            console.error('Failed to fetch user info:', userInfoResponse.statusText);
          }
        } catch (userInfoError) {
          console.error('Error fetching user info:', userInfoError);
        }

        // ✅ Fetch Patient ID
        const patientId = sessionStorage.getItem("patientId") || '';
        if (!patientId) {
          throw new Error("Patient ID not found in session.");
        }
  
        // ✅ Fetch Patient Data
        const patientUrl = `https://app.meldrx.com/api/fhir/f30c2d7f-e428-4d06-b4ca-862676f236e5/Patient/${patientId}`;
        const patientData = await fetchFHIRResource(access_token, patientUrl);
  
        const nameObj = patientData.name?.[0];
        const givenName = nameObj?.given?.join(" ") || "";
        const fullName = `${givenName} ${nameObj?.family || ""}`.trim() || "Unknown";
  
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
  
        // ✅ Fetch Conditions for the Patient
        const conditionUrl = `https://app.meldrx.com/api/fhir/f30c2d7f-e428-4d06-b4ca-862676f236e5/Condition?patient=${patientId}`;
        const conditionData = await fetchFHIRResource(access_token, conditionUrl);
        console.log("Fetched Condition Data:", conditionData);
  
        // Extract and format condition data
        const formattedConditions = conditionData.entry?.map((entry: any) => {
          const condition = entry.resource;
          return {
            id: condition.id,
            code: condition.code?.coding?.[0]?.display || "Unknown Condition",
            recordedDate: condition.recordedDate || "Unknown Date",
            clinicalStatus: condition.clinicalStatus?.coding?.[0]?.code || "Unknown Status",
            verificationStatus: condition.verificationStatus?.coding?.[0]?.code || "Not Verified",
          };
        }) || [];
  
        setConditions(formattedConditions);
  
        
  
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
        
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
  console.log('User Info:', user);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IBS Care Solutions
            </Typography>
          {token && (
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Welcome, {user?.name}
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
        {conditions.length > 0 ? (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h5" gutterBottom>Medical Conditions</Typography>
      {conditions.map((condition) => (
        <Box key={condition.id} sx={{ mb: 2, p: 1, border: "1px solid #ccc", borderRadius: "8px" }}>
          <Typography><strong>Condition:</strong> {condition.code}</Typography>
          <Typography><strong>Recorded Date:</strong> {new Date(condition.recordedDate).toLocaleDateString()}</Typography>
          <Typography><strong>Clinical Status:</strong> {condition.clinicalStatus}</Typography>
          <Typography><strong>Verification Status:</strong> {condition.verificationStatus}</Typography>
        </Box>
      ))}
    </CardContent>
  </Card>
) : (
  <Typography>No medical conditions found.</Typography>
)}

      </Box>
    </>
  );
};

export default Dashboard;
