import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useTranslation } from "@/hooks/use-translation";
import { useEffect } from "react";

export default function PrivacyPolicy() {
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
        title={isEnglish ? "Privacy Policy" : "Privacybeleid"}
        description={isEnglish 
          ? "Privacy Policy for Digitaal Atelier. Learn how we collect, use, and protect your personal information."
          : "Privacybeleid van Digitaal Atelier. Lees hoe wij uw persoonlijke gegevens verzamelen, gebruiken en beschermen."
        }
        ogType="article"
      />
      <Header />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-neutral-900">
              {isEnglish ? "Privacy Policy" : "Privacybeleid"}
            </h1>

            <div className="prose max-w-none">
              <p className="lead text-lg text-neutral-600 mb-8">
                {isEnglish 
                  ? "Last updated: May 15, 2023. This Privacy Policy describes how Digitaal Atelier collects, uses, and discloses your personal information."
                  : "Laatst bijgewerkt: 15 mei 2023. Dit Privacybeleid beschrijft hoe Digitaal Atelier uw persoonlijke gegevens verzamelt, gebruikt en deelt."}
              </p>

              <h2>
                {isEnglish ? "Information We Collect" : "Informatie die we verzamelen"}
              </h2>
              <p>
                {isEnglish
                  ? "We collect personal information that you voluntarily provide to us when you express interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us."
                  : "We verzamelen persoonlijke informatie die u vrijwillig aan ons verstrekt wanneer u interesse toont in het verkrijgen van informatie over ons of onze producten en diensten, wanneer u deelneemt aan activiteiten op de Website of anderszins wanneer u contact met ons opneemt."}
              </p>

              <h3>
                {isEnglish ? "Personal Information" : "Persoonlijke Informatie"}
              </h3>
              <p>
                {isEnglish
                  ? "Depending on your interactions with us, personal information we collect may include:"
                  : "Afhankelijk van uw interacties met ons kan persoonlijke informatie die we verzamelen het volgende omvatten:"}
              </p>
              <ul>
                <li>
                  {isEnglish 
                    ? "Name and contact details" 
                    : "Naam en contactgegevens"}
                </li>
                <li>
                  {isEnglish 
                    ? "Email address" 
                    : "E-mailadres"}
                </li>
                <li>
                  {isEnglish 
                    ? "Phone number" 
                    : "Telefoonnummer"}
                </li>
                <li>
                  {isEnglish 
                    ? "Company information" 
                    : "Bedrijfsinformatie"}
                </li>
                <li>
                  {isEnglish 
                    ? "Information you provide in forms and surveys" 
                    : "Informatie die u verstrekt in formulieren en enquêtes"}
                </li>
              </ul>

              <h3>
                {isEnglish ? "Automatically Collected Information" : "Automatisch verzamelde informatie"}
              </h3>
              <p>
                {isEnglish
                  ? "When you visit our website, we may automatically collect certain information about your device and usage patterns, including:"
                  : "Wanneer u onze website bezoekt, kunnen we automatisch bepaalde informatie verzamelen over uw apparaat en gebruikspatronen, waaronder:"}
              </p>
              <ul>
                <li>
                  {isEnglish 
                    ? "IP address and location data" 
                    : "IP-adres en locatiegegevens"}
                </li>
                <li>
                  {isEnglish 
                    ? "Browser and device information" 
                    : "Browser- en apparaatinformatie"}
                </li>
                <li>
                  {isEnglish 
                    ? "Pages you view" 
                    : "Pagina's die u bekijkt"}
                </li>
                <li>
                  {isEnglish 
                    ? "Referring websites" 
                    : "Verwijzende websites"}
                </li>
              </ul>

              <h2>
                {isEnglish ? "How We Use Your Information" : "Hoe we uw informatie gebruiken"}
              </h2>
              <p>
                {isEnglish
                  ? "We use the information we collect for the following purposes:"
                  : "We gebruiken de informatie die we verzamelen voor de volgende doeleinden:"}
              </p>
              <ul>
                <li>
                  {isEnglish 
                    ? "To provide, operate, and maintain our website" 
                    : "Om onze website te leveren, te bedienen en te onderhouden"}
                </li>
                <li>
                  {isEnglish 
                    ? "To respond to your inquiries and fulfill your requests" 
                    : "Om te reageren op uw vragen en aan uw verzoeken te voldoen"}
                </li>
                <li>
                  {isEnglish 
                    ? "To send administrative information, such as updates, security alerts, and support messages" 
                    : "Om administratieve informatie te verzenden, zoals updates, beveiligingswaarschuwingen en ondersteuningsberichten"}
                </li>
                <li>
                  {isEnglish 
                    ? "To personalize your experience on our website" 
                    : "Om uw ervaring op onze website te personaliseren"}
                </li>
                <li>
                  {isEnglish 
                    ? "To improve our website and services" 
                    : "Om onze website en diensten te verbeteren"}
                </li>
              </ul>

              <h2>
                {isEnglish ? "Cookies and Tracking Technologies" : "Cookies en trackingtechnologieën"}
              </h2>
              <p>
                {isEnglish
                  ? "We use cookies and similar tracking technologies to collect information about your browsing activities over time and across different websites. You can control cookies through your browser settings and other tools."
                  : "We gebruiken cookies en vergelijkbare trackingtechnologieën om informatie te verzamelen over uw browseractiviteiten in de loop van de tijd en op verschillende websites. U kunt cookies beheren via uw browserinstellingen en andere tools."}
              </p>

              <h2>
                {isEnglish ? "Your Rights" : "Uw rechten"}
              </h2>
              <p>
                {isEnglish
                  ? "Depending on your location, you may have the following rights regarding your personal information:"
                  : "Afhankelijk van uw locatie heeft u mogelijk de volgende rechten met betrekking tot uw persoonlijke gegevens:"}
              </p>
              <ul>
                <li>
                  {isEnglish 
                    ? "Right to access and receive a copy of your personal information" 
                    : "Recht op toegang tot en een kopie van uw persoonlijke gegevens"}
                </li>
                <li>
                  {isEnglish 
                    ? "Right to rectification of inaccurate information" 
                    : "Recht op rectificatie van onjuiste informatie"}
                </li>
                <li>
                  {isEnglish 
                    ? "Right to erasure of your personal information" 
                    : "Recht op wissing van uw persoonlijke gegevens"}
                </li>
                <li>
                  {isEnglish 
                    ? "Right to restrict or object to processing" 
                    : "Recht om de verwerking te beperken of hiertegen bezwaar te maken"}
                </li>
                <li>
                  {isEnglish 
                    ? "Right to data portability" 
                    : "Recht op dataportabiliteit"}
                </li>
              </ul>

              <h2>
                {isEnglish ? "Contact Us" : "Neem contact op"}
              </h2>
              <p>
                {isEnglish
                  ? "If you have any questions about this Privacy Policy, please contact us at privacy@digitaalatelier.com."
                  : "Als u vragen heeft over dit Privacybeleid, neem dan contact met ons op via privacy@digitaalatelier.com."}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}