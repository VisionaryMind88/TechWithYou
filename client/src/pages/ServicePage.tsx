import { useEffect } from 'react';
import { useParams } from 'wouter';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { scrollToElement } from '@/lib/utils';
import { CallToAction } from '@/components/CallToAction';
import { Contact } from '@/components/Contact';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const ServicePage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  
  const services = [
    {
      id: 'website-development',
      title: t('services.items.0.title'),
      description: t('services.items.0.description'),
      features: t('services.items.0.features', { returnObjects: true }),
      icon: 'ri-layout-4-line',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'web-applications',
      title: t('services.items.1.title'),
      description: t('services.items.1.description'),
      features: t('services.items.1.features', { returnObjects: true }),
      icon: 'ri-code-box-line',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'dashboards',
      title: t('services.items.2.title'),
      description: t('services.items.2.description'),
      features: t('services.items.2.features', { returnObjects: true }),
      icon: 'ri-dashboard-3-line',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'ux-ui-design',
      title: t('services.items.3.title'),
      description: t('services.items.3.description'),
      features: t('services.items.3.features', { returnObjects: true }),
      icon: 'ri-palette-line',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'performance-optimization',
      title: t('services.items.4.title'),
      description: t('services.items.4.description'),
      features: t('services.items.4.features', { returnObjects: true }),
      icon: 'ri-speed-up-line',
      image: 'https://images.unsplash.com/photo-1600132806608-231446b2e7af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'security-maintenance',
      title: t('services.items.5.title'),
      description: t('services.items.5.description'),
      features: t('services.items.5.features', { returnObjects: true }),
      icon: 'ri-shield-check-line',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    }
  ];

  const service = services.find(s => s.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-bold">{t('services.not_found')}</h1>
        <Button className="mt-8" onClick={() => window.history.back()}>
          {t('common.go_back')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={service.title}
        description={service.description}
        ogType="website"
      />
      
      <Header />
      <div className="pt-20"> {/* Padding to account for fixed header */}
        {/* Hero */}
        <section className="relative py-24 bg-neutral-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={service.image} alt={service.title} className="object-cover w-full h-full opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 to-primary/40"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <div className="text-primary mb-4 text-5xl">
                <i className={service.icon}></i>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                {service.title}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl">
                {service.description}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  onClick={() => scrollToElement('contact')}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  {t('cta.start_project')}
                  <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-6">{t('service_detail.what_we_offer')}</h2>
                <p className="text-neutral-600 mb-6">
                  {t('service_detail.offer_description')}
                </p>
                <ul className="space-y-4">
                  {Array.isArray(service.features) && service.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-1 mt-1 mr-3">
                        <i className="ri-check-line text-primary"></i>
                      </div>
                      <p className="text-neutral-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold mb-6">{t('service_detail.our_approach')}</h2>
                <p className="text-neutral-600 mb-6">
                  {t('service_detail.approach_description')}
                </p>
                <div className="space-y-6">
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <span className="bg-primary/10 p-2 rounded-full mr-3">
                        <i className="ri-discuss-line text-primary"></i>
                      </span>
                      {t('process.items.0.title')}
                    </h3>
                    <p className="text-neutral-600">{t('process.items.0.description')}</p>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <span className="bg-primary/10 p-2 rounded-full mr-3">
                        <i className="ri-draft-line text-primary"></i>
                      </span>
                      {t('process.items.1.title')}
                    </h3>
                    <p className="text-neutral-600">{t('process.items.1.description')}</p>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <span className="bg-primary/10 p-2 rounded-full mr-3">
                        <i className="ri-code-s-slash-line text-primary"></i>
                      </span>
                      {t('process.items.2.title')}
                    </h3>
                    <p className="text-neutral-600">{t('process.items.2.description')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        <CallToAction />
        <Contact />
      </div>
      <Footer />
    </>
  );
};

export default ServicePage;
