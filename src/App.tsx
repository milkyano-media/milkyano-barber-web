import React from "react";
import "@/App.scss";
import AppRoutes from "@/routes";
import { ThemeProvider } from "@/ThemeProvider";
import "@fontsource-variable/inter";
import PageTracker from "@/components/analytics/PageTracker";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <PageTracker />
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
};

export default App;
