/**
 * Converts a currency string in USD format to its equivalent value in cents.
 * Supports both positive and negative amounts, with options for various formats:
 *  - Negative values can be represented with a leading '-' or parentheses '()'.
 *  - Parses two decimal places, rounding to the nearest cent when more are provided.
 *
 * Examples:
 * ```typescript
 * getCurrencyUsdCents('$1.00');     // Returns 100
 * getCurrencyUsdCents('$1.1');      // Returns 110
 * getCurrencyUsdCents('$1.100');    // Returns 110
 * getCurrencyUsdCents('$1');        // Returns 100
 * getCurrencyUsdCents('-$1.00');    // Returns -100
 * getCurrencyUsdCents('($1.00)');   // Returns -100
 * ```
 *
 * @param {unknown} value - The input value, expected to be a string in USD format or a numeric amount.
 * @returns {number} The equivalent value in cents, rounded to the nearest cent.
 */
export const getCurrencyUsdCents = (value: unknown): number => {
	if (typeof value === 'number') return Math.round(value * 100);

	const currencyUsdString = value as string;

	// Check if the value is negative
	const isNegative =
		currencyUsdString.startsWith('-') || currencyUsdString.startsWith('(');

	// Remove all non-numeric characters except the decimal point
	const digitsOnly = currencyUsdString.replace(/[^0-9.]/g, '');

	// Parse the resulting string as a floating-point number
	let numericValue = parseFloat(digitsOnly);
	if (isNaN(numericValue)) return 0; // Return 0 for invalid input

	// Apply the negative sign if necessary
	if (isNegative) numericValue = -numericValue;

	// Round to the nearest cent (two decimal places) and convert to cents
	return Math.round(numericValue * 100);
};

export const getCurrencyUsdStringFromCents = (
	currencyUsdNumber: number,
	options: Intl.NumberFormatOptions = {
		currency: 'usd',
		maximumFractionDigits: 2,
		style: 'currency',
	},
) =>
	new Intl.NumberFormat('en', {
		currency: 'usd',
		maximumFractionDigits: 2,
		style: 'currency',
		...options,
	}).format(currencyUsdNumber / 100);

export const isCurrencyUsdCents = (value: unknown): value is string => {
	if (typeof value !== 'string' || !value.includes('$')) return false;
	const numCents = getCurrencyUsdCents(value);
	if (isNaN(numCents)) return false;
	return isCurrencyUsdCents(numCents);
};
