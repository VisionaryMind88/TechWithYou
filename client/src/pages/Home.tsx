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

export default function Home() {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  
  // Scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
