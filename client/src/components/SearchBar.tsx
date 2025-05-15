import { useState } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";

export const SearchBar = () => {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();

  // Define search results based on current language and query
  const isEnglish = t('language') === 'en';
  
  const searchResults = searchQuery.length > 1 ? [
    {
      id: "home",
      title: isEnglish ? "Home" : "Home",
      description: isEnglish 
        ? "Main page of our website with all services" 
        : "Hoofdpagina van onze website met alle diensten",
      path: "/"
    },
    {
      id: "services",
      title: isEnglish ? "Services" : "Diensten",
      description: isEnglish 
        ? "Our web development, design and digital marketing services" 
        : "Onze webontwikkeling, design en digitale marketing diensten",
      path: "/#services"
    },
    {
      id: "portfolio",
      title: "Portfolio",
      description: isEnglish 
        ? "Explore our previous projects and case studies" 
        : "Ontdek onze eerdere projecten en casestudies",
      path: "/#portfolio"
    },
    {
      id: "about",
      title: isEnglish ? "About Us" : "Over Ons",
      description: isEnglish 
        ? "Learn more about our company and team" 
        : "Leer meer over ons bedrijf en team",
      path: "/#about"
    },
    {
      id: "contact",
      title: "Contact",
      description: isEnglish 
        ? "Get in touch with our team for questions or quotes" 
        : "Neem contact op met ons team voor vragen of offertes",
      path: "/#contact"
    },
    {
      id: "faq",
      title: "FAQ",
      description: isEnglish 
        ? "Frequently asked questions about our services" 
        : "Veelgestelde vragen over onze diensten",
      path: "/#faq"
    }
  ].filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };

  const handleSearchClick = (path: string) => {
    setLocation(path);
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
                placeholder={isEnglish ? "Search..." : "Zoeken..."}
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
                    {isEnglish ? "No results found" : "Geen resultaten gevonden"}
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