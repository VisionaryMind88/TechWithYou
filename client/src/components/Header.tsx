import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScroll } from "@/hooks/use-scroll";
import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "@/hooks/use-translation";
import { SearchBar } from "./SearchBar";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrolledPast50 } = useScroll();
  const { t } = useTranslation();

  // Close mobile menu when clicking elsewhere
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolledPast50 ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div
                className={`text-2xl font-bold ${
                  scrolledPast50 ? "text-neutral-900" : "text-white lg:text-neutral-900"
                }`}
              >
                <span className="text-primary">Digitaal</span>Atelier
              </div>
            </a>
          </div>

          <div className="hidden md:block">
            <nav className="flex items-center space-x-8">
              <a
                href="/services"
                className={`font-medium ${
                  scrolledPast50
                    ? "text-neutral-700"
                    : "text-white lg:text-neutral-700"
                } hover:text-primary transition duration-150`}
              >
                {t('header.services')}
              </a>
              <a
                href="/portfolio"
                className={`font-medium ${
                  scrolledPast50
                    ? "text-neutral-700"
                    : "text-white lg:text-neutral-700"
                } hover:text-primary transition duration-150`}
              >
                {t('header.portfolio')}
              </a>
              <a
                href="/about"
                className={`font-medium ${
                  scrolledPast50
                    ? "text-neutral-700"
                    : "text-white lg:text-neutral-700"
                } hover:text-primary transition duration-150`}
              >
                {t('header.about')}
              </a>
              <a
                href="/faq"
                className={`font-medium ${
                  scrolledPast50
                    ? "text-neutral-700"
                    : "text-white lg:text-neutral-700"
                } hover:text-primary transition duration-150`}
              >
                FAQ
              </a>
              <a
                href="/contact"
                className={`font-medium ${
                  scrolledPast50
                    ? "text-neutral-700"
                    : "text-white lg:text-neutral-700"
                } hover:text-primary transition duration-150`}
              >
                {t('header.contact')}
              </a>

              <div className="flex items-center gap-2">
                <SearchBar />
                <LanguageToggle />
                <a
                  href="/analytics-dashboard"
                  className="text-sm bg-primary/90 hover:bg-primary text-white px-3 py-1 rounded-md transition duration-200 ml-2"
                >
                  {t('language') === 'en' ? 'Analytics' : 'Analytics'}
                </a>
              </div>
            </nav>
          </div>

          <div className="block md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={scrolledPast50 ? "text-neutral-900" : "text-white"}
              aria-label="Toggle mobile menu"
            >
              <i className={`${mobileMenuOpen ? "ri-close-line" : "ri-menu-line"} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg rounded-b-lg absolute w-full top-20 left-0 p-4 bg-blur border-t border-neutral-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col space-y-4">
              <a
                href="/services"
                onClick={closeMobileMenu}
                className="font-medium text-neutral-900 hover:text-primary transition duration-150"
              >
                {t('header.services')}
              </a>
              <a
                href="/portfolio"
                onClick={closeMobileMenu}
                className="font-medium text-neutral-900 hover:text-primary transition duration-150"
              >
                {t('header.portfolio')}
              </a>
              <a
                href="/about"
                onClick={closeMobileMenu}
                className="font-medium text-neutral-900 hover:text-primary transition duration-150"
              >
                {t('header.about')}
              </a>
              <a
                href="/faq"
                onClick={closeMobileMenu}
                className="font-medium text-neutral-900 hover:text-primary transition duration-150"
              >
                FAQ
              </a>
              <a
                href="/contact"
                onClick={closeMobileMenu}
                className="font-medium text-neutral-900 hover:text-primary transition duration-150"
              >
                {t('header.contact')}
              </a>

              <div className="pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-2 mt-2">
                  <SearchBar />
                  <LanguageToggle />
                </div>
                <a
                  href="/analytics-dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center w-full bg-primary/90 hover:bg-primary text-white px-3 py-2 rounded-md transition duration-200 mt-3"
                >
                  {t('language') === 'en' ? 'Analytics Dashboard' : 'Analytics Dashboard'}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
