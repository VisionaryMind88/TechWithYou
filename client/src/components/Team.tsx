import { motion } from "framer-motion";
import { TeamMember } from "./TeamMember";
import { TEAM_MEMBERS } from "@/lib/constants";
import { useTranslation } from "@/hooks/use-translation";

export const Team = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="team" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-medium mb-2">{t('team.subtitle')}</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('team.title')}</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            {t('team.description')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <TeamMember
                name={member.name}
                title={member.title}
                description={member.description}
                image={member.image}
                socials={member.socials}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
