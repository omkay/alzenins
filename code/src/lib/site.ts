/** Real channels, taken from the live alzenins.com contact page. */
export const CONTACT = {
  email: "info@alzenins.com",
  whatsapp: "https://wa.me/message/FEUKS7TZKD4NG1",
  instagram: "https://www.instagram.com/alzen.ins/",
  instagramHandle: "@alzen.ins",
} as const;

/**
 * The published prices from the live site, in AED.
 *
 * NOTE: the live site is inconsistent — its meta description says 370 AED while
 * the courses page says 390. Using 390 pending the Phase 0 price sheet, which
 * replaces this constant with the real per-currency price book (Phase 2).
 */
export const COURSES = [
  { key: "diploma", priceAed: 390, featured: true },
  { key: "jlpt", priceAed: 525, featured: false },
  { key: "female", priceAed: 600, featured: false },
  { key: "private", priceAed: null, featured: false },
] as const;
