/**
 * Commerce policy.
 *
 * These are business rules, not presentation. They used to be literals
 * pasted into JSX and context bodies — `0.0825` appeared in three places
 * and the prep-time fallback in two — which meant a tax change or a
 * per-store prep default was a find-and-replace across the view layer, and
 * the three copies could silently drift apart.
 *
 * A single source of truth, imported where the numbers used to be typed.
 */

/** Sales tax rate for the storefront's jurisdiction. */
export const SALES_TAX_RATE = 0.0825;

/**
 * Prep time assumed when an order carries no `prepMinutes`. Eight minutes
 * is the cafe's usual counter time for a single drink.
 */
export const DEFAULT_PREP_MINUTES = 8;

/**
 * Tax on an amount that has already had discounts removed. Callers pass the
 * taxable base, not the pre-discount subtotal — the three call sites differ
 * on what they discount, and none of them should have to remember that.
 */
export function calculateTax(taxableAmount) {
  return Number((Math.max(0, taxableAmount) * SALES_TAX_RATE).toFixed(2));
}

/**
 * Prep duration in seconds, falling back to the house default when the
 * order does not specify one.
 */
export function resolvePrepSeconds(prepMinutes) {
  return prepMinutes ? prepMinutes * 60 : DEFAULT_PREP_MINUTES * 60;
}
