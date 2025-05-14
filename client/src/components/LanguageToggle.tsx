import { useTranslation } from "@/hooks/use-translation";

export const LanguageToggle = () => {
  const { language, changeLanguage } = useTranslation();
  
  const handleToggle = () => {
    changeLanguage(language === "nl" ? "en" : "nl");
  };

  return (
    <label className="language-toggle inline-flex items-center cursor-pointer ml-4">
      <span className="mr-2 text-sm font-medium text-white lg:text-neutral-700">NL</span>
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={language === "en"}
          onChange={handleToggle}
        />
        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer"></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${language === "en" ? "translate-x-5 bg-primary" : ""}`}></div>
      </div>
      <span className="ml-2 text-sm font-medium text-white lg:text-neutral-700">EN</span>
    </label>
  );
};
