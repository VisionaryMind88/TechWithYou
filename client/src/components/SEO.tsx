import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  structuredData?: any;
  noIndex?: boolean;
}

export const SEO = ({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  structuredData,
  noIndex = false,
}: SEOProps) => {
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  
  const siteName = 'Digitaal Atelier';
  const defaultTitle = isEnglish 
    ? 'Professional Web Development' 
    : 'Professionele Web Ontwikkeling';
  const defaultDescription = isEnglish 
    ? 'We build high-quality, professional websites, applications, and dashboards for companies ready for the future.'
    : 'Wij bouwen high-quality, professionele websites, applicaties, en dashboards voor bedrijven die klaar zijn voor de toekomst.';

  const metaTitle = title || defaultTitle;
  const fullTitle = `${metaTitle} | ${siteName}`;
  const metaDescription = description || defaultDescription;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://digitaalatelier.com/';
  const pageCanonical = canonical || currentUrl;
  
  // Default schema for WebSite
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: pageCanonical,
    description: metaDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: '{search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
  
  // Use provided structured data or default
  const schema = structuredData || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {canonical && <link rel="canonical" href={pageCanonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={isEnglish ? 'English' : 'Dutch'} />
      <meta name="author" content="Digitaal Atelier" />
    </Helmet>
  );
};