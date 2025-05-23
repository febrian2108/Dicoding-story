import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "leaflet/dist/leaflet.css";
import "./styles/styles.css";

import "./scripts/app.js";

import { registerSW } from "virtual:pwa-register";

if (import.meta.env.PROD) {
  registerSW({
    onNeedRefresh() {
      console.log("New content available, click on reload button to update.");
    },
    onOfflineReady() {
      console.log("App ready to work offline");
    },
  });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      }).catch(error => {
        console.log('Service Worker registration failed:', error);
      });
    });
  }