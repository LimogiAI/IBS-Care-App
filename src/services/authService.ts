import { UserManager, OidcClient, User } from "oidc-client-ts";

const userManager = new UserManager({
  authority: "https://app.meldrx.com",
  client_id: "b5de3fccab5046cc99ae551ddc2c774e",
  response_type: "code",
  // redirect_uri: "https://ibscare-app.limogi.ai/callback",
  redirect_uri: 'http://localhost:4434/callback',
  // scope: "openid profile launch patient/*.read",
});
const oidcClient = new OidcClient({
  authority: "https://app.meldrx.com",
  client_id: "b5de3fccab5046cc99ae551ddc2c774e",
  response_type: "code",
  redirect_uri: 'http://localhost:4434/callback',
  // redirect_uri: "https://ibscare-app.limogi.ai/callback",
});

// Sign in function with extra query params
export const login = async () => {
  if (window.location.pathname === "/launch") {
    console.log("Launching authentication...", window.location);
    const extraQueryParams: Record<string, string> = {};
    const params = new URLSearchParams(window.location.search);
    
    params.forEach((value, key) => {
      extraQueryParams[key === "iss" ? "aud" : key] = value;
    });

    await userManager.signinRedirect({
      scope: "openid profile launch patient/*.read",
      extraQueryParams,
    });
  }
};

// Handle OIDC callback and extract Patient ID
export const handleCallback = async (): Promise<{ user: User | null; patientId: string | null }> => {
  if (window.location.pathname === "/callback") {
    console.log("Processing callback...", window.location);
    try {
      const result = await oidcClient.processSigninResponse(window.location.href);
      console.log("OIDC Auth Result:", result);

      // ✅ Type assertion to bypass TypeScript check
      const customResult = result as any; 

      let patientId: string | null = null;

      if (customResult?.patient && typeof customResult.patient === "string") {
        patientId = customResult.patient;
        console.log("✅ Extracted patientId:", patientId);
      } else {
        console.warn("⚠️ No valid patient ID found in token.");
      }

      // Convert `SigninResponse` to a valid `User` object
      const user = new User({
        id_token: result.id_token,
        session_state: result.session_state ?? undefined,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        token_type: result.token_type,
        scope: result.scope,
        profile: result.profile,
        expires_at: result.expires_at,
        url_state: result.state ?? undefined,
      });

      return { user, patientId };
    } catch (error) {
      console.error("❌ Error processing OIDC callback:", error);
      return { user: null, patientId: null };
    }
  }
  return { user: null, patientId: null };
};


// Get the authenticated user
export const getUser = async (): Promise<User | null> => {
  return await userManager.getUser();
};

// Logout function
export const logout = async () => {
  await userManager.signoutRedirect();
};