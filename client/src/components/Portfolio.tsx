import { motion } from "framer-motion";
import { PortfolioCard } from "./PortfolioCard";
import { PORTFOLIO_ITEMS } from "@/lib/constants";
import { useTranslation } from "@/hooks/use-translation";

export const Portfolio = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="portfolio" className="py-20 bg-neutral-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary-light font-medium mb-2">{t('portfolio.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('portfolio.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-300">
            {t('portfolio.description')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {PORTFOLIO_ITEMS.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <PortfolioCard
                title={item.title}
                description={item.description}
                image={item.image}
                category={item.category}
                technologies={item.technologies}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="#"
            className="inline-flex justify-center items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-white bg-transparent hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150"
          >
            {t('portfolio.viewAll')}
            <i className="ri-arrow-right-line ml-2"></i>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
