import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useUtmTracking = () => {
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const fbclid = queryParams.get('fbclid');
        const ttclid = queryParams.get('ttclid');
        const gclid = queryParams.get('gclid');

        if (fbclid || ttclid || gclid || queryParams.get('utm_source')) {
            const trackingData = {
              utm_source: queryParams.get('utm_source') || 'None',
              utm_medium: queryParams.get('utm_medium') || 'None',
              utm_campaign: queryParams.get('utm_campaign') || 'None',
              utm_content: queryParams.get('utm_content') || 'None',
              fbclid: fbclid || null,
              ttclid: ttclid || null,
              gclid: gclid || null,
              timestamp: Date.now()
            };

            // track first source
            if (!localStorage.getItem('first_visit_source')) {
                localStorage.setItem('first_visit_source', JSON.stringify({
                  ...trackingData,
                  first_visit_date: new Date().toISOString()
                }));
            }

            // always update last visit
            localStorage.setItem('last_visit_source', JSON.stringify({
                ...trackingData,
                last_visit_date: new Date().toISOString()
            }));
            
            localStorage.setItem('booking_source', JSON.stringify(trackingData));

            // Set individual UTM parameters
            Object.entries(trackingData).forEach(([key, value]) => {
                if (typeof value === 'string' && key.startsWith('utm_')) {
                  localStorage.setItem(key, value);
                }
            });

            if ((fbclid && trackingData.utm_source) || ttclid || gclid) {
                localStorage.setItem('customer_source', JSON.stringify(trackingData));
            }

            if (fbclid) localStorage.setItem('booking_origin', 'facebook');
            else if (ttclid) localStorage.setItem('booking_origin', 'tiktok');
            else if (gclid) localStorage.setItem('booking_origin', 'google');
            else if (!localStorage.getItem('booking_origin')) {
                localStorage.setItem('booking_origin', 'organic');
            }
        }
    }, [location.search]);
};

export default useUtmTracking;