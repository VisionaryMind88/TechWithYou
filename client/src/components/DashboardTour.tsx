import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Define the steps for the tour
interface TourStep {
  target: string;
  title: string;
  titleNL: string;
  content: string;
  contentNL: string;
  placement?: "top" | "right" | "bottom" | "left";
  // Alternatieve targets als het primaire doel niet wordt gevonden
  fallbackTargets?: string[];
}

const defaultTourSteps: TourStep[] = [
  {
    target: ".dashboard-sidebar",
    fallbackTargets: ["header", "nav", ".header"],
    title: "Navigation",
    titleNL: "Navigatie",
    content: "Use this sidebar to navigate between different sections of your dashboard.",
    contentNL: "Gebruik deze zijbalk om te navigeren tussen verschillende onderdelen van je dashboard.",
    placement: "right"
  },
  {
    target: ".dashboard-projects",
    fallbackTargets: [
      "[data-tour-target='projects-title']", 
      "[data-tour-target='projects-tab-trigger']", 
      "[value='projects']", 
      ".TabsContent:first-of-type"
    ],
    title: "Your Projects",
    titleNL: "Je Projecten",
    content: "Here you can see all your active projects and their status.",
    contentNL: "Hier kun je al je actieve projecten en hun status bekijken.",
    placement: "bottom"
  },
  {
    target: ".dashboard-milestones",
    fallbackTargets: [
      "[data-tour-target='activity-tab']", 
      "[data-tour-target='activity-title']", 
      "[data-tour-target='activity-tab-trigger']", 
      "[value='activity']"
    ],
    title: "Recent Activity",
    titleNL: "Recente Activiteit",
    content: "Here you can see recent activity and track the progress of your projects.",
    contentNL: "Hier zie je recente activiteit en kun je de voortgang van je projecten volgen.",
    placement: "bottom"
  },
  {
    target: ".dashboard-files",
    fallbackTargets: [
      "[data-tour-target='files-tab']", 
      "[data-tour-target='files-title']", 
      "[data-tour-target='files-tab-trigger']", 
      "[value='files']"
    ],
    title: "Project Files",
    titleNL: "Project Bestanden",
    content: "Access and manage all files related to your projects.",
    contentNL: "Bekijk en beheer alle bestanden die bij je projecten horen.",
    placement: "left"
  },
  {
    target: ".dashboard-notifications",
    fallbackTargets: [".notification-bell", ".notifications-button", "button:has(.bell)"],
    title: "Notifications",
    titleNL: "Meldingen",
    content: "Stay updated with the latest changes and announcements.",
    contentNL: "Blijf op de hoogte van de laatste wijzigingen en aankondigingen.",
    placement: "bottom"
  }
];

interface DashboardTourProps {
  onComplete: () => void;
  onSkip: () => void;
  steps?: TourStep[];
}

export function DashboardTour({ onComplete, onSkip, steps = defaultTourSteps }: DashboardTourProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isEnglish = t('language') === 'en';
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  
  console.log("Tour started");
  trackEvent('tour_started', 'onboarding', 'dashboard');
  
  // Function to find target element with retry
  useEffect(() => {
    if (!isVisible) return;
    
    const step = steps[currentStep];
    let retryCount = 0;
    const maxRetries = 5;
    const retryInterval = 500; // 500ms between retries
    
    // Gebruik een interval om periodiek te proberen het element te vinden
    const findElement = () => {
      console.log(`Looking for target element: ${step.target} (attempt ${retryCount + 1})`);
      let element = document.querySelector(step.target) as HTMLElement;
      
      // Als het hoofddoel niet is gevonden, probeer de fallback targets
      if (!element && step.fallbackTargets && step.fallbackTargets.length > 0) {
        console.log(`Main target not found, trying fallback targets:`, step.fallbackTargets);
        
        // Probeer elk fallback target
        for (const fallbackTarget of step.fallbackTargets) {
          console.log(`Trying fallback target: ${fallbackTarget}`);
          element = document.querySelector(fallbackTarget) as HTMLElement;
          if (element) {
            console.log(`Found element with fallback target: ${fallbackTarget}`);
            break;
          }
        }
      }
      
      if (element) {
        console.log(`Found target element:`, element);
        setTargetElement(element);
        
        // Scroll the element into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add highlight effect to target element
        const originalOutline = element.style.outline;
        const originalPosition = element.style.position;
        const originalZIndex = element.style.zIndex;
        
        // Add highlight styles
        element.style.outline = '2px solid var(--primary)';
        element.style.position = 'relative';
        element.style.zIndex = '1000';
        
        clearInterval(intervalId);
        
        // Cleanup function to restore original styles
        return () => {
          if (element) {
            element.style.outline = originalOutline;
            element.style.position = originalPosition;
            element.style.zIndex = originalZIndex;
          }
        };
      } else {
        retryCount++;
        
        if (retryCount >= maxRetries) {
          clearInterval(intervalId);
          
          // If element is not found after retries, show an error and skip this step
          console.error(`Tour target not found after ${maxRetries} attempts: ${step.target}`);
          console.log(`All available elements:`, document.querySelectorAll('*').length);
          
          // Registreer enkele belangrijke elementen voor debugging
          const allTabsContent = document.querySelectorAll('[role="tabpanel"]');
          console.log(`TabsContent elements (${allTabsContent.length}):`, allTabsContent);
          
          const allTabsTriggers = document.querySelectorAll('[role="tab"]');
          console.log(`TabsTrigger elements (${allTabsTriggers.length}):`, allTabsTriggers);
          
          toast({
            title: isEnglish ? "Tour element not found" : "Rondleiding element niet gevonden",
            description: isEnglish 
              ? `Could not find "${step.title}" element. Skipping this step.` 
              : `Kon "${step.titleNL}" element niet vinden. Deze stap wordt overgeslagen.`,
            variant: "destructive",
          });
          
          // Try to move to next step, or complete tour if this is the last step
          if (currentStep < steps.length - 1) {
            setCurrentStep(prevStep => prevStep + 1);
          } else {
            onComplete();
          }
        }
      }
    };
    
    // Start het interval
    const intervalId = setInterval(findElement, retryInterval);
    
    // Direct een keer proberen
    findElement();
    
    // Cleanup functie
    return () => {
      clearInterval(intervalId);
    };
  }, [currentStep, steps, isVisible, isEnglish, toast, onComplete]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      // Tour completed
      setIsVisible(false);
      trackEvent('tour_completed', 'onboarding', 'dashboard');
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  const handleSkip = () => {
    setIsVisible(false);
    trackEvent('tour_skipped', 'onboarding', 'dashboard');
    onSkip();
  };
  
  // This must be before the early return to avoid changing hook order
  const position = useMemo(() => {
    if (!targetElement) return { top: '0px', left: '0px', transform: 'translate(-50%, -50%)' };
    
    const rect = targetElement.getBoundingClientRect();
    const step = steps[currentStep];
    const placement = step.placement || 'bottom';
    
    // Add some spacing from the element
    const spacing = 12;
    
    switch (placement) {
      case 'top':
        return {
          top: `${rect.top - spacing}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + spacing}px`,
          transform: 'translateY(-50%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + spacing}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - spacing}px`,
          transform: 'translate(-100%, -50%)'
        };
      default:
        return {
          top: `${rect.bottom + spacing}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
    }
  }, [targetElement, currentStep, steps]);
  
  // If not visible or no target element found, don't render anything
  if (!isVisible || !targetElement) return null;
  
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  
  return (
    <div 
      className="fixed z-[1000] bg-popover text-popover-foreground shadow-lg rounded-lg p-4 max-w-xs w-full"
      style={{
        top: position.top,
        left: position.left,
        transform: position.transform,
      }}
    >
      {/* Close button */}
      <button 
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        onClick={handleSkip}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">{isEnglish ? "Close" : "Sluiten"}</span>
      </button>
      
      {/* Step content */}
      <div className="mb-4">
        <h3 className="font-medium text-lg mb-1">
          {isEnglish ? step.title : step.titleNL}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isEnglish ? step.content : step.contentNL}
        </p>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {isEnglish ? "Previous" : "Vorige"}
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkip}
          >
            {isEnglish ? "Skip" : "Overslaan"}
          </Button>
          
          <Button
            size="sm"
            onClick={handleNext}
          >
            {isLastStep 
              ? (isEnglish ? "Finish" : "Voltooien") 
              : (isEnglish ? "Next" : "Volgende")}
            {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
      
      {/* Step indicator */}
      <div className="flex justify-center mt-4 gap-1">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full ${
              index === currentStep ? "bg-primary w-4" : "bg-muted w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}