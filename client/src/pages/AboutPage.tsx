import { useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { About } from '@/components/About';
import { Team } from '@/components/Team';
import { Stats } from '@/components/Stats';
import { CallToAction } from '@/components/CallToAction';
import { SEO } from '@/components/SEO';

const AboutPage = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title={t('about.title')}
        description={t('about.description')}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": t('about.title'),
          "description": t('about.description'),
          "publisher": {
            "@type": "Organization",
            "name": "TechWithYou",
            "url": "https://techwithyou.nl/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://techwithyou.nl/assets/techwithyou-logo.svg"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+31-20-1234567",
              "contactType": "customer service",
              "availableLanguage": ["English", "Dutch"]
            },
            "sameAs": [
              "https://facebook.com/techwithyou",
              "https://twitter.com/techwithyou",
              "https://linkedin.com/company/techwithyou"
            ]
          },
          "about": {
            "@type": "Organization",
            "name": "TechWithYou",
            "description": t('about.description'),
            "foundingDate": "2020",
            "foundingLocation": "Amsterdam, Netherlands"
          }
        }}
      />
      
      <Header />
      <div className="pt-20"> {/* Padding to account for fixed header */}
        {/* Hero */}
        <section className="relative py-24 bg-neutral-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="About background" 
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
                {t('about.title')}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {t('about.description')}
              </p>
            </motion.div>
          </div>
        </section>

        <About />
        <Stats />
        <Team />
        <CallToAction />
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;