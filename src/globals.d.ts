/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  dataLayer: any[];
  google: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        prompt: () => void;
      };
    };
  };
}