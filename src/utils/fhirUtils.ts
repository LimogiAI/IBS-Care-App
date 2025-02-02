// src/utils/fhirUtils.ts
export const fetchFHIRResource = async (accessToken: string, resourceUrl: string) => {
    try {
      const response = await fetch(resourceUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/fhir+json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching FHIR resource:", error);
      throw error;
    }
  };
  