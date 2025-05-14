import { motion } from "framer-motion";
import { TECH_STACK } from "@/lib/constants";
import { useTranslation } from "@/hooks/use-translation";

export const Technology = () => {
  const { t } = useTranslation();

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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-2">{t('technology.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('technology.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            {t('technology.description')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {TECH_STACK.map((tech, index) => (
            <motion.div key={index} className="flex flex-col items-center" variants={itemVariants}>
              <div className="bg-neutral-50 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                <i className={`${tech.icon} text-3xl text-primary`}></i>
              </div>
              <h3 className="text-lg font-medium">{tech.name}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
