/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_PORT: string
    readonly VITE_OIDC_AUTHORITY: string
    readonly VITE_OIDC_CLIENT_ID: string
    readonly VITE_OIDC_RESPONSE_TYPE: string
    readonly VITE_OIDC_REDIRECT_URI_LOCAL: string
    readonly VITE_OIDC_REDIRECT_URI_PROD: string
    readonly VITE_OIDC_SCOPE: string
    readonly VITE_FHIR_BASE_URL: string
    readonly VITE_FHIR_TENANT_ID: string
    readonly VITE_USER_INFO_ENDPOINT: string
    readonly VITE_APP_NAME: string
    readonly VITE_BACKEND_URL_ANALYSIS_EVIDENCE: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  