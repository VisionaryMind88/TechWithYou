import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
}

export const SEO = ({
  title,
  description,
  canonical,
  ogType = "website",
}: SEOProps) => {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  
  const defaultTitle = 'Digitaal Atelier | Professional Web Development';
  const defaultDescription = isEnglish 
    ? 'We build high-quality, professional websites, applications, and dashboards for companies ready for the future.'
    : 'Wij bouwen high-quality, professionele websites, applicaties, en dashboards voor bedrijven die klaar zijn voor de toekomst.';

  const pageTitle = title ? `${title} | Digitaal Atelier` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://digitaalatelier.nl';
  const pageCanonical = canonical || currentUrl;

  useEffect(() => {
    // Update title
    document.title = pageTitle;
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", pageDescription);
    }

    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", pageTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", pageDescription);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", pageCanonical);
    }

    const ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (ogTypeMeta) {
      ogTypeMeta.setAttribute("content", ogType);
    }

    // Update Twitter meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", pageTitle);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute("content", pageDescription);
    }

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", pageCanonical);
    }
  }, [pageTitle, pageDescription, pageCanonical, ogType]);

  // This component doesn't render anything
  return null;
};