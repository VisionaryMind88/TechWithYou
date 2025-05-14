import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ServiceCard from '@/components/ui/service-card';
import { staggerContainer, staggerItem } from '@/lib/animations';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      id: 'website-development',
      title: t('services.items.0.title'),
      description: t('services.items.0.description'),
      features: t('services.items.0.features', { returnObjects: true }),
      icon: 'ri-layout-4-line'
    },
    {
      id: 'web-applications',
      title: t('services.items.1.title'),
      description: t('services.items.1.description'),
      features: t('services.items.1.features', { returnObjects: true }),
      icon: 'ri-code-box-line'
    },
    {
      id: 'dashboards',
      title: t('services.items.2.title'),
      description: t('services.items.2.description'),
      features: t('services.items.2.features', { returnObjects: true }),
      icon: 'ri-dashboard-3-line'
    },
    {
      id: 'ux-ui-design',
      title: t('services.items.3.title'),
      description: t('services.items.3.description'),
      features: t('services.items.3.features', { returnObjects: true }),
      icon: 'ri-palette-line'
    },
    {
      id: 'performance-optimization',
      title: t('services.items.4.title'),
      description: t('services.items.4.description'),
      features: t('services.items.4.features', { returnObjects: true }),
      icon: 'ri-speed-up-line'
    },
    {
      id: 'security-maintenance',
      title: t('services.items.5.title'),
      description: t('services.items.5.description'),
      features: t('services.items.5.features', { returnObjects: true }),
      icon: 'ri-shield-check-line'
    }
  ];

  return (
    <section id="services" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">{t('services.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('services.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">{t('services.description')}</p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={staggerItem}>
              <ServiceCard
                id={service.id}
                title={service.title}
                description={service.description}
                features={service.features as string[]}
                icon={service.icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
