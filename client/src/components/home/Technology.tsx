import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TechIcon from '@/components/ui/tech-icon';
import { staggerContainer, staggerItem } from '@/lib/animations';

const Technology = () => {
  const { t } = useTranslation();

  const technologies = [
    { name: 'React', icon: 'ri-reactjs-line' },
    { name: 'Vue.js', icon: 'ri-vuejs-line' },
    { name: 'Node.js', icon: 'ri-nodejs-line' },
    { name: 'MongoDB', icon: 'ri-database-2-line' },
    { name: 'PostgreSQL', icon: 'ri-server-line' },
    { name: 'AWS', icon: 'ri-cloud-line' },
    { name: 'Firebase', icon: 'ri-google-line' },
    { name: 'TypeScript', icon: 'ri-code-s-slash-line' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">{t('technology.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('technology.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">{t('technology.description')}</p>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {technologies.map((tech) => (
            <motion.div key={tech.name} variants={staggerItem}>
              <TechIcon name={tech.name} icon={tech.icon} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Technology;
