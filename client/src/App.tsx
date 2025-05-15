import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import { LanguageContext } from "@/hooks/use-translation";
import { CookieConsent } from "@/components/CookieConsent";
import { Chatbot } from "@/components/Chatbot";
import { initGA, trackPageView } from "@/lib/analytics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={() => <Home initialSection="services" />} />
      <Route path="/portfolio" component={() => <Home initialSection="portfolio" />} />
      <Route path="/about" component={() => <Home initialSection="about" />} />
      <Route path="/faq" component={() => <Home initialSection="faq" />} />
      <Route path="/contact" component={() => <Home initialSection="contact" />} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [language, setLanguage] = useState<"nl" | "en">("nl");
  const [location] = useLocation();

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);
  
  // Track page views when location changes
  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <Chatbot />
        <CookieConsent />
      </TooltipProvider>
    </LanguageContext.Provider>
  );
}

export default App;
