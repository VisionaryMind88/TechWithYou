import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

export const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-primary font-medium mb-2">{t('about.subtitle')}</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('about.title')}</h2>
            <p className="text-neutral-600 mb-6">
              {t('about.description1')}
            </p>
            <p className="text-neutral-600 mb-8">
              {t('about.description2')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="#team"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150"
              >
                {t('about.meetTeam')}
              </a>
              <a
                href="#contact"
                className="inline-flex justify-center items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150"
              >
                {t('about.contact')}
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Team working together in a modern office"
              className="rounded-lg shadow-lg w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
