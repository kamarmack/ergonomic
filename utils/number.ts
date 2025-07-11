export const isInteger = (numberValue: unknown): numberValue is number =>
	typeof numberValue === 'number' && Math.trunc(numberValue) === numberValue;
export const isBetweenZeroAndOne = (
	numberValue: unknown,
): numberValue is number =>
	typeof numberValue === 'number' && numberValue >= 0 && numberValue <= 1;

export const Digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const DigitCharacters = [
	...Digits.slice().map((digit) => `${digit}`),
	'-',
];
export const NumericCharacters = [...DigitCharacters, '.'];
export const PercentCharacters = [...NumericCharacters, '%'];

export const isDigit = (numberValue: unknown): numberValue is number =>
	typeof numberValue === 'number' && Digits.slice().includes(numberValue);
export const isDigitCharacter = (stringValue: unknown): stringValue is string =>
	typeof stringValue === 'string' &&
	DigitCharacters.slice().includes(stringValue);
export const isNumericCharacter = (
	stringValue: unknown,
): stringValue is string =>
	typeof stringValue === 'string' &&
	NumericCharacters.slice().includes(stringValue);
export const isPercentCharacter = (
	stringValue: unknown,
): stringValue is string =>
	typeof stringValue === 'string' &&
	PercentCharacters.slice().includes(stringValue);

/**
 * Examples:
 *
 * 	- '   65.3474% ' => '653474'
 * 	- '$500,000.25' => '50000025'
 * 	- '-500%' => '-500'
 */
export const pickDigitCharacters = (
	stringValue: unknown,
	options = { defaultValue: '' },
): string =>
	typeof stringValue === 'string'
		? stringValue.split('').filter(isDigitCharacter).join('')
		: options.defaultValue;

/**
 * Examples:
 *
 * 	- '   65.3474% ' => '65.3474'
 * 	- '$500,000.25' => '500000.25'
 * 	- '-500%' => '-500'
 */
export const pickNumericCharacters = (
	stringValue: unknown,
	options = { defaultValue: '' },
): string =>
	typeof stringValue === 'string'
		? stringValue.split('').filter(isNumericCharacter).join('')
		: options.defaultValue;

/**
 * Examples:
 *
 * 	- '   65.3474% ' => '65.3474%'
 * 	- '$500,000.25' => '500000.25'
 * 	- '-500%' => '-500%'
 */
export const pickPercentCharacters = (
	stringValue: unknown,
	options = { defaultValue: '' },
): string =>
	typeof stringValue === 'string'
		? stringValue.split('').filter(isPercentCharacter).join('')
		: options.defaultValue;

/**
 * Converts a floating-point number to a percentage string.
 *
 * Example:
 * *  - `0.65` => `'65%'`
 */
export function getPercentageFromFloatingPointNumber(percentage: number) {
	return `${percentage * 100}%`;
}

/**
 * Converts a percentage string to a floating-point number.
 *
 * Example:
 * *  - `'65%'` => `0.65`
 */
export function getFloatingPointNumberFromPercentage(value: string): number {
	// Remove commas and the percent symbol, then parse as a float
	const numericValue = parseFloat(value.replace(/,/g, '').replace('%', ''));

	// Divide by 100 to get the floating-point representation of the percentage
	return numericValue / 100;
}
