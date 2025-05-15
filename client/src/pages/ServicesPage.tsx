import { useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Services } from '@/components/Services';
import { CallToAction } from '@/components/CallToAction';

const ServicesPage = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Get hash from URL (if any)
    const hash = window.location.hash;
    
    if (hash) {
      // Remove the # character
      const id = hash.substring(1);
      
      // Find the element
      const element = document.getElementById(id);
      
      if (element) {
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
          // Account for fixed header
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 300);
      } else {
        // If no element found, scroll to top
        window.scrollTo(0, 0);
      }
    } else {
      // No hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('services.title')} | Digitaal Atelier</title>
        <meta name="description" content={t('services.description')} />
        <meta property="og:title" content={`${t('services.title')} | Digitaal Atelier`} />
        <meta property="og:description" content={t('services.description')} />
      </Helmet>
      
      <Header />
      <div className="pt-20"> {/* Padding to account for fixed header */}
        {/* Hero */}
        <section className="relative py-24 bg-neutral-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Services background" 
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
                {t('services.title')}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {t('services.description')}
              </p>
            </motion.div>
          </div>
        </section>

        <Services />
        
        {/* Additional Services */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-primary font-medium mb-2">{t('language') === 'en' ? 'Additional expertise' : 'Aanvullende expertise'}</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('language') === 'en' ? 'More Services' : 'Meer Diensten'}</h2>
              <p className="max-w-2xl mx-auto text-neutral-600">
                {t('language') === 'en' 
                  ? 'We offer additional specialized services to complete your digital projects' 
                  : 'We bieden aanvullende gespecialiseerde diensten om uw digitale projecten compleet te maken'}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* UX/UI Design */}
              <motion.div 
                id="ux-ui-design"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-lg shadow-lg p-8 border border-neutral-100 hover:border-primary hover:shadow-xl transition duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="ri-palette-line text-2xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">UX/UI Design</h3>
                <p className="text-neutral-600 mb-6">
                  {t('language') === 'en' 
                    ? 'User-centered design that makes your digital products intuitive and engaging for your users.' 
                    : 'Gebruikersgericht ontwerp dat uw digitale producten intuïtief en aantrekkelijk maakt voor uw gebruikers.'}
                </p>
                <ul className="space-y-2">
                  {[
                    t('language') === 'en' ? 'User Experience Research' : 'Gebruikerservaring Onderzoek',
                    t('language') === 'en' ? 'User Interface Design' : 'Gebruikersinterface Ontwerp',
                    t('language') === 'en' ? 'Wireframing & Prototyping' : 'Wireframing & Prototyping',
                    t('language') === 'en' ? 'Usability Testing' : 'Bruikbaarheidstesten'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span className="text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              {/* Performance Optimization */}
              <motion.div 
                id="performance-optimization"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-8 border border-neutral-100 hover:border-primary hover:shadow-xl transition duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="ri-speed-line text-2xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {t('language') === 'en' ? 'Performance Optimization' : 'Performance Optimalisatie'}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {t('language') === 'en' 
                    ? 'Speed up your website and applications for better user experience and search engine rankings.' 
                    : 'Versnel uw website en applicaties voor een betere gebruikerservaring en zoekmachinerangschikkingen.'}
                </p>
                <ul className="space-y-2">
                  {[
                    t('language') === 'en' ? 'Page Load Speed Optimization' : 'Paginalaadsnelheid Optimalisatie',
                    t('language') === 'en' ? 'Code Minification & Bundling' : 'Code Minificatie & Bundeling',
                    t('language') === 'en' ? 'Image & Media Optimization' : 'Afbeelding & Media Optimalisatie',
                    t('language') === 'en' ? 'Caching Strategies' : 'Caching Strategieën'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span className="text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              {/* Security & Maintenance */}
              <motion.div 
                id="security-maintenance"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-8 border border-neutral-100 hover:border-primary hover:shadow-xl transition duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <i className="ri-shield-check-line text-2xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">
                  {t('language') === 'en' ? 'Security & Maintenance' : 'Beveiliging & Onderhoud'}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {t('language') === 'en' 
                    ? 'Keep your digital assets secure and up-to-date with our comprehensive security and maintenance services.' 
                    : 'Houd uw digitale bezittingen veilig en up-to-date met onze uitgebreide beveiligings- en onderhoudsdiensten.'}
                </p>
                <ul className="space-y-2">
                  {[
                    t('language') === 'en' ? 'Security Audits & Monitoring' : 'Beveiligingsaudits & Monitoring',
                    t('language') === 'en' ? 'Regular Updates & Maintenance' : 'Regelmatige Updates & Onderhoud',
                    t('language') === 'en' ? 'Backup & Recovery Solutions' : 'Backup & Hersteloplossingen',
                    t('language') === 'en' ? 'SSL Implementation' : 'SSL Implementatie'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-primary mt-1 mr-2"></i>
                      <span className="text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
        
        <CallToAction />
      </div>
      <Footer />
    </>
  );
};

export default ServicesPage;