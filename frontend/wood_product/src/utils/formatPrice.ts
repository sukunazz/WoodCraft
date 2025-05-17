/**
 * Formats a number as a currency string
 * @param {number} price - The price to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * Calculates discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price after discount
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (
  originalPrice: number,
  currentPrice: number
): number => {
  if (originalPrice <= 0 || currentPrice >= originalPrice) return 0;

  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};
