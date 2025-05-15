import { isClient } from "@/lib/utils";

// Function to check if Google Analytics is configured
export const isGAConfigured = (): boolean => {
  return !!import.meta.env.VITE_GA_MEASUREMENT_ID;
};

// Get the measurement ID
export const getMeasurementId = (): string => {
  return import.meta.env.VITE_GA_MEASUREMENT_ID || "G-PLACEHOLDER";
};

// Initialize Google Analytics
export const initGA = () => {
  if (!isClient) return;
  
  const measurementId = getMeasurementId();
  
  if (!isGAConfigured()) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }
  
  // Check if GA is already initialized
  if (typeof window.gtag === 'function') {
    console.log('Google Analytics already initialized.');
    return;
  }
  
  // Load the GA script dynamically
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);
  
  // Initialize the global gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false, // We'll handle page views manually
  });
  
  // Make gtag globally available
  window.gtag = gtag;
  
  console.log('Google Analytics initialized with ID:', measurementId);
};

// Track page views
export const trackPageView = (url: string) => {
  if (!isClient || !window.gtag) return;
  if (!isGAConfigured()) return;
  
  const measurementId = getMeasurementId();
  
  window.gtag('config', measurementId, {
    page_path: url,
    page_title: document.title,
  });
  
  console.log('Page view tracked:', url);
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!isClient) return;
  if (!isGAConfigured()) return;
  if (typeof window.gtag !== 'function') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
  
  console.log('Event tracked:', { action, category, label, value });
};

// Define types for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}