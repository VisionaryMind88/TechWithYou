import { isClient } from "@/lib/utils";

// Google Analytics measurement ID
// Normally this would be set in an environment variable
const GA_MEASUREMENT_ID = "G-PLACEHOLDER"; // Replace with actual GA ID when ready

// Initialize Google Analytics
export const initGA = () => {
  if (!isClient) return;
  
  // Load the GA script dynamically
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);
  
  // Initialize the global gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // We'll handle page views manually
  });
  
  // Make gtag globally available
  window.gtag = gtag;
};

// Track page views
export const trackPageView = (url: string) => {
  if (!isClient || !window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!isClient || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Define types for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}