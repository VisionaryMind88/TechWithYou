import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

export const FAQ = () => {
  const { t } = useTranslation();
  const faqs = t('faq.items', { returnObjects: true }) as any[];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-2">{t('faq.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('faq.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            {t('faq.description')}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`bg-neutral-50 rounded-lg p-6 shadow-sm cursor-pointer transition-all duration-300 ${
                  activeIndex === index ? "bg-neutral-100" : ""
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                  <div className="flex-shrink-0 text-primary">
                    <i
                      className={`${
                        activeIndex === index ? "ri-subtract-line" : "ri-add-line"
                      } text-xl transition-transform duration-300`}
                    ></i>
                  </div>
                </div>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-neutral-600"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};