import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute, AdminProtectedRoute } from "@/lib/protected-route";
import { queryClient } from "@/lib/queryClient";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";
import ServicesPage from "@/pages/ServicesPage";
import PortfolioPage from "@/pages/PortfolioPage";
import PortfolioDetailPage from "@/pages/PortfolioDetailPage";
import AboutPage from "@/pages/AboutPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";

import { LanguageContext } from "@/hooks/use-translation";
import { CookieConsent } from "@/components/CookieConsent";
import { Chatbot } from "@/components/Chatbot";
import { initGA, trackPageView } from "@/lib/analytics";

function Router() {
  // Track page views when location changes
  const [location] = useLocation();
  useEffect(() => {
    trackPageView(location);
  }, [location]);
  
  return (
    <Switch>
      <Route path="/">
        {() => <Home />}
      </Route>
      <Route path="/services">
        {() => <ServicesPage />}
      </Route>
      <Route path="/portfolio">
        {() => <PortfolioPage />}
      </Route>
      <Route path="/portfolio/:slug">
        {() => <PortfolioDetailPage />}
      </Route>
      <Route path="/about">
        {() => <AboutPage />}
      </Route>
      <Route path="/faq">
        {() => <FAQPage />}
      </Route>
      <Route path="/contact">
        {() => <ContactPage />}
      </Route>
      <Route path="/privacy-policy">
        {() => <PrivacyPolicy />}
      </Route>
      <Route path="/terms-and-conditions">
        {() => <TermsAndConditions />}
      </Route>
      <Route path="/analytics-dashboard">
        {() => <AnalyticsDashboard />}
      </Route>
      {/* Auth routes */}
      <Route path="/auth">
        {() => <AuthPage />}
      </Route>
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/project/:id" component={ProjectDetailPage} />
      <AdminProtectedRoute path="/admin" component={AdminDashboardPage} />
      <Route>
        {() => <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  const [language, setLanguage] = useState<"nl" | "en">("nl");

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);
  
  // Handle redirect result from Firebase auth
  useEffect(() => {
    // Import the Firebase functions in a way compatible with Vite
    import("firebase/auth").then(({ getAuth, getRedirectResult }) => {
      const auth = getAuth();
      
      // Check for auth redirect result
      getRedirectResult(auth)
        .then((result: any) => {
          if (result) {
            console.log("Redirect authentication succeeded:", result);
            // Gebruiker is succesvol ingelogd, indien nodig redirect naar dashboard
            window.location.href = '/dashboard';
          }
        })
        .catch((error: any) => {
          if (error.code !== 'auth/no-auth-event') {
            // Alleen fouten loggen als het geen 'geen auth event' is
            console.error("Redirect authentication failed:", error);
          }
        });
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <TooltipProvider>
            <Toaster />
            <Router />
            <Chatbot />
            <CookieConsent />
          </TooltipProvider>
        </LanguageContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
