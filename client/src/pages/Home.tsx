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
import { CallToAction } from "@/components/CallToAction";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

export default function Home() {
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
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}
