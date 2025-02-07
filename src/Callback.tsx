import { useEffect, useState } from "react";
import { handleCallback } from "./services/authService";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processLogin = async () => {
      try {
        const { user, patientId } = await handleCallback();
        
        if (user && patientId) {
          console.log("Authenticated User:", user);
          console.log("Extracted Patient ID:", patientId);
          
          // Store patient ID in sessionStorage (or a state manager like Zustand)
          sessionStorage.setItem("patientId", patientId);
          sessionStorage.setItem("access_token", user.access_token);
          navigate("/");
        } else {
          setError("Authentication failed. No patient ID found.");
        }
      } catch (error) {
        console.error("Error during callback processing:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    };

    processLogin();
  }, [navigate]);

  return (
    <div>
      <p>Processing authentication...</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Callback;