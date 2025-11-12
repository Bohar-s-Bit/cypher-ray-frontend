import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with Indian numbering system
export function formatNumber(num) {
  return new Intl.NumberFormat("en-IN").format(num);
}

// Truncate text with ellipsis
export function truncate(str, length = 50) {
  if (!str) return "";
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Copy to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}

// Get initials from name
export function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Sleep utility
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate random ID
export const generateId = () => Math.random().toString(36).substring(2, 9);
