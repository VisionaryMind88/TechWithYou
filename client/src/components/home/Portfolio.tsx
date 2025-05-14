import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import PortfolioCard from '@/components/ui/portfolio-card';
import { staggerContainer, staggerItem } from '@/lib/animations';

const Portfolio = () => {
  const { t } = useTranslation();

  const portfolioItems = [
    {
      id: 'modamarkt',
      title: t('portfolio.items.0.title'),
      category: t('portfolio.items.0.category'),
      description: t('portfolio.items.0.description'),
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'Node.js', 'MongoDB'],
      link: '#'
    },
    {
      id: 'financeinsight',
      title: t('portfolio.items.1.title'),
      category: t('portfolio.items.1.category'),
      description: t('portfolio.items.1.description'),
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      technologies: ['Vue.js', 'D3.js', 'Firebase'],
      link: '#'
    },
    {
      id: 'fresheats',
      title: t('portfolio.items.2.title'),
      category: t('portfolio.items.2.category'),
      description: t('portfolio.items.2.description'),
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      technologies: ['React Native', 'Node.js', 'GraphQL'],
      link: '#'
    }
  ];

  return (
    <section id="portfolio" className="py-20 bg-neutral-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary-light font-medium mb-2">{t('portfolio.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('portfolio.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-300">{t('portfolio.description')}</p>
        </motion.div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {portfolioItems.map((item) => (
            <motion.div key={item.id} variants={staggerItem}>
              <PortfolioCard 
                title={item.title}
                category={item.category}
                description={item.description}
                image={item.image}
                technologies={item.technologies}
                link={item.link}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <Link href="/portfolio">
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-white hover:bg-primary"
            >
              {t('portfolio.view_all')}
              <i className="ri-arrow-right-line ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
