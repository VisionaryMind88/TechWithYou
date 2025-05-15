import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { scrollToElement } from '@/lib/utils';

const Header = () => {
  const [location] = useLocation();
  const { t, i18n } = useI18nTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isHomePage = location === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLanguageToggle = () => {
    const newLang = language === 'nl' ? 'en' : 'nl';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  const handleNavClick = (sectionId: string) => {
    if (isHomePage) {
      // If on home page, scroll to section
      scrollToElement(sectionId);
    } else {
      // If on another page, navigate to home and then to section
      window.location.href = `/#${sectionId}`;
    }
    setIsMobileMenuOpen(false);
  };

  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled || !isHomePage || isMobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
  }`;

  const linkClass = `font-medium hover:text-primary transition duration-150 ${
    isScrolled || !isHomePage ? 'text-neutral-700' : 'text-white'
  }`;

  const mobileIconClass = `text-2xl ${
    isScrolled || !isHomePage ? 'text-neutral-900' : 'text-white'
  }`;

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className={`text-2xl font-bold ${isScrolled || !isHomePage ? 'text-neutral-900' : 'text-white'}`}>
                <span className="text-primary">Tech</span>WithYou
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <nav className="flex items-center space-x-8">
              <button 
                onClick={() => handleNavClick('services')}
                className={linkClass}
              >
                {t('nav.services')}
              </button>
              <button 
                onClick={() => handleNavClick('portfolio')}
                className={linkClass}
              >
                {t('nav.portfolio')}
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className={linkClass}
              >
                {t('nav.about')}
              </button>
              <button 
                onClick={() => handleNavClick('contact')}
                className={linkClass}
              >
                {t('nav.contact')}
              </button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLanguageToggle}
                className={linkClass}
              >
                {language === 'nl' ? 'EN' : 'NL'}
              </Button>
            </nav>
          </div>
          
          <div className="block md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-700"
            >
              {isMobileMenuOpen ? (
                <i className="ri-close-line text-2xl"></i>
              ) : (
                <i className="ri-menu-line text-2xl"></i>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-t border-neutral-100 md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => handleNavClick('services')}
                  className="font-medium text-neutral-700 hover:text-primary transition py-2"
                >
                  {t('nav.services')}
                </button>
                <button
                  onClick={() => handleNavClick('portfolio')}
                  className="font-medium text-neutral-700 hover:text-primary transition py-2"
                >
                  {t('nav.portfolio')}
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="font-medium text-neutral-700 hover:text-primary transition py-2"
                >
                  {t('nav.about')}
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="font-medium text-neutral-700 hover:text-primary transition py-2"
                >
                  {t('nav.contact')}
                </button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLanguageToggle}
                  className="w-fit font-medium text-neutral-700 hover:text-primary transition py-2"
                >
                  {language === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;