import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

// Creating placeholder testimonials
const testimonials = [
  {
    content: "Het team heeft onze visie perfect vertaald naar een moderne website die precies aansluit bij onze doelgroep. Zeer tevreden met het resultaat en de samenwerking.",
    name: "Sarah Janssen",
    position: "Marketing Director, ModaMarkt",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    content: "De dashboards die ze voor ons hebben ontwikkeld hebben ons bedrijf compleet getransformeerd. We kunnen nu veel sneller beslissingen nemen op basis van realtime data.",
    name: "Thomas de Vries",
    position: "CEO, FinanceInsight",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    content: "Onze mobiele app heeft alle verwachtingen overtroffen. De gebruikerservaring is naadloos en we hebben een significant hogere conversie dan verwacht.",
    name: "Emma Bakker",
    position: "Product Owner, FreshEats",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  }
];

export const Testimonials = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-2">{t('testimonials.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('testimonials.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            {t('testimonials.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md p-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-primary mb-6">
                <i className="ri-double-quotes-l text-4xl opacity-20"></i>
              </div>
              <p className="text-neutral-600 mb-6 italic">{testimonial.content}</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-neutral-200 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-500">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
