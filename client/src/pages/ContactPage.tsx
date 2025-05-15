import { useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Contact } from '@/components/Contact';
import { SEO } from '@/components/SEO';

const ContactPage = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title={t('contact.title')}
        description={t('contact.description')}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": t('contact.title'),
          "description": t('contact.description'),
          "publisher": {
            "@type": "Organization",
            "name": "TechWithYou",
            "url": "https://techwithyou.nl/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://techwithyou.nl/assets/techwithyou-logo.svg"
            }
          },
          "mainEntity": {
            "@type": "Organization",
            "name": "TechWithYou",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Prinsengracht 123",
              "addressLocality": "Amsterdam",
              "postalCode": "1015 AB",
              "addressCountry": "NL"
            },
            "telephone": "+31-20-1234567",
            "email": "info@techwithyou.nl",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+31-20-1234567",
              "email": "info@techwithyou.nl",
              "availableLanguage": ["English", "Dutch"]
            }
          }
        }}
      />
      
      <Header />
      <div className="pt-20"> {/* Padding to account for fixed header */}
        {/* Hero */}
        <section className="relative py-24 bg-neutral-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Contact background" 
              className="object-cover w-full h-full opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 to-primary/40"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                {t('contact.title')}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {t('contact.description')}
              </p>
            </motion.div>
          </div>
        </section>

        <Contact />
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
