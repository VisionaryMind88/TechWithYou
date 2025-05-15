import { Helmet } from 'react-helmet';
import { useTranslation } from '@/hooks/use-translation';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  twitterCardType?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: any;
  noIndex?: boolean;
}

export const SEOHead = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  articlePublishedTime,
  articleModifiedTime,
  twitterCardType = 'summary_large_image',
  structuredData,
  noIndex = false
}: SEOHeadProps) => {
  const { t } = useTranslation();
  const siteName = 'TechWithYou';
  const defaultTitle = t('language') === 'en' ? 'Professional Web Development' : 'Professionele Web Ontwikkeling';
  const defaultDescription = t('language') === 'en' 
    ? 'We build high-quality, professional websites, applications, and dashboards for businesses ready for the future.'
    : 'Wij bouwen high-quality, professionele websites, applicaties, en dashboards voor bedrijven die klaar zijn voor de toekomst.';
  
  // Use provided values or defaults
  const metaTitle = title || defaultTitle;
  const metaDescription = description || defaultDescription;
  const fullTitle = `${metaTitle} | ${siteName}`;
  
  // Default schema for WebSite
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: canonical || 'https://techwithyou.nl/',
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
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Article-specific tags if applicable */}
      {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content={t('language') === 'en' ? 'English' : 'Dutch'} />
      <meta name="author" content="TechWithYou" />
    </Helmet>
  );
};