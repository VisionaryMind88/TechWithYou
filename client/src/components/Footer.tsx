import { useTranslation } from "@/hooks/use-translation";
import { Link } from "wouter";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold mb-6 text-primary">
              TechWithYou
            </div>
            <p className="text-neutral-400 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.linkedin.com/company/techwithyou/" target="_blank" className="text-neutral-400 hover:text-white transition">
                <i className="ri-linkedin-fill text-xl"></i>
              </Link>
              <Link href="https://twitter.com/TechWithYouNL" target="_blank" className="text-neutral-400 hover:text-white transition">
                <i className="ri-twitter-fill text-xl"></i>
              </Link>
              <Link href="https://instagram.com/techwithyou.nl" target="_blank" className="text-neutral-400 hover:text-white transition">
                <i className="ri-instagram-fill text-xl"></i>
              </Link>
              <Link href="https://facebook.com/techwithyounl" target="_blank" className="text-neutral-400 hover:text-white transition">
                <i className="ri-facebook-fill text-xl"></i>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.services')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-neutral-400 hover:text-white transition">
                  Website Development
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-neutral-400 hover:text-white transition">
                  Web Applicaties
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-neutral-400 hover:text-white transition">
                  Dashboards & Data Visualisatie
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-neutral-400 hover:text-white transition">
                  UX/UI Design
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-neutral-400 hover:text-white transition">
                  Performance Optimalisatie
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-neutral-400 hover:text-white transition">
                  Beveiliging & Onderhoud
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.navigation')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-neutral-400 hover:text-white transition">
                  {t('header.services')}
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-neutral-400 hover:text-white transition">
                  {t('header.portfolio')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition">
                  {t('header.about')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-400 hover:text-white transition">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition">
                  {t('header.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.newsletter.title')}</h3>
            <p className="text-neutral-400 mb-4">
              {t('footer.newsletter.description')}
            </p>
            <form className="flex flex-col sm:flex-row mb-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="px-4 py-2 bg-neutral-800 text-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-full mb-2 sm:mb-0"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white font-medium rounded-r-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {t('footer.newsletter.subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>{t('footer.rights')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="hover:text-neutral-300 transition">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-neutral-300 transition">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
