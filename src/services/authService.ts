// src/services/authService.ts
import { UserManager, User } from "oidc-client-ts";

// OIDC Configuration for MeldRx
const userManager = new UserManager({
  authority: "https://app.meldrx.com",
  client_id: "b5de3fccab5046cc99ae551ddc2c774e",
  response_type: "code",
  redirect_uri: "https://ibscare-app.limogi.ai/callback",
  scope: "openid profile launch patient/*.read",
});

// Sign in function
export const login = async () => {
  await userManager.signinRedirect();
};

// Handle OIDC callback
export const handleCallback = async (): Promise<User | null> => {
  return await userManager.signinRedirectCallback();
};

// Get the authenticated user
export const getUser = async (): Promise<User | null> => {
  return await userManager.getUser();
};

// Logout function
export const logout = async () => {
  await userManager.signoutRedirect();
};
