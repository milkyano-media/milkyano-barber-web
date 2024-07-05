import React from 'react';
import '@/App.scss';
import AppRoutes from '@/routes';
import { ThemeProvider } from '@/ThemeProvider';
import '@fontsource-variable/inter';

const App: React.FC = () => {


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="App">
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}

export default App;