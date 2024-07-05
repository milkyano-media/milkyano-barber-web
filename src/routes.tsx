import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/web/Home';
import Barbers from '@/pages/web/Barbers';
import Gallery from '@/pages/web/Gallery';
import AboutUs from '@/pages/web/AboutUs';
import Careers from '@/pages/web/Careers';
import Contacts from '@/pages/web/Contacts';
import PrivacyPolicy from '@/pages/web/PrivacyPolicy';
import NotFound from '@/pages/web/NotFound';

import JoshLanding from '@/pages/landing/JoshLanding';
import WyattLanding from '@/pages/landing/WyattLanding';
import RayhanLanding from '@/pages/landing/RayhanLanding';
import JayLanding from '@/pages/landing/JayLanding';
import NikoLanding from '@/pages/landing/NikoLanding';
import EmmanLanding from '@/pages/landing/EmmanLanding';
import DejanLanding from '@/pages/landing/DejanLanding';
import ChristosLanding from '@/pages/landing/ChristosLanding';
import AnthonyLanding from '@/pages/landing/AnthonyLanding';
import BookList from './components/book/BookList';
import BookAppointment from './components/book/BookAppointment';
import BookContactInfo from './components/book/BookContactInfo';
import ThankYou from './components/book/ThankYou';



const webRoutes = [
  { path: '', component: Home },
  { path: 'barbers', component: Barbers },
  { path: 'galery', component: Gallery },
  { path: 'about-us', component: AboutUs },
  { path: 'careers', component: Careers },
  { path: 'contact', component: Contacts },
  { path: 'privacy-policy', component: PrivacyPolicy },
];


const landingRoutes = [
  { path: 'anthony', component: AnthonyLanding },
  { path: 'christos', component: ChristosLanding },
  { path: 'dejan', component: DejanLanding },
  { path: 'emman', component: EmmanLanding },
  { path: 'jay', component: JayLanding },
  { path: 'josh', component: JoshLanding },
  { path: 'niko', component: NikoLanding },
  { path: 'rayhan', component: RayhanLanding },
  { path: 'wyatt', component: WyattLanding },
];

const bookRoutes = [
  { path: 'anthony/book', component: BookList },
  { path: 'christos/book', component: BookList },
  { path: 'dejan/book', component: BookList },
  { path: 'emman/book', component: BookList },
  { path: 'jay/book', component: BookList },
  { path: 'josh/book', component: BookList },
  { path: 'niko/book', component: BookList },
  { path: 'rayhan/book', component: BookList },
  { path: 'wyatt/book', component: BookList },
];

const appointmentRoutes = [
  { path: 'anthony/book/appointment', component: BookAppointment },
  { path: 'christos/book/appointment', component: BookAppointment },
  { path: 'dejan/book/appointment', component: BookAppointment },
  { path: 'emman/book/appointment', component: BookAppointment },
  { path: 'jay/book/appointment', component: BookAppointment },
  { path: 'josh/book/appointment', component: BookAppointment },
  { path: 'niko/book/appointment', component: BookAppointment },
  { path: 'rayhan/book/appointment', component: BookAppointment },
  { path: 'wyatt/book/appointment', component: BookAppointment },
];

const contactInfoRoutes = [
  { path: 'anthony/book/contact-info', component: BookContactInfo },
  { path: 'christos/book/contact-info', component: BookContactInfo },
  { path: 'dejan/book/contact-info', component: BookContactInfo },
  { path: 'emman/book/contact-info', component: BookContactInfo },
  { path: 'jay/book/contact-info', component: BookContactInfo },
  { path: 'josh/book/contact-info', component: BookContactInfo },
  { path: 'niko/book/contact-info', component: BookContactInfo },
  { path: 'rayhan/book/contact-info', component: BookContactInfo },
  { path: 'wyatt/book/contact-info', component: BookContactInfo },
];

const ThankYouRoutes = [
  { path: 'anthony/book/thank-you', component: ThankYou },
  { path: 'christos/book/thank-you', component: ThankYou },
  { path: 'dejan/book/thank-you', component: ThankYou },
  { path: 'emman/book/thank-you', component: ThankYou },
  { path: 'jay/book/thank-you', component: ThankYou },
  { path: 'josh/book/thank-you', component: ThankYou },
  { path: 'niko/book/thank-you', component: ThankYou },
  { path: 'rayhan/book/thank-you', component: ThankYou },
  { path: 'wyatt/book/thank-you', component: ThankYou },
];


const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* LANDING ROUTES */}
        {landingRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* BOOKING ROUTES */}
        {bookRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* APPOINTMENT ROUTES */}
        {appointmentRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* CONTACT INFO ROUTES */}
        {contactInfoRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* CONTACT INFO ROUTES */}
        {contactInfoRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* THANK YOU ROUTES */}
        {ThankYouRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* WEB ROUTE */}
        {webRoutes.map(({ path, component: Component }) => (
          <React.Fragment key={path}>
            <Route path={`/${path}`} element={<Component />} />
            <Route path={`/meta/${path}`} element={<Component />} />
          </React.Fragment>
        ))}

        {/* NOT FOUND ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
