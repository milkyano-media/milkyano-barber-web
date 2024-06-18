import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Barbers from './pages/Barbers';
import Gallery from './pages/Gallery';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import JoshLanding from './pages/Landing/Josh/JoshLanding';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/barbers" element={<Barbers />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/josh" element={<JoshLanding />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
