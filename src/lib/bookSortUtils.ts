/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Normalizes a book title for canonical school grade/level sorting.
 * Ensures:
 * 1. Leading spaces/tabs are trimmed.
 * 2. Preschool / Maternelle -> Rank 000
 * 3. KG1 -> Rank 001, KG2 -> Rank 002, KG3 -> Rank 003
 * 4. Grade / Level / Niveau X -> Rank (10 + X), padded with 3 digits
 * 5. Numbers are sorted naturally (so Level 10 comes after Level 9, not after Level 1).
 */
export const normalizeBookTitleForSort = (title: string | null | undefined): string => {
  let s = String(title || "").trim();
  s = s.replace(/^\s+/, "");
  s = s.replace(/\b(Preschool|Maternelle)\b/gi, "__LVL_000__");
  s = s.replace(/\bKG\s*1\b/gi, "__LVL_001__");
  s = s.replace(/\bKG\s*2\b/gi, "__LVL_002__");
  s = s.replace(/\bKG\s*3\b/gi, "__LVL_003__");
  s = s.replace(/\b(Grade|Level|Niveau)\s*(\d+)\b/gi, (_match, _p1, p2) => {
    const num = parseInt(p2, 10);
    const padded = String(num + 10).padStart(3, "0");
    return `__LVL_${padded}__`;
  });
  return s;
};

export const compareBookTitlesNaturally = (
  a: string | null | undefined,
  b: string | null | undefined
): number => {
  const normA = normalizeBookTitleForSort(a);
  const normB = normalizeBookTitleForSort(b);
  return normA.localeCompare(normB, undefined, { numeric: true, sensitivity: "base" });
};

export const sortBooksNaturally = <T extends Record<string, any>>(
  books: T[],
  titleKey: keyof T = "bookName" as keyof T
): T[] => {
  return [...books].sort((a, b) => {
    const valA = a[titleKey];
    const valB = b[titleKey];
    return compareBookTitlesNaturally(valA, valB);
  });
};
