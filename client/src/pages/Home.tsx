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
import { SEO } from "@/components/SEO";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useLocation } from "wouter";
import { scrollToElement } from "@/lib/utils";

interface HomeProps {
  initialSection?: string;
}

export default function Home({ initialSection }: HomeProps) {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const [location] = useLocation();
  
  // Handle navigation to section or top of page on load
  useEffect(() => {
    // Check for hash in URL (like /#services)
    const hash = window.location.hash;
    if (hash) {
      // Remove the # character
      const sectionId = hash.substring(1);
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 100);
    } else if (initialSection) {
      // If explicitly provided section via props
      setTimeout(() => {
        scrollToElement(initialSection);
      }, 100);
    } else {
      // No section specified, scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [initialSection, location]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        title={isEnglish ? "Professional Web Development" : "Professionele Web Ontwikkeling"}
        description={isEnglish 
          ? "We build high-quality, professional websites, applications, and dashboards for businesses ready for the future."
          : "Wij bouwen high-quality, professionele websites, applicaties, en dashboards voor bedrijven die klaar zijn voor de toekomst."
        }
        canonical="https://techwithyou.nl/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TechWithYou",
          "url": "https://techwithyou.nl/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "{search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "sameAs": [
            "https://www.facebook.com/techwithyou",
            "https://www.instagram.com/techwithyou",
            "https://twitter.com/techwithyou",
            "https://www.linkedin.com/company/techwithyou"
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
