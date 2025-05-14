import { useState, useEffect } from "react";

interface ScrollState {
  scrollY: number;
  scrolledPast50: boolean;
}

export function useScroll(): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrolledPast50: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollState({
        scrollY: currentScrollY,
        scrolledPast50: currentScrollY > 50,
      });
    };

    // Initial check
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollState;
}
