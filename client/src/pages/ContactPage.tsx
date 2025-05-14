import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Contact from '@/components/home/Contact';

const ContactPage = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('meta.contact.title')} | Digitaal Atelier</title>
        <meta name="description" content={t('meta.contact.description')} />
        <meta property="og:title" content={`${t('meta.contact.title')} | Digitaal Atelier`} />
        <meta property="og:description" content={t('meta.contact.description')} />
      </Helmet>

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
    </>
  );
};

export default ContactPage;
