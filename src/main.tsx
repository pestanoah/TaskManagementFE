import { StrictMode } from "react";
import { AuthProvider } from "react-oidc-context";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WebStorageStateStore, type User } from "oidc-client-ts";

const onSigninCallback = (_user: User | void): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_PXQPW6TiY",
  client_id: "6fbkrdss49n7526s5sbmlvrhle",
  redirect_uri:
    (import.meta.env.DEV && "http://localhost:5173/") ||
    "https://task-management-fe-bucket.s3.us-east-2.amazonaws.com/index.html",
  response_type: "code",
  scope: "phone openid email",
  onSigninCallback,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
