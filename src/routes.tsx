import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/web/Home';
import Barbers from '@/pages/web/Barbers';
import Gallery from '@/pages/web/Gallery';
import AboutUs from '@/pages/web/AboutUs';
import Careers from '@/pages/web/Careers';
import Contacts from '@/pages/web/Contact';
import NotFound from '@/pages/web/NotFound';
import JoshLandingBook from '@/pages/SquareBook';
import ThankYou from '@/pages/ThankYou';
import EmbeddedPage from '@/pages/Embedded';

import JoshLanding from '@/pages/landing/JoshLanding';
import WyattLanding from '@/pages/landing/WyattLanding';
import RayhanLanding from '@/pages/landing/RayhanLanding';
import JayLanding from '@/pages/landing/JayLanding';
import NikoLanding from '@/pages/landing/NikoLanding';
import EmmanLanding from '@/pages/landing/EmmanLanding';
import DejanLanding from '@/pages/landing/DejanLanding';
import ChristosLanding from '@/pages/landing/ChristosLanding';
import AnthonyLanding from './pages/landing/AnthonyLanding.tsx';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* LANDING ROUTE */}
        <Route path="/josh" element={<JoshLanding />} />
        <Route path="/meta/josh" element={<JoshLanding />} />
        <Route path="/wyatt" element={<WyattLanding />} />
        <Route path="/meta/wyatt" element={<WyattLanding />} />
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

        {/* WEB ROUTE */}
        <Route path="/" element={<Home />} />
        <Route path="/barbers" element={<Barbers />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact-us" element={<Contacts />} />

        <Route path="/josh/book" element={<JoshLandingBook />} />
        <Route path="/josh/book/list" element={<EmbeddedPage />} />
        <Route path="/josh/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
