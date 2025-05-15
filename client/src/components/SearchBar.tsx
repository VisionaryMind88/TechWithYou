import { useState } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
}

export const SearchBar = () => {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [_, navigate] = useNavigate();

  const searchData: Record<string, SearchResult[]> = {
    en: [
      {
        id: "home",
        title: "Home",
        description: "Main page of our website with all services",
        path: "/"
      },
      {
        id: "services",
        title: "Services",
        description: "Our web development, design and digital marketing services",
        path: "/#services"
      },
      {
        id: "portfolio",
        title: "Portfolio",
        description: "Explore our previous projects and case studies",
        path: "/#portfolio"
      },
      {
        id: "about",
        title: "About Us",
        description: "Learn more about our company and team",
        path: "/#about"
      },
      {
        id: "contact",
        title: "Contact",
        description: "Get in touch with our team for questions or quotes",
        path: "/#contact"
      },
      {
        id: "faq",
        title: "FAQ",
        description: "Frequently asked questions about our services",
        path: "/#faq"
      }
    ],
    nl: [
      {
        id: "home",
        title: "Home",
        description: "Hoofdpagina van onze website met alle diensten",
        path: "/"
      },
      {
        id: "services",
        title: "Diensten",
        description: "Onze webontwikkeling, design en digitale marketing diensten",
        path: "/#services"
      },
      {
        id: "portfolio",
        title: "Portfolio",
        description: "Ontdek onze eerdere projecten en casestudies",
        path: "/#portfolio"
      },
      {
        id: "about",
        title: "Over Ons",
        description: "Leer meer over ons bedrijf en team",
        path: "/#about"
      },
      {
        id: "contact",
        title: "Contact",
        description: "Neem contact op met ons team voor vragen of offertes",
        path: "/#contact"
      },
      {
        id: "faq",
        title: "FAQ",
        description: "Veelgestelde vragen over onze diensten",
        path: "/#faq"
      }
    ]
  };

  const language = t('language') as 'en' | 'nl';
  const searchResults = searchData[language].filter(item => 
    searchQuery.length > 1 && 
    (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };

  const handleSearchClick = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setSearchOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSearch}
        className={`rounded-full ${
          searchOpen ? "bg-primary/10 text-primary" : ""
        }`}
        aria-label={searchOpen ? "Close search" : "Open search"}
      >
        {searchOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <SearchIcon className="h-5 w-5" />
        )}
      </Button>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, width: 0 }}
            animate={{ opacity: 1, y: 0, width: "300px" }}
            exit={{ opacity: 0, y: 10, width: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 z-50 w-full md:w-[300px] shadow-lg rounded-lg bg-white overflow-hidden"
          >
            <div className="p-3">
              <Input
                placeholder={t('language') === 'en' ? "Search..." : "Zoeken..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>

            {searchQuery.length > 1 && (
              <div className="max-h-[400px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-2 hover:bg-neutral-100 rounded-md cursor-pointer transition-colors"
                        onClick={() => handleSearchClick(result.path)}
                      >
                        <h3 className="font-medium text-neutral-900">
                          {result.title}
                        </h3>
                        <p className="text-sm text-neutral-500">
                          {result.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-neutral-500">
                    {t('language') === 'en' ? "No results found" : "Geen resultaten gevonden"}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};