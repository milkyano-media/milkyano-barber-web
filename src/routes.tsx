import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Barbers from '@/pages/Barbers';
import Gallery from '@/pages/Gallery';
import AboutUs from '@/pages/AboutUs';
import NotFound from '@/pages/web/NotFound';
import Careers from '@/pages/Careers';
import Contacts from '@/pages/Contact';

import JoshLanding from '@/pages/Landing/JoshLanding';
import WyattLanding from '@/pages/Landing/WyattLanding';
import RayhanLanding from '@/pages/Landing/RayhanLanding';
import JayLanding from '@/pages/Landing/JayLanding';
import NikoLanding from '@/pages/Landing/NikoLanding';
import EmmanLanding from '@/pages/Landing/EmmanLanding';
import DejanLanding from '@/pages/Landing/DejanLanding';
import ChristosLanding from '@/pages/Landing/ChristosLanding';
import AnthonyLanding from '@/pages/Landing/AnthonyLanding';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* WEB ROUTE */}
        <Route path="/" element={<Home />} />
        <Route path="/barbers" element={<Barbers />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contacts />} />

        {/* LANDING ROUTE */}
        <Route path="/josh" element={<JoshLanding />} />
        <Route path="/meta/josh" element={<JoshLanding />} />


        <Route path="/josh" element={<WyattLanding />} />
        <Route path="/meta/josh" element={<WyattLanding />} />

        <Route path="/rayhan" element={<RayhanLanding />} />
        <Route path="/meta/rayhan" element={<RayhanLanding />} />

        <Route path="/niko" element={<NikoLanding />} />
        <Route path="/meta/niko" element={<NikoLanding />} />

        <Route path="/jay" element={<JayLanding />} />
        <Route path="/meta/jay" element={<JayLanding />} />

        <Route path="/emman" element={<EmmanLanding />} />
        <Route path="/meta/emman" element={<EmmanLanding />} />

        <Route path="/dejan" element={<DejanLanding />} />
        <Route path="/meta/dejan" element={<DejanLanding />} />

        <Route path="/christos" element={<ChristosLanding />} />
        <Route path="/meta/christos" element={<ChristosLanding />} />

        <Route path="/anthony" element={<AnthonyLanding />} />
        <Route path="/meta/anthony" element={<AnthonyLanding />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
