import { UserProfile } from "oidc-client-ts";

  export const fetchUserInfo = async (accessToken: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch(import.meta.env.VITE_USER_INFO_ENDPOINT, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch user info:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };