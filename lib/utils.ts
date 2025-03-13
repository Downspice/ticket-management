import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateInput(value: string): string {
  if (!value.trim()) {
    return "This field is required"
  }

  // Check for multiple continuous special characters or spaces
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{2,}/.test(value)) {
    return "Cannot contain multiple continuous special characters"
  }

  // Check for multiple continuous spaces
  if (/\s{2,}/.test(value)) {
    return "Cannot contain multiple continuous spaces"
  }

  // Check if input starts with a space
  if (/^\s/.test(value)) {
    return "Cannot start with a space"
  }

  return ""
}

