import { motion } from "framer-motion";
import { ServiceCard } from "./ServiceCard";
import { useTranslation } from "@/hooks/use-translation";

export const Services = () => {
  const { t } = useTranslation();
  const services = [
    {
      id: 'website-development',
      title: t('services.items.0.title'),
      description: t('services.items.0.description'),
      features: t('services.items.0.features', { returnObjects: true }) as string[],
      icon: 'ri-layout-4-line'
    },
    {
      id: 'web-applications',
      title: t('services.items.1.title'),
      description: t('services.items.1.description'),
      features: t('services.items.1.features', { returnObjects: true }) as string[],
      icon: 'ri-code-box-line'
    },
    {
      id: 'dashboards',
      title: t('services.items.2.title'),
      description: t('services.items.2.description'),
      features: t('services.items.2.features', { returnObjects: true }) as string[],
      icon: 'ri-dashboard-3-line'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="services" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-2">{t('services.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('services.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            {t('services.description')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                id={service.id}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
