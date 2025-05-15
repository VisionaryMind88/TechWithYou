import { useTranslation } from "@/hooks/use-translation";

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
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.services')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="/services#website-development" className="text-neutral-400 hover:text-white transition">
                  Website Development
                </a>
              </li>
              <li>
                <a href="/services#web-applications" className="text-neutral-400 hover:text-white transition">
                  Web Applicaties
                </a>
              </li>
              <li>
                <a href="/services#dashboards" className="text-neutral-400 hover:text-white transition">
                  Dashboards & Data Visualisatie
                </a>
              </li>
              <li>
                <a href="/services#ux-ui-design" className="text-neutral-400 hover:text-white transition">
                  UX/UI Design
                </a>
              </li>
              <li>
                <a href="/services#performance-optimization" className="text-neutral-400 hover:text-white transition">
                  Performance Optimalisatie
                </a>
              </li>
              <li>
                <a href="/services#security-maintenance" className="text-neutral-400 hover:text-white transition">
                  Beveiliging & Onderhoud
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.navigation')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-neutral-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" className="text-neutral-400 hover:text-white transition">
                  {t('header.services')}
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-neutral-400 hover:text-white transition">
                  {t('header.portfolio')}
                </a>
              </li>
              <li>
                <a href="/about" className="text-neutral-400 hover:text-white transition">
                  {t('header.about')}
                </a>
              </li>
              <li>
                <a href="/about#team" className="text-neutral-400 hover:text-white transition">
                  Team
                </a>
              </li>
              <li>
                <a href="/faq" className="text-neutral-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/contact" className="text-neutral-400 hover:text-white transition">
                  {t('header.contact')}
                </a>
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
              <a href="#" className="hover:text-neutral-300 transition">
                {t('footer.privacy')}
              </a>
              <a href="#" className="hover:text-neutral-300 transition">
                {t('footer.terms')}
              </a>
              <a href="/privacy-policy" className="hover:text-neutral-300 transition">
                {t('language') === 'en' ? 'Privacy Policy' : 'Privacybeleid'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
