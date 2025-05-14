import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/use-translation";

interface PortfolioCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
}

export const PortfolioCard = ({
  title,
  description,
  image,
  category,
  technologies,
}: PortfolioCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="group overflow-hidden rounded-lg shadow-lg bg-neutral-800 relative card-hover">
      <div className="aspect-w-16 aspect-h-10 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/20 text-primary-light rounded-full mb-3">
          {category}
        </span>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-neutral-400 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-neutral-700 text-neutral-300 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
        <a
          href="#"
          className="inline-flex items-center text-primary-light hover:text-primary font-medium"
        >
          {t('portfolio.viewCase')}
          <i className="ri-arrow-right-line ml-1"></i>
        </a>
      </div>
    </div>
  );
};
