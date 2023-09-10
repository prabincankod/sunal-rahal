import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);

  if (words.length === 0) {
    return "";
  }
  const initials = words
    .map((word) => (word ? word.charAt(0).toUpperCase() : ""))
    .join("");

  return initials;
};
