import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

export const Process = () => {
  const { t } = useTranslation();
  const steps = t('process.steps', { returnObjects: true }) as any[];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-2">{t('process.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('process.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            {t('process.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative [counter-reset:section]">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 -z-10 hidden lg:block"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative count-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-white mb-6 mx-auto lg:mx-0">
                <i className={`${step.icon} text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-neutral-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
