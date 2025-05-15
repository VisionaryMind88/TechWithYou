import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

// Define the steps for the tour
interface TourStep {
  target: string;
  title: string;
  titleNL: string;
  content: string;
  contentNL: string;
  placement?: "top" | "right" | "bottom" | "left";
}

const defaultTourSteps: TourStep[] = [
  {
    target: ".dashboard-sidebar",
    title: "Navigation",
    titleNL: "Navigatie",
    content: "Use this sidebar to navigate between different sections of your dashboard.",
    contentNL: "Gebruik deze zijbalk om te navigeren tussen verschillende onderdelen van je dashboard.",
    placement: "right"
  },
  {
    target: ".dashboard-projects",
    title: "Your Projects",
    titleNL: "Je Projecten",
    content: "Here you can see all your active projects and their status.",
    contentNL: "Hier kun je al je actieve projecten en hun status bekijken.",
    placement: "bottom"
  },
  {
    target: ".dashboard-milestones",
    title: "Project Milestones",
    titleNL: "Project Mijlpalen",
    content: "Track the progress of your projects through these milestones.",
    contentNL: "Volg de voortgang van je projecten via deze mijlpalen.",
    placement: "bottom"
  },
  {
    target: ".dashboard-files",
    title: "Project Files",
    titleNL: "Project Bestanden",
    content: "Access and manage all files related to your projects.",
    contentNL: "Bekijk en beheer alle bestanden die bij je projecten horen.",
    placement: "left"
  },
  {
    target: ".dashboard-notifications",
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
  
  // Function to find target element
  const findTargetElement = (selector: string): HTMLElement | null => {
    return document.querySelector(selector);
  };
  
  // Update target element when current step changes
  useEffect(() => {
    if (!isVisible) return;
    
    const step = steps[currentStep];
    const element = findTargetElement(step.target);
    
    if (element) {
      setTargetElement(element);
      // Scroll the element into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // If element is not found, show an error and skip this step
      console.error(`Tour target not found: ${step.target}`);
      toast({
        title: isEnglish ? "Tour element not found" : "Rondleiding element niet gevonden",
        description: isEnglish 
          ? `Could not find "${step.title}" element. Skipping this step.` 
          : `Kon "${step.titleNL}" element niet vinden. Deze stap wordt overgeslagen.`,
        variant: "destructive",
      });
      
      // Try to move to next step, or complete tour if this is the last step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }
  }, [currentStep, steps, isVisible]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tour completed
      setIsVisible(false);
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };
  
  if (!isVisible || !targetElement) return null;
  
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  
  // Calculate position for the tooltip based on the target element and placement
  const calculatePosition = () => {
    const rect = targetElement.getBoundingClientRect();
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
  };
  
  const position = calculatePosition();
  
  // Add highlight effect to target element
  useEffect(() => {
    if (targetElement) {
      // Store original styles
      const originalOutline = targetElement.style.outline;
      const originalPosition = targetElement.style.position;
      const originalZIndex = targetElement.style.zIndex;
      
      // Add highlight styles
      targetElement.style.outline = '2px solid var(--primary)';
      targetElement.style.position = 'relative';
      targetElement.style.zIndex = '1000';
      
      // Cleanup function to restore original styles
      return () => {
        targetElement.style.outline = originalOutline;
        targetElement.style.position = originalPosition;
        targetElement.style.zIndex = originalZIndex;
      };
    }
  }, [targetElement]);
  
  return (
    <div 
      className="fixed z-[1000] bg-popover text-popover-foreground shadow-lg rounded-lg p-4 max-w-xs w-full"
      style={{
        top: position.top,
        left: position.left,
        transform: position.transform,
      }}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2"
        onClick={handleSkip}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="mb-1 font-semibold">
        {isEnglish ? step.title : step.titleNL}
      </div>
      
      <p className="text-sm mb-4">
        {isEnglish ? step.content : step.contentNL}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {isEnglish ? `Step ${currentStep + 1} of ${steps.length}` : `Stap ${currentStep + 1} van ${steps.length}`}
        </div>
        
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button size="sm" variant="outline" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {isEnglish ? 'Previous' : 'Vorige'}
            </Button>
          )}
          
          <Button size="sm" onClick={handleNext}>
            {isLastStep 
              ? (isEnglish ? 'Finish' : 'Afronden')
              : (isEnglish ? 'Next' : 'Volgende')}
            {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}