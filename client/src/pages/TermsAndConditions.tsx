import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useTranslation } from "@/hooks/use-translation";
import { useEffect } from "react";

export default function TermsAndConditions() {
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
        title={isEnglish ? "Terms and Conditions" : "Algemene Voorwaarden"}
        description={isEnglish 
          ? "Terms and Conditions for TechWithYou. Read about our terms of service, user agreements, and policies."
          : "Algemene Voorwaarden van TechWithYou. Lees over onze servicevoorwaarden, gebruikersovereenkomsten en beleid."
        }
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": isEnglish ? "Terms and Conditions" : "Algemene Voorwaarden",
          "description": isEnglish 
            ? "Terms and Conditions for TechWithYou. Read about our terms of service, user agreements, and policies."
            : "Algemene Voorwaarden van TechWithYou. Lees over onze servicevoorwaarden, gebruikersovereenkomsten en beleid.",
          "publisher": {
            "@type": "Organization",
            "name": "TechWithYou",
            "url": "https://techwithyou.nl/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://techwithyou.nl/assets/techwithyou-logo.svg"
            }
          },
          "mainEntity": {
            "@type": "WebPage",
            "lastReviewed": "2023-05-15",
            "author": {
              "@type": "Organization",
              "name": "TechWithYou"
            }
          }
        }}
      />

      <Header />

      <main className="bg-white pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {isEnglish ? "Terms and Conditions" : "Algemene Voorwaarden"}
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              {isEnglish 
                ? "Last updated: May 15, 2023"
                : "Laatst bijgewerkt: 15 mei 2023"
              }
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-primary max-w-none"
          >
            {isEnglish ? (
              // English Terms and Conditions
              <>
                <h2>1. Introduction</h2>
                <p>Welcome to TechWithYou. These Terms and Conditions govern your use of our website and services. By accessing or using our website and services, you agree to be bound by these Terms and Conditions.</p>
                
                <h2>2. Definitions</h2>
                <p>"TechWithYou", "we", "us", or "our" refers to TechWithYou B.V., a company registered in the Netherlands.</p>
                <p>"Client", "you", or "your" refers to any individual or entity that uses our services or accesses our website.</p>
                <p>"Services" refers to all services offered by TechWithYou, including but not limited to website development, web application development, dashboard development, design services, and consultation.</p>
                
                <h2>3. Services</h2>
                <p>TechWithYou provides digital services including website development, web application development, dashboard creation, and related services.</p>
                <p>All services are provided on a best-effort basis, and we strive to meet all agreed-upon deadlines and requirements.</p>
                <p>Any timelines provided are estimates and may be subject to change based on project complexity and client responsiveness.</p>
                
                <h2>4. Client Responsibilities</h2>
                <p>Clients are responsible for providing accurate and timely information required for project completion.</p>
                <p>Clients must review and provide feedback on deliverables within agreed timeframes.</p>
                <p>Delays in providing necessary information or feedback may result in project timeline adjustments.</p>
                
                <h2>5. Payment Terms</h2>
                <p>Payment terms are as specified in individual project agreements.</p>
                <p>Standard payment structure includes a 50% deposit to begin the project, with the remaining balance due upon completion.</p>
                <p>For larger projects, payments may be divided into multiple milestones.</p>
                <p>All invoices are due within 14 days of issuance unless otherwise specified.</p>
                
                <h2>6. Intellectual Property</h2>
                <p>Upon full payment, clients receive ownership rights to the final deliverables, excluding third-party elements (such as stock photos, plugins, or themes) which are subject to their own licensing terms.</p>
                <p>TechWithYou retains the right to showcase the completed work in its portfolio unless explicitly agreed otherwise.</p>
                
                <h2>7. Confidentiality</h2>
                <p>We respect client confidentiality and will not disclose proprietary information to third parties without consent.</p>
                <p>Clients agree not to disclose confidential information about our business processes, methodologies, or proprietary technologies.</p>
                
                <h2>8. Limitation of Liability</h2>
                <p>TechWithYou shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
                <p>Our total liability is limited to the amount paid for the specific services in question.</p>
                
                <h2>9. Termination</h2>
                <p>Either party may terminate the service agreement with 30 days' written notice.</p>
                <p>Upon termination, the client is responsible for payment of all work completed up to the termination date.</p>
                
                <h2>10. Governing Law</h2>
                <p>These Terms and Conditions are governed by the laws of the Netherlands.</p>
                <p>Any disputes shall be resolved in the courts of the Netherlands.</p>
                
                <h2>11. Contact Information</h2>
                <p>For questions regarding these Terms and Conditions, please contact us at info@techwithyou.nl.</p>
              </>
            ) : (
              // Dutch Terms and Conditions
              <>
                <h2>1. Inleiding</h2>
                <p>Welkom bij TechWithYou. Deze Algemene Voorwaarden regelen uw gebruik van onze website en diensten. Door toegang te krijgen tot of gebruik te maken van onze website en diensten, gaat u akkoord met deze Algemene Voorwaarden.</p>
                
                <h2>2. Definities</h2>
                <p>"TechWithYou", "wij", "ons" of "onze" verwijst naar TechWithYou B.V., een in Nederland geregistreerd bedrijf.</p>
                <p>"Klant", "u" of "uw" verwijst naar elke persoon of entiteit die onze diensten gebruikt of toegang heeft tot onze website.</p>
                <p>"Diensten" verwijst naar alle diensten die door TechWithYou worden aangeboden, inclusief maar niet beperkt tot website-ontwikkeling, webapplicatie-ontwikkeling, dashboard-ontwikkeling, ontwerpservices en consultatie.</p>
                
                <h2>3. Diensten</h2>
                <p>TechWithYou biedt digitale diensten aan, waaronder website-ontwikkeling, webapplicatie-ontwikkeling, dashboard-creatie en aanverwante diensten.</p>
                <p>Alle diensten worden op een 'best-effort' basis geleverd, en we streven ernaar om aan alle overeengekomen deadlines en vereisten te voldoen.</p>
                <p>Alle aangegeven tijdlijnen zijn schattingen en kunnen worden aangepast op basis van projectcomplexiteit en reactiesnelheid van de klant.</p>
                
                <h2>4. Verantwoordelijkheden van de Klant</h2>
                <p>Klanten zijn verantwoordelijk voor het verstrekken van nauwkeurige en tijdige informatie die nodig is voor de voltooiing van het project.</p>
                <p>Klanten moeten deliverables binnen de afgesproken tijdsbestekken beoordelen en feedback geven.</p>
                <p>Vertragingen bij het verstrekken van noodzakelijke informatie of feedback kunnen leiden tot aanpassingen van de projectplanning.</p>
                
                <h2>5. Betalingsvoorwaarden</h2>
                <p>Betalingsvoorwaarden zijn zoals gespecificeerd in individuele projectovereenkomsten.</p>
                <p>Standaard betalingsstructuur omvat een aanbetaling van 50% om het project te starten, waarbij het resterende saldo verschuldigd is bij voltooiing.</p>
                <p>Voor grotere projecten kunnen betalingen in meerdere mijlpalen worden verdeeld.</p>
                <p>Alle facturen dienen binnen 14 dagen na uitgifte te worden voldaan, tenzij anders aangegeven.</p>
                
                <h2>6. Intellectueel Eigendom</h2>
                <p>Na volledige betaling ontvangen klanten eigendomsrechten op de definitieve deliverables, exclusief elementen van derden (zoals stockfoto's, plugins of thema's) die onderworpen zijn aan hun eigen licentievoorwaarden.</p>
                <p>TechWithYou behoudt het recht om het voltooide werk in zijn portfolio te tonen, tenzij uitdrukkelijk anders overeengekomen.</p>
                
                <h2>7. Vertrouwelijkheid</h2>
                <p>Wij respecteren de vertrouwelijkheid van de klant en zullen geen eigendomsrechtelijk beschermde informatie aan derden bekendmaken zonder toestemming.</p>
                <p>Klanten stemmen ermee in geen vertrouwelijke informatie over onze bedrijfsprocessen, methodologieën of eigen technologieën bekend te maken.</p>
                
                <h2>8. Beperking van Aansprakelijkheid</h2>
                <p>TechWithYou is niet aansprakelijk voor indirecte, incidentele of gevolgschade die voortvloeit uit het gebruik van onze diensten.</p>
                <p>Onze totale aansprakelijkheid is beperkt tot het bedrag dat is betaald voor de specifieke diensten in kwestie.</p>
                
                <h2>9. Beëindiging</h2>
                <p>Elke partij kan de dienstverleningsovereenkomst beëindigen met een schriftelijke kennisgeving van 30 dagen.</p>
                <p>Bij beëindiging is de klant verantwoordelijk voor de betaling van alle werkzaamheden die tot de datum van beëindiging zijn voltooid.</p>
                
                <h2>10. Toepasselijk Recht</h2>
                <p>Deze Algemene Voorwaarden worden beheerst door de wetten van Nederland.</p>
                <p>Eventuele geschillen worden beslecht door de rechtbanken in Nederland.</p>
                
                <h2>11. Contactinformatie</h2>
                <p>Voor vragen over deze Algemene Voorwaarden kunt u contact met ons opnemen via info@techwithyou.nl.</p>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}