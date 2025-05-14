import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

// Stats data
const statsData = [
  { value: "150+", key: "projectsCompleted" },
  { value: "98%", key: "satisfiedClients" },
  { value: "15+", key: "experts" },
  { value: "10+", key: "yearsExperience" }
];

export const Stats = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              className="text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="text-4xl font-bold mb-2"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <p className="text-primary-light font-medium">
                {t(`stats.${stat.key}`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
