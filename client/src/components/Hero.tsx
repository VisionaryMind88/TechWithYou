import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background video with overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/3c848900-ee24-477b-86c0-d8fc3d26c5b1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-primary/40"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            {t('hero.title').split('<highlight>').map((part, i, parts) => {
              if (i === 0) return <span key={i}>{part}</span>;
              const [highlighted, rest] = parts[i].split('</highlight>');
              return (
                <span key={i}>
                  <span className="text-primary-light">{highlighted}</span>
                  {rest}
                </span>
              );
            })}
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/auth"
              className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150"
            >
              {t('hero.cta')}
              <i className="ri-arrow-right-line ml-2"></i>
            </a>
            <a
              href="/portfolio"
              className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-150"
            >
              {t('hero.viewWork')}
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <a href="#services" className="text-white flex flex-col items-center">
          <span className="text-sm mb-2">{t('hero.discoverMore')}</span>
          <i className="ri-arrow-down-line text-2xl"></i>
        </a>
      </motion.div>
    </section>
  );
};
