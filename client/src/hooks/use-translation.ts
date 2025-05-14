import { createContext, useContext } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";

// Define the type for language context
type LanguageContextType = {
  language: "nl" | "en";
  setLanguage: (lang: "nl" | "en") => void;
};

// Create context with default values
export const LanguageContext = createContext<LanguageContextType>({
  language: "nl",
  setLanguage: () => {}
});

// Custom hook to use both our language context and i18n
export const useTranslation = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lang: "nl" | "en") => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return {
    t,
    i18n,
    language,
    changeLanguage
  };
};
