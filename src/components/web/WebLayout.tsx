import React, { ReactNode, useEffect } from "react";
import WebHeader from "@/components/web/WebHeader";
import WebFooter from "@/components/web/WebFooter";
import { useGtm } from "../hooks/UseGtm";
import { useLocation } from "react-router-dom";

const WebLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { sendEvent } = useGtm();

  useEffect(() => {
    sendEvent({
      event: "route_event",
      path: location.pathname,
    });

    // window.scrollTo(0, 0);
  }, [location.pathname, sendEvent]);

  return (
    <div className={`font-poppins`}>
      <h1 className="hidden">Faded Lines Barber Shop</h1>
      <WebHeader />
      <main className="flex flex-col gap-40">{children}</main>
      <WebFooter />
    </div>
  );
};

export default WebLayout;
