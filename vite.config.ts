import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePluginRadar,  } from 'vite-plugin-radar'

export default defineConfig({
  plugins: [react(), 
    VitePluginRadar({
      /**
       * enable or disable scripts injection in development
       * default: false
       */
      enableDev: true,

      // // Google Analytics (multiple tag can be set with an array)
      // analytics: [
      //   {
      //     /**
      //      * Measurement id
      //      */
      //     id: 'G-XXXXX',

      //     /**
      //      * disable tracking for this measurement 
      //      *   window['ga-disable-MEASUREMENT_ID'] = true
      //      * @see https://developers.google.com/analytics/devguides/collection/ga4/disable-analytics
      //      */
      //     disable: true,

      //     /**
      //      * You can configure all settings provided by analytics here
      //      * @see https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id
      //      * @see https://developers.google.com/analytics/devguides/collection/ga4/disable-page-view
      //      * @see https://developers.google.com/analytics/devguides/collection/ga4/display-features
      //      */
      //     config: {
      //       cookie_domain: 'auto',
      //       cookie_expires: 63072000,
      //       cookie_prefix: 'none',
      //       cookie_update: true,
      //       cookie_flags: '',
      //       send_page_view: true,
      //       allow_google_signals: true,
      //       allow_ad_personalization_signals: true,
      //     },

      //     /**
      //      * Set default values for "consent mode"
      //      * @see https://developers.google.com/tag-platform/devguides/consent
      //      * @see https://support.google.com/analytics/answer/9976101
      //      */
      //     consentDefaults: {
      //       analytics_storage: 'granted',
      //       ad_storage: 'denied',
      //       wait_for_update: 500
      //     },

      //     /**
      //      * You set persitent values
      //      * @see https://developers.google.com/analytics/devguides/collection/ga4/persistent-values
      //      */
      //     persistentValues: {
      //       currency: 'USD',
      //     }
      //   },
      //   // You can add as many measurement id as you need
      //   {
      //     id: 'UA-YYYYY',
      //   },
      // ],

      // Google Tag Manager (multiple tag can be set with an array)
      gtm: [
        {
          id: 'GTM-T87SBL9R',
          // id: 'GTM-W94TJ64',

          // // You can set custom source for gtm script and noscript
          // gtmBase: 'https://www.custom.com/gtm.js',
          // nsBase: 'https://www.custom.com/ns.html',
          // // You can optionally define the environment for the gtm.
          // environment: {
          //   auth: 'X1YzAB2CDEFGh3ijklmnoP',
          //   preview: 'env-x',
          // },
        }
      ],

      // // Facebook Pixel (multiple tag can be set with an array)
      // pixel: [
      //   {
      //     id: 'XXXXXXX',
      //   }
      // ],

    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
