import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

// Tijdelijke portfolio items data - dit zou later uit een API moeten komen
const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Een volledig responsieve webshop met integratie van betalingssystemen en voorraadbeheer.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API']
  },
  {
    id: 2,
    title: 'Travel Agency Website',
    description: 'Een moderne website voor een reisbureau met boekingssysteem en klantreviews.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1470&auto=format&fit=crop',
    category: 'Web Design',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'TailwindCSS']
  },
  {
    id: 3,
    title: 'Healthcare Dashboard',
    description: 'Een intuïtief dashboard voor zorgverleners met patiëntgegevens en behandelplannen.',
    image: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?q=80&w=1528&auto=format&fit=crop',
    category: 'UI/UX Design',
    technologies: ['React', 'TypeScript', 'Firebase', 'Chart.js']
  }
];

const PortfolioDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { t, language } = useTranslation();
  const [portfolioItem, setPortfolioItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the portfolio item that matches the URL slug
    const foundItem = PORTFOLIO_ITEMS.find(
      (item) => item.title.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (foundItem) {
      setPortfolioItem(foundItem);
      setLoading(false);
    } else {
      // If no matching item is found, redirect to the portfolio page
      setLocation('/portfolio');
    }
  }, [slug, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-neutral-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block text-primary-light font-medium mb-2">
                  {portfolioItem.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {portfolioItem.title}
                </h1>
                <p className="text-lg text-neutral-300 mb-6">
                  {portfolioItem.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {portfolioItem.technologies.map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium bg-neutral-800 text-neutral-300 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-lg overflow-hidden shadow-xl"
              >
                <img
                  src={portfolioItem.image}
                  alt={portfolioItem.title}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                {language === 'nl' ? 'Projectoverzicht' : 'Project Overview'}
              </h2>
              
              <div className="prose prose-lg prose-stone max-w-none">
                <p>
                  {language === 'nl' ? 
                    `Voor dit project hebben we nauw samengewerkt met ${portfolioItem.title} om hun digitale visie tot leven te brengen. De uitdaging was om een platform te creëren dat niet alleen visueel aantrekkelijk is, maar ook functioneel en gebruikersvriendelijk.` :
                    `For this project, we worked closely with ${portfolioItem.title} to bring their digital vision to life. The challenge was to create a platform that is not only visually appealing but also functional and user-friendly.`
                  }
                </p>
                
                <p>
                  {language === 'nl' ? 
                    `We begonnen met een grondige analyse van de behoeften en doelstellingen van de klant. Vervolgens hebben we een strategie ontwikkeld die aansluit bij hun bedrijfsdoelen en de verwachtingen van hun doelgroep.` :
                    `We started with a thorough analysis of the client's needs and objectives. Then, we developed a strategy that aligns with their business goals and the expectations of their target audience.`
                  }
                </p>
                
                <h3>
                  {language === 'nl' ? 'Uitdagingen en Oplossingen' : 'Challenges and Solutions'}
                </h3>
                
                <p>
                  {language === 'nl' ? 
                    `Een van de grootste uitdagingen was het integreren van complexe functionaliteiten zonder de gebruikerservaring te compromitteren. We hebben gekozen voor een modulaire aanpak, waarbij elke functie intuïtief toegankelijk is.` :
                    `One of the biggest challenges was integrating complex functionalities without compromising the user experience. We chose a modular approach, making each feature intuitively accessible.`
                  }
                </p>
                
                <p>
                  {language === 'nl' ? 
                    `Daarnaast hebben we veel aandacht besteed aan de prestaties van de website, met name op mobiele apparaten. Door gebruik te maken van geavanceerde laadtechnieken en optimalisatie hebben we ervoor gezorgd dat de site snel en soepel draait op alle apparaten.` :
                    `Additionally, we paid great attention to the website's performance, particularly on mobile devices. By using advanced loading techniques and optimization, we ensured that the site runs quickly and smoothly on all devices.`
                  }
                </p>
                
                <h3>
                  {language === 'nl' ? 'Resultaten' : 'Results'}
                </h3>
                
                <p>
                  {language === 'nl' ? 
                    `Het resultaat is een moderne, responsieve website die de visie van de klant perfect weerspiegelt. De site heeft geleid tot een aanzienlijke toename in conversies en gebruikersbetrokkenheid.` :
                    `The result is a modern, responsive website that perfectly reflects the client's vision. The site has led to a significant increase in conversions and user engagement.`
                  }
                </p>
                
                <ul>
                  <li>
                    {language === 'nl' ? 
                      'Verbetering van de gebruikerservaring met 40%' :
                      '40% improvement in user experience'
                    }
                  </li>
                  <li>
                    {language === 'nl' ? 
                      'Toename van de conversieratio met 25%' :
                      '25% increase in conversion rate'
                    }
                  </li>
                  <li>
                    {language === 'nl' ? 
                      'Vermindering van de laadtijd met 60%' :
                      '60% reduction in loading time'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Next Project Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              {language === 'nl' ? 'Ontdek Meer Projecten' : 'Discover More Projects'}
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/portfolio"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150"
              >
                {language === 'nl' ? 'Bekijk Portfolio' : 'View Portfolio'}
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PortfolioDetailPage;
