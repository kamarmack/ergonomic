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
	if (!['string', 'number'].includes(typeof value)) return 0;
	if (typeof value === 'number')
		return Math.round((value + Number.EPSILON) * 100);

	const currencyUsdString = value as string;

	// Check if the value is negative
	const isNegative =
		currencyUsdString.startsWith('-') || currencyUsdString.startsWith('(');

	// Remove all non-numeric characters except the decimal point
	const digitsOnly = currencyUsdString.replace(/[^0-9.]/g, '');

	// Parse as a float to handle any number of decimal places
	const numericValue = parseFloat(digitsOnly);
	if (isNaN(numericValue)) return 0; // Return 0 for invalid input

	// Move decimal two places to the right and round to the nearest cent
	const cents = Math.round((numericValue + Number.EPSILON) * 100);

	// Apply the negative sign if necessary
	return isNegative ? -cents : cents;
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
