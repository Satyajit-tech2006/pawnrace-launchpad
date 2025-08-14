// Utility Functions for PawnRace Chess Academy
// Common helper functions used throughout the application

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combine and merge CSS classes intelligently
// This function combines clsx for conditional classes with tailwind-merge for deduplication
// Example: cn("px-2 py-1", condition && "bg-blue-500", "px-4") -> "py-1 bg-blue-500 px-4"
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}