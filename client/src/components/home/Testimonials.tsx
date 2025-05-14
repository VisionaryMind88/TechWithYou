import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import TestimonialCard from '@/components/ui/testimonial-card';
import { staggerContainer, staggerItem } from '@/lib/animations';

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 1,
      content: t('testimonials.items.0.content'),
      author: {
        name: t('testimonials.items.0.author.name'),
        title: t('testimonials.items.0.author.title'),
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
      }
    },
    {
      id: 2,
      content: t('testimonials.items.1.content'),
      author: {
        name: t('testimonials.items.1.author.name'),
        title: t('testimonials.items.1.author.title'),
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
      }
    },
    {
      id: 3,
      content: t('testimonials.items.2.content'),
      author: {
        name: t('testimonials.items.2.author.name'),
        title: t('testimonials.items.2.author.title'),
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80'
      }
    }
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-medium mb-2">{t('testimonials.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('testimonials.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">{t('testimonials.description')}</p>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={staggerItem}>
              <TestimonialCard 
                content={testimonial.content}
                author={testimonial.author}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
