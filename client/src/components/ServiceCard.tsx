import { useTranslation } from "@/hooks/use-translation";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  id?: string;
}

export const ServiceCard = ({ icon, title, description, features }: ServiceCardProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-8 card-hover">
      <div className="text-primary mb-4">
        <i className={`${icon} text-3xl`}></i>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-neutral-600 mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-neutral-600">
            <i className="ri-check-line text-accent mr-2"></i>
            {feature}
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
      >
        {t('services.moreInfo')}
        <i className="ri-arrow-right-line ml-1"></i>
      </a>
    </div>
  );
};
