import { GTMBookEvent } from "@/interfaces/GTMInterface";

export const useGtm = () => {
  const sendEvent = (eventData: GTMBookEvent) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
  };

  return { sendEvent };
};
