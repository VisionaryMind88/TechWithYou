import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { scrollToElement } from '@/lib/utils';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Digital workspace background" 
          className="object-cover w-full h-full" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-primary/40"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            {t('hero.title.first')} <span className="text-primary-light">{t('hero.title.highlighted')}</span> {t('hero.title.last')}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={() => scrollToElement('contact')} 
              className="bg-primary hover:bg-primary-dark text-white"
              size="lg"
            >
              {t('hero.cta_primary')}
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
            <Button 
              onClick={() => scrollToElement('portfolio')} 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
              size="lg"
            >
              {t('hero.cta_secondary')}
            </Button>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={() => scrollToElement('services')}
          className="text-white flex flex-col items-center focus:outline-none"
          aria-label={t('hero.discover_more')}
        >
          <span className="text-sm mb-2">{t('hero.discover_more')}</span>
          <i className="ri-arrow-down-line text-2xl"></i>
        </button>
      </div>
    </section>
  );
};

export default Hero;
