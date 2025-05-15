import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { isClient } from "@/lib/utils";

export const CookieConsent = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const isEnglish = t('language') === 'en';

  useEffect(() => {
    if (isClient) {
      const consentGiven = localStorage.getItem("cookieConsent");
      if (!consentGiven) {
        // Show the banner after a short delay
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const acceptCookies = () => {
    if (isClient) {
      localStorage.setItem("cookieConsent", "accepted");
      setShowBanner(false);
    }
  };

  const declineCookies = () => {
    if (isClient) {
      localStorage.setItem("cookieConsent", "declined");
      setShowBanner(false);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-neutral-200 shadow-lg"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-neutral-800 text-sm md:text-base">
                {isEnglish 
                  ? "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking \"Accept\", you consent to our use of cookies." 
                  : "We gebruiken cookies om uw browse-ervaring te verbeteren, gepersonaliseerde advertenties of inhoud weer te geven en ons verkeer te analyseren. Door op \"Accepteren\" te klikken, stemt u in met ons gebruik van cookies."}
                {" "}
                <a 
                  href="/privacy-policy" 
                  className="text-primary underline hover:text-primary/80"
                >
                  {isEnglish ? "View our Privacy Policy" : "Bekijk ons Privacybeleid"}
                </a>
              </p>
            </div>
            <div className="flex flex-shrink-0 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={declineCookies}
                className="text-sm"
              >
                {isEnglish ? "Decline" : "Weigeren"}
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={acceptCookies}
                className="bg-primary hover:bg-primary/90 text-white text-sm"
              >
                {isEnglish ? "Accept" : "Accepteren"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};