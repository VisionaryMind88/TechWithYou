import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from 'canvas-confetti';

interface WelcomeScreenProps {
  onClose: () => void;
  onStartTour?: () => void;
}

export function WelcomeScreen({ onClose, onStartTour }: WelcomeScreenProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const isEnglish = t('language') === 'en';
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Trigger confetti effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-md relative"
        >
          <Card className="border-primary/20 overflow-hidden">
            <div className="absolute top-2 right-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                aria-label={isEnglish ? "Close welcome screen" : "Sluit welkomstscherm"}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <CardHeader className="pb-4 pt-8 text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
              <CardTitle className="text-2xl font-bold">
                {isEnglish 
                  ? `Welcome, ${user?.username || 'Client'}!` 
                  : `Welkom, ${user?.username || 'Client'}!`}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6 pb-4 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-primary"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                    <path d="M8.5 8.5v.01" />
                    <path d="M16 15.5v.01" />
                    <path d="M12 12v.01" />
                    <path d="M11 17v.01" />
                    <path d="M7 14v.01" />
                  </svg>
                </div>
                
                <p className="text-lg mb-2">
                  {isEnglish 
                    ? "Thank you for logging in to TechWithYou!" 
                    : "Bedankt voor het inloggen bij TechWithYou!"}
                </p>
                <p className="text-muted-foreground">
                  {isEnglish 
                    ? "Your client dashboard is ready. Here you can track your projects, view milestones, and communicate with our team." 
                    : "Je klantendashboard is klaar. Hier kun je je projecten volgen, mijlpalen bekijken en communiceren met ons team."}
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-2 pt-0 pb-6">
              <Button 
                onClick={onStartTour} 
                className="w-full"
                disabled={!onStartTour}
              >
                {isEnglish ? "Take a quick tour" : "Neem een korte rondleiding"}
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                {isEnglish ? "Skip and get started" : "Overslaan en beginnen"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}