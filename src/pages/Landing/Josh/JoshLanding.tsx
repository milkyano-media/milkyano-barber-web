import React from 'react';
import SmoothScrolling from '../../../components/SmoothScrolling';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';


const JoshLanding: React.FC = () => {
  return (
    <SmoothScrolling>
      <Helmet>
        <title>Josh Fadelines BEST BARBER IN MELBOURNE</title>
        <meta name="description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:title" content="Josh Fadelines BEST BARBER IN MELBOURNE" />
        <meta property="og:description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
        <meta property="og:image" content="URL to Fadelines' preview image" />
        <meta property="og:url" content="URL to Fadelines' website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* HEADER SECTION */}
      <div>
        <div>
          <Button>Click me</Button>
        </div>
      </div> 
    </SmoothScrolling>
  );
}

export default JoshLanding;
