// src/Launch.tsx
import { useEffect } from "react";
import { login } from "./services/authService";

const Launch = () => {
  useEffect(() => {
    login();
  }, []);

  return <p>Redirecting to authentication...</p>;
};

export default Launch;
