import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useTranslation } from "@/hooks/use-translation";
import { useLocation } from "wouter";

export default function NotFound() {
  const { t } = useTranslation();
  const [_, setLocation] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        title={t('language') === 'en' ? "404 - Page Not Found" : "404 - Pagina Niet Gevonden"}
        description={t('language') === 'en' 
          ? "The page you are looking for doesn't exist or has been moved. Please navigate back to our homepage."
          : "De pagina die u zoekt bestaat niet of is verplaatst. Ga terug naar onze homepagina."
        }
        noIndex={true}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": t('language') === 'en' ? "404 - Page Not Found" : "404 - Pagina Niet Gevonden",
          "description": t('language') === 'en' 
            ? "The page you are looking for doesn't exist or has been moved. Please navigate back to our homepage."
            : "De pagina die u zoekt bestaat niet of is verplaatst. Ga terug naar onze homepagina.",
          "publisher": {
            "@type": "Organization",
            "name": "Digitaal Atelier",
            "url": "https://digitaalatelier.com/"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://digitaalatelier.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": t('language') === 'en' ? "404 - Page Not Found" : "404 - Pagina Niet Gevonden"
              }
            ]
          }
        }}
      />
      <Header />
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-white py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto px-6"
        >
          <div className="mb-6">
            <span className="text-9xl font-bold text-primary">404</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-6">
            {t('language') === 'en' ? 'Page Not Found' : 'Pagina Niet Gevonden'}
          </h1>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            {t('language') === 'en' 
              ? 'Sorry, the page you are looking for might have been removed or is temporarily unavailable.' 
              : 'Sorry, de pagina die je zoekt is mogelijk verwijderd of tijdelijk niet beschikbaar.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/")}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {t('language') === 'en' ? 'Back to Homepage' : 'Terug naar Homepagina'}
            </Button>
            <Button
              onClick={() => setLocation("/#contact")}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10"
            >
              {t('language') === 'en' ? 'Contact Us' : 'Neem Contact Op'}
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <svg width="250" height="120" viewBox="0 0 250 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24.5 85.5C27.5 69.5 39.5 38.5 71.5 40.5C111 43 127 79 171.5 77.5C216 76 239 40.5 239 40.5" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8"/>
            <circle cx="24" cy="85" r="12" fill="#3B82F6"/>
            <circle cx="239" cy="40" r="12" fill="#3B82F6"/>
            <path d="M85 64L105 44M105 64L85 44" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
            <path d="M145 64L165 44M165 64L145 44" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
}
