import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Technology } from "@/components/Technology";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { About } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Team } from "@/components/Team";
import { FAQ } from "@/components/FAQ";
import { CallToAction } from "@/components/CallToAction";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";

interface HomeProps {
  initialSection?: string;
}

export default function Home({ initialSection }: HomeProps) {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  
  // Handle navigation to section or top of page on load
  useEffect(() => {
    if (initialSection) {
      const sectionElement = document.getElementById(initialSection);
      if (sectionElement) {
        setTimeout(() => {
          const headerOffset = 120; // Adjusted for header height
          const elementPosition = sectionElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [initialSection]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SEOHead 
        title={isEnglish ? "Professional Web Development" : "Professionele Web Ontwikkeling"}
        description={isEnglish 
          ? "We build high-quality, professional websites, applications, and dashboards for businesses ready for the future."
          : "Wij bouwen high-quality, professionele websites, applicaties, en dashboards voor bedrijven die klaar zijn voor de toekomst."
        }
        canonical="https://digitaalatelier.com/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Digitaal Atelier",
          "url": "https://digitaalatelier.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "{search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "sameAs": [
            "https://www.facebook.com/digitaalatelier",
            "https://www.instagram.com/digitaalatelier",
            "https://twitter.com/digatelier",
            "https://www.linkedin.com/company/digitaal-atelier"
          ]
        }}
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <Technology />
        <Portfolio />
        <Process />
        <Testimonials />
        <About />
        <Stats />
        <Team />
        <FAQ />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}
