import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isClient = typeof window !== 'undefined';

export function scrollToElement(elementId: string) {
  if (!isClient) return;
  
  const element = document.getElementById(elementId);
  if (element) {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 80, // 80px offset for header
      behavior: 'smooth'
    });
  }
}

export function formatPhoneNumber(phoneNumber: string) {
  // Format phone number with proper spacing for Dutch numbers
  return phoneNumber.replace(/(\d{2})(\d{3})(\d{4})/, '+$1 $2 $3');
}

export function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
