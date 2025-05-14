import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

const Process = () => {
  const { t } = useTranslation();

  const processSteps = [
    {
      id: 'discovery',
      title: t('process.items.0.title'),
      description: t('process.items.0.description'),
      icon: 'ri-discuss-line'
    },
    {
      id: 'strategy',
      title: t('process.items.1.title'),
      description: t('process.items.1.description'),
      icon: 'ri-draft-line'
    },
    {
      id: 'development',
      title: t('process.items.2.title'),
      description: t('process.items.2.description'),
      icon: 'ri-code-s-slash-line'
    },
    {
      id: 'launch',
      title: t('process.items.3.title'),
      description: t('process.items.3.description'),
      icon: 'ri-rocket-line'
    }
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
          <span className="inline-block text-primary font-medium mb-2">{t('process.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('process.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">{t('process.description')}</p>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -z-10 hidden lg:block"></div>
          
          {processSteps.map((step, index) => (
            <motion.div 
              key={step.id} 
              variants={staggerItem}
              className="relative" 
              style={{ counterIncrement: 'section' }}
            >
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-white mb-6 mx-auto lg:mx-0">
                <i className={`${step.icon} text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
              <style jsx>{`
                .relative::before {
                  counter-increment: section;
                  content: "0" counter(section);
                  font-size: 4rem;
                  font-weight: 700;
                  line-height: 1;
                  position: absolute;
                  top: -1.5rem;
                  left: -1rem;
                  color: rgba(15, 98, 254, 0.1);
                  z-index: -1;
                }
              `}</style>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
