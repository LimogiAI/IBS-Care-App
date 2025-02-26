// // src/Launch.tsx
// import { useEffect } from "react";
// import { login } from "./services/authService";

// const Launch = () => {
//   useEffect(() => {
//     console.log("Launch component mounted");
//     console.log("URL parameters:", window.location.search);
//     const params = new URLSearchParams(window.location.search);
//     const paramObj: Record<string, string> = {};
//     params.forEach((value, key) => {
//       paramObj[key] = value;
//     });
//     console.log("Parsed parameters:", paramObj);
    
//     // Log and store specific parameters that are important for SMART on FHIR
//     const issParam = params.get("iss");
//     const launchParam = params.get("launch");
    
//     console.log("iss parameter:", issParam);
//     console.log("launch parameter:", launchParam);
    
//     // Store in sessionStorage
//     if (issParam) {
//       sessionStorage.setItem("iss", issParam);
//     }
//     if (launchParam) {
//       sessionStorage.setItem("launch", launchParam);
//     }
    
//     login();
//   }, []);

//   return <p>Redirecting to authentication...</p>;
// };

// export default Launch;

// src/Launch.tsx
import { useEffect } from "react";
import { login } from "./services/authService";

const Launch = () => {
  useEffect(() => {
    console.log("Launch component mounted");
    console.log("URL parameters:", window.location.search);
    const params = new URLSearchParams(window.location.search);
    const paramObj: Record<string, string> = {};
    params.forEach((value, key) => {
      paramObj[key] = value;
    });
    console.log("Parsed parameters:", paramObj);
    
    // Log and store specific parameters that are important for SMART on FHIR
    const issParam = params.get("iss");
    const launchParam = params.get("launch");
    
    console.log("iss parameter:", issParam);
    console.log("launch parameter:", launchParam);
    
    // Store in sessionStorage
    if (issParam) {
      sessionStorage.setItem("iss", issParam);
      
      // Extract workspace slug from iss URL
      try {
        const issUrl = new URL(issParam);
        const pathParts = issUrl.pathname.split('/');
        const wsSlug = pathParts[pathParts.length - 1];
        
        if (wsSlug && wsSlug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          console.log("Extracted workspace slug:", wsSlug);
          sessionStorage.setItem("ws-slug", wsSlug);
        } else {
          console.warn("Could not extract a valid workspace slug from iss");
        }
      } catch (error) {
        console.error("Error extracting workspace slug from iss:", error);
      }
    }
    
    if (launchParam) {
      sessionStorage.setItem("launch", launchParam);
    }
    
    login();
  }, []);

  return <p>Redirecting to authentication...</p>;
};

export default Launch;