// src/utils/fhirUtils.ts
export async function fetchFHIRResource<T>(
  access_token: string, 
  url: string
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}
  