import { useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PortfolioCard } from '@/components/PortfolioCard';
import { CallToAction } from '@/components/CallToAction';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { SEO } from '@/components/SEO';

const PortfolioPage = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    },
    {
      id: 'techstart',
      title: 'TechStart Landing Page',
      category: 'Website',
      description: 'Clean, modern landing page for a tech startup focused on user engagement and lead generation.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      link: '#'
    },
    {
      id: 'fittracker',
      title: 'FitTracker App',
      category: 'Mobile App',
      description: 'Fitness tracking application with personalized workout plans and progress analytics.',
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      technologies: ['Flutter', 'Firebase', 'TensorFlow'],
      link: '#'
    },
    {
      id: 'greenearth',
      title: 'GreenEarth Platform',
      category: 'Web Platform',
      description: 'Sustainability platform connecting eco-friendly businesses with environmentally conscious consumers.',
      image: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      technologies: ['React', 'Express', 'PostgreSQL'],
      link: '#'
    }
  ];

  return (
    <>
      <SEO
        title={t('portfolio.title')}
        description={t('portfolio.description')}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": t('portfolio.title'),
          "description": t('portfolio.description'),
          "publisher": {
            "@type": "Organization",
            "name": "Digitaal Atelier",
            "url": "https://digitaalatelier.com/"
          },
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": portfolioItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "CreativeWork",
                "name": item.title,
                "description": item.description,
                "creator": {
                  "@type": "Organization",
                  "name": "Digitaal Atelier"
                },
                "image": item.image
              }
            }))
          }
        }}
      />
      
      <Header />
      <div className="pt-20"> {/* Padding to account for fixed header */}
        {/* Hero */}
        <section className="relative py-24 bg-neutral-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1481487196290-c152efe083f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="Portfolio background" 
              className="object-cover w-full h-full opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 to-primary/40"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                {t('portfolio.title')}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {t('portfolio.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
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
          </div>
        </section>

        <CallToAction />
      </div>
      <Footer />
    </>
  );
};

export default PortfolioPage;
