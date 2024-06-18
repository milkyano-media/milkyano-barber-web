import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Barbers from './pages/Barbers';
import NotFound from './pages/NotFound';
import JoshLanding from './pages/Landing/Josh/JoshLanding';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/barbers" element={<Barbers />} />
        <Route path="/josh" element={<JoshLanding />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
