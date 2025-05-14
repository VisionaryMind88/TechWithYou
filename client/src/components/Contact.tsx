import { motion } from "framer-motion";
import { ContactForm } from "./ContactForm";
import { useTranslation } from "@/hooks/use-translation";

export const Contact = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-2">{t('contact.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <ContactForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-neutral-50 rounded-lg p-8 h-full">
              <h3 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center text-primary">
                      <i className="ri-map-pin-line"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-1">{t('contact.info.address')}</h4>
                    <p className="text-neutral-600">
                      Stationsplein 123<br />
                      1012 AB Amsterdam
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center text-primary">
                      <i className="ri-mail-line"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-1">{t('contact.info.email')}</h4>
                    <p className="text-neutral-600">
                      <a
                        href="mailto:info@digitaalatelier.nl"
                        className="text-primary hover:text-primary-dark transition"
                      >
                        info@digitaalatelier.nl
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center text-primary">
                      <i className="ri-phone-line"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold mb-1">{t('contact.info.phone')}</h4>
                    <p className="text-neutral-600">
                      <a
                        href="tel:+31201234567"
                        className="text-primary hover:text-primary-dark transition"
                      >
                        +31 20 123 4567
                      </a>
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <h4 className="text-lg font-semibold mb-4">{t('contact.info.followUs')}</h4>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="bg-neutral-200 hover:bg-primary hover:text-white transition duration-300 rounded-full w-10 h-10 flex items-center justify-center"
                    >
                      <i className="ri-linkedin-fill"></i>
                    </a>
                    <a
                      href="#"
                      className="bg-neutral-200 hover:bg-primary hover:text-white transition duration-300 rounded-full w-10 h-10 flex items-center justify-center"
                    >
                      <i className="ri-twitter-fill"></i>
                    </a>
                    <a
                      href="#"
                      className="bg-neutral-200 hover:bg-primary hover:text-white transition duration-300 rounded-full w-10 h-10 flex items-center justify-center"
                    >
                      <i className="ri-instagram-fill"></i>
                    </a>
                    <a
                      href="#"
                      className="bg-neutral-200 hover:bg-primary hover:text-white transition duration-300 rounded-full w-10 h-10 flex items-center justify-center"
                    >
                      <i className="ri-facebook-fill"></i>
                    </a>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200">
                  <h4 className="text-lg font-semibold mb-4">{t('contact.info.openingHours')}</h4>
                  <p className="text-neutral-600 whitespace-pre-line">
                    {t('contact.info.hours')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
