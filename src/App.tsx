import React from "react";
import "@/App.scss";
import AppRoutes from "@/routes";
import { ThemeProvider } from "@/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { UnverifiedUserHandler } from "@/components/auth/UnverifiedUserHandler";
import { Toaster } from "@/components/ui/toaster";
import "@fontsource-variable/inter";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="App">
          <AppRoutes />
          <UnverifiedUserHandler />
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
