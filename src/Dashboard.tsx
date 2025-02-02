// // src/Dashboard.tsx
// import { useEffect, useState } from "react";
// import { getUser, logout } from "./services/authService";
// import { fetchFHIRResource } from "./utils/fhirUtils";
// import { useNavigate } from "react-router-dom";
// import { Box, Button, Typography } from "@mui/material";
// import { User } from "oidc-client-ts"; // Import User type

// // Define FHIR data type (adjust based on your data structure)
// interface FHIRData {
//   resourceType: string;
//   id: string;
//   [key: string]: unknown; // For flexibility with dynamic properties
// }

// const Dashboard = () => {
//   const [user, setUser] = useState<User | null>(null);  // Set proper type
//   const [fhirData, setFhirData] = useState<FHIRData | null>(null); // Set proper type
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const authenticatedUser = await getUser();
//       if (!authenticatedUser) {
//         navigate("/launch");
//       } else {
//         setUser(authenticatedUser);  // Now TypeScript knows user is of type User
//         const resourceUrl = "https://app.meldrx.com/api/fhir/f30c2d7f-e428-4d06-b4ca-862676f236e5/Condition";
//         const data = await fetchFHIRResource(authenticatedUser.access_token, resourceUrl);
//         setFhirData(data);
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   return (
//     <Box>
//       <Typography variant="h4">IBS Symptom Dashboard</Typography>

//       {user && (
//         <Typography variant="subtitle1">
//           Welcome, {user.profile?.name || "User"}  {/* Added safe access */}
//         </Typography>
//       )}

//       {fhirData ? (
//         <pre>{JSON.stringify(fhirData, null, 2)}</pre>
//       ) : (
//         <Typography>Loading FHIR data...</Typography>
//       )}

//       <Button onClick={logout} variant="contained" color="secondary">
//         Logout
//       </Button>
//     </Box>
//   );
// };

// export default Dashboard;

// src/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "./services/authService";
import { fetchFHIRResource } from "./utils/fhirUtils";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { User } from "oidc-client-ts";

// Define TypeScript types for the FHIR Bundle (Condition resources)
interface FHIRBundle {
  resourceType: string;
  type: string;
  total: number;
  entry: Array<{
    fullUrl: string;
    resource: {
      resourceType: string;
      id: string;
      meta?: { lastUpdated?: string };
      clinicalStatus?: {
        coding: Array<{
          system: string;
          code: string;
          display?: string;
        }>;
      };
      verificationStatus?: {
        coding: Array<{
          system: string;
          code: string;
          display?: string;
        }>;
      };
      code?: {
        coding: Array<{
          system: string;
          code: string;
          display: string;
        }>;
        text?: string;
      };
      onsetDateTime?: string;
      recordedDate?: string;
      abatementDateTime?: string;
      subject?: {
        reference: string; // e.g., "Patient/f56a6c5c-5631-469f-94d0-af0452febcc7"
      };
    };
    response?: unknown;
  }>;
}

// Define a type for Patient details. In production, adjust these fields as needed.
interface Patient {
  id: string;
  fullName: string;
  gender: string;
  birthDate: string;
  address?: string;
  contact?: string;
}

// Helper function to extract the patient ID from a reference string.
const extractPatientId = (reference: string): string => {
  const parts = reference.split("/");
  return parts.length === 2 ? parts[1] : "";
};

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [fhirBundle, setFhirBundle] = useState<FHIRBundle | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();

  // Fetch patient details from the FHIR Patient endpoint.
  const fetchFHIRPatientDetails = async (
    accessToken: string,
    patientId: string
  ): Promise<Patient> => {
    const patientUrl = `https://app.meldrx.com/api/fhir/f30c2d7f-e428-4d06-b4ca-862676f236e5/Patient/${patientId}`;
    const patientData = await fetchFHIRResource(accessToken, patientUrl);
    // Build the full name from given_name and family, if text is not available.
    let fullName = "Unknown";
    if (patientData.name && Array.isArray(patientData.name) && patientData.name.length > 0) {
      const nameObj = patientData.name[0];
      if (nameObj.text) {
        fullName = nameObj.text;
      } else {
        const givenNames = nameObj.given ? nameObj.given.join(" ") : "";
        const familyName = nameObj.family || "";
        fullName = `${givenNames} ${familyName}`.trim() || "Unknown";
      }
    }
    return {
      id: patientData.id,
      fullName,
      gender: patientData.gender || "N/A",
      birthDate: patientData.birthDate || "N/A",
      address: patientData.address?.[0]
        ? `${patientData.address[0].line?.join(" ") || ""}, ${patientData.address[0].city || ""}`
        : "",
      contact: patientData.telecom?.[0]?.value || "",
    };
  };

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const authenticatedUser = await getUser();
      if (!authenticatedUser) {
        navigate("/launch");
      } else {
        // Log the user profile to inspect available properties.
        console.log("User Profile:", authenticatedUser.profile);
        setUser(authenticatedUser);

        // Fetch the Conditions FHIR bundle.
        const conditionUrl =
          "https://app.meldrx.com/api/fhir/f30c2d7f-e428-4d06-b4ca-862676f236e5/Condition";
        const conditionData = await fetchFHIRResource(
          authenticatedUser.access_token,
          conditionUrl
        );
        setFhirBundle(conditionData);

        // Extract the patient reference from the first Condition, then fetch patient details.
        if (conditionData.entry && conditionData.entry.length > 0) {
          const patientRef = conditionData.entry[0].resource.subject?.reference;
          if (patientRef) {
            const patientId = extractPatientId(patientRef);
            const patientData = await fetchFHIRPatientDetails(
              authenticatedUser.access_token,
              patientId
            );
            setPatient(patientData);
          }
        }
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  // Compute a display name based on the user's profile properties.
  const displayName =
    user?.profile?.name ||
    `${user?.profile?.given_name || ""} ${user?.profile?.family_name || ""}`.trim() ||
    user?.profile?.preferred_username ||
    "Doctor";

  return (
    <>
      {/* Application Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IBS Care Solutions
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {displayName}
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          IBS Symptom Dashboard
        </Typography>

        {/* Patient Details Card */}
        {patient ? (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Patient Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    <strong>Full Name:</strong> {patient.fullName}
                  </Typography>
                  <Typography>
                    <strong>Gender:</strong> {patient.gender}
                  </Typography>
                  <Typography>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(patient.birthDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {patient.address && (
                    <Typography>
                      <strong>Address:</strong> {patient.address}
                    </Typography>
                  )}
                  {patient.contact && (
                    <Typography>
                      <strong>Contact:</strong> {patient.contact}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Typography>Loading patient details...</Typography>
        )}

        {/* FHIR Condition Data */}
        {!fhirBundle ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Loading FHIR data...</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Total Condition Records: {fhirBundle.total}
            </Typography>

            {/* Data Table */}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Condition ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Clinical Status</TableCell>
                    <TableCell>Onset Date</TableCell>
                    <TableCell>Recorded Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fhirBundle.entry.map((entry) => {
                    const resource = entry.resource;
                    const conditionId = resource.id;
                    const description =
                      resource.code?.coding[0]?.display ||
                      resource.code?.text ||
                      "";
                    const clinicalStatus =
                      resource.clinicalStatus?.coding[0]?.code || "N/A";
                    const onsetDate = resource.onsetDateTime
                      ? new Date(resource.onsetDateTime).toLocaleDateString()
                      : "N/A";
                    const recordedDate = resource.recordedDate
                      ? new Date(resource.recordedDate).toLocaleDateString()
                      : "N/A";

                    return (
                      <TableRow key={conditionId}>
                        <TableCell>{conditionId}</TableCell>
                        <TableCell>{description}</TableCell>
                        <TableCell>{clinicalStatus}</TableCell>
                        <TableCell>{onsetDate}</TableCell>
                        <TableCell>{recordedDate}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </>
  );
};

export default Dashboard;
