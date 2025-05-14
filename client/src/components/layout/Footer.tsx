import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!email || !email.includes('@')) {
      toast({
        title: t('newsletter.invalid_email'),
        description: t('newsletter.please_enter_valid_email'),
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would send the email to your backend
    toast({
      title: t('newsletter.thank_you'),
      description: t('newsletter.subscribed_successfully'),
    });
    setEmail('');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold mb-6">
              <span className="text-primary">Digitaal</span>Atelier
            </div>
            <p className="text-neutral-400 mb-6">
              {t('footer.company_description')}
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition">
                <i className="ri-instagram-fill text-xl"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.services')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services/website-development" className="text-neutral-400 hover:text-white transition">
                  {t('services.items.0.title')}
                </Link>
              </li>
              <li>
                <Link href="/services/web-applications" className="text-neutral-400 hover:text-white transition">
                  {t('services.items.1.title')}
                </Link>
              </li>
              <li>
                <Link href="/services/dashboards" className="text-neutral-400 hover:text-white transition">
                  {t('services.items.2.title')}
                </Link>
              </li>
              <li>
                <Link href="/services/ux-ui-design" className="text-neutral-400 hover:text-white transition">
                  {t('services.items.3.title')}
                </Link>
              </li>
              <li>
                <Link href="/services/performance-optimization" className="text-neutral-400 hover:text-white transition">
                  {t('services.items.4.title')}
                </Link>
              </li>
              <li>
                <Link href="/services/security-maintenance" className="text-neutral-400 hover:text-white transition">
                  {t('services.items.5.title')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.navigation')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white transition">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-neutral-400 hover:text-white transition text-left"
                >
                  {t('nav.services')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="text-neutral-400 hover:text-white transition text-left"
                >
                  {t('nav.portfolio')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-neutral-400 hover:text-white transition text-left"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('team')}
                  className="text-neutral-400 hover:text-white transition text-left"
                >
                  {t('nav.team')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-neutral-400 hover:text-white transition text-left"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.newsletter')}</h3>
            <p className="text-neutral-400 mb-4">
              {t('footer.newsletter_desc')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row mb-4">
              <Input
                type="email"
                placeholder={t('footer.email_placeholder')}
                className="bg-neutral-800 text-white border-neutral-700 rounded-l-md focus:border-primary w-full mb-2 sm:mb-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                type="submit" 
                className="bg-primary text-white font-medium rounded-r-md hover:bg-primary-dark"
              >
                {t('footer.subscribe')}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Digitaal Atelier. {t('footer.copyright')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-neutral-300 transition">
                {t('footer.privacy_policy')}
              </Link>
              <Link href="/terms" className="hover:text-neutral-300 transition">
                {t('footer.terms')}
              </Link>
              <Link href="/cookies" className="hover:text-neutral-300 transition">
                {t('footer.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
