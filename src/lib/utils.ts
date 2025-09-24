import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCountryName(code: string): string {
  const mapping: Record<string, string> = {
    BH: "Bahrain",
    QA: "Qatar",
    SA: "Saudi Arabia",
    KW: "Kuwait",
    AE: "United Arab Emirates",
    OM: "Oman",
    TR: "Turkey",
    TN: "Tunisia",
    MA: "Morocco",
    BD: "Bangladesh",
    GB: "United Kingdom",
    US: "United States",
  };
  return mapping[code] || code;
}
