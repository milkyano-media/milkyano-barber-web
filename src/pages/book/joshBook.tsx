import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, } from "react";
import { Helmet } from "react-helmet-async";

import LandingLayout from "@/components/landing/LandingLayout";

import Top from "@/assets/landing/top_line.svg";
import Mid from "@/assets/landing/mid_line.svg";
import Bottom from "@/assets/landing/bottom_line.svg";
import servicesData from "@/data/josh.json";

export default function JoshLandingBook() {
    const [services, setServices] = useState([]);
    const [selectedUrl, setSelectedUrl] = useState('');

    const handleServiceClick = (url) => {
        setSelectedUrl(url);
    };

    useEffect(() => {
        setServices(servicesData.josh); // Assuming the structure is as provided
    }, []);

    const iframeRef = useRef(null);

    useEffect(() => {
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            const url = args[0];

            if (url.includes('/v1/cdp/batch')) {
                const requestMethod = args[1]?.method || 'GET';
                const requestBody = args[1]?.body;
                const responseBody = await response.clone().json();

                console.log('Request URL:', url);
                console.log('Request Method:', requestMethod);
                console.log('Request Body:', requestBody);
                console.log('Status Code:', response.status);
                console.log('Response Body:', responseBody);
                console.log('Headers:', response.headers);
            }

            return response;
        };

        // Cleanup function
        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    return (
        <LandingLayout>
            <Helmet>
                <title>Book Josh Fadelines BEST BARBER IN MELBOURNE</title>
                <meta name="description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
                <meta property="og:title" content="Josh Fadelines BEST BARBER IN MELBOURNE" />
                <meta property="og:description" content="Josh Fadelines BEST BARBER IN MELBOURNE - A premier barber shop offering top-notch haircuts and styles." />
                <meta property="og:image" content="URL to Fadelines' preview image" />
                <meta property="og:url" content="URL to Fadelines' website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <div className="flex flex-col bg-stone-950 text-stone-50 w-full h-full relative">
                <img src={Top} alt="Vector Top" width={500} height={500} className="absolute top-[60rem] md:top-[30rem] z-10 left-0 w-full h-auto" />
                <img src={Mid} alt="Vector Mid" width={500} height={500} className="absolute bottom-[85rem] z-0 left-0 w-full h-auto" />
                <img src={Bottom} alt="Vector Bottom" width={500} height={500} className="absolute bottom-0 z-0 left-0 w-[40vw] h-auto" />
                <section className="relative z-50">
                    <ul className="relative z-50 py-12 gap-4 flex">
                        {services.map((service, index) => (
                            <Button key={index} onClick={() => handleServiceClick(service.url)}>
                                <span>{service.name}</span>
                            </Button>
                        ))}
                    </ul>
                    <iframe ref={iframeRef} src={selectedUrl} frameBorder="0" className="w-[50rem] h-[50rem]"></iframe>
                </section>
            </div>
        </LandingLayout>
    );
}
