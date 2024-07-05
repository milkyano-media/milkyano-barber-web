export const useGtm = () => {
  const sendEvent = (eventData: unknown) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
  };

  return { sendEvent };
};
