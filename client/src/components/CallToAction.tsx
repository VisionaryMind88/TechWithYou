import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";
import { Link } from "wouter";

export const CallToAction = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-neutral-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-neutral-300 mb-8">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-neutral-900 bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-150"
              >
                {t('cta.startProject')}
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact"
                className="inline-flex justify-center items-center px-8 py-4 border border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-150"
              >
                {t('cta.scheduleCall')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
