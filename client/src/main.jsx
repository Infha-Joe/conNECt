import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BadgeProvider } from "./context/BadgeContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-client-id"}>
      <BrowserRouter>
        <AuthProvider>
          <BadgeProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BadgeProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
