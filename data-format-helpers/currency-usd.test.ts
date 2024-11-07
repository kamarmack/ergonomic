import { getCurrencyUsdCents, isCurrencyUsdString } from './currency-usd.js';

describe('getCurrencyUsdCents', () => {
	it('should convert positive dollar amounts correctly', () => {
		expect(getCurrencyUsdCents('$1.00')).toBe(100);
		expect(getCurrencyUsdCents('$1')).toBe(100);
		expect(getCurrencyUsdCents('$1.1')).toBe(110);
		expect(getCurrencyUsdCents('$1.10')).toBe(110);
		expect(getCurrencyUsdCents('$1.100')).toBe(110);
	});

	it('should convert negative dollar amounts correctly', () => {
		expect(getCurrencyUsdCents('-$1.00')).toBe(-100);
		expect(getCurrencyUsdCents('($1.00)')).toBe(-100);
		expect(getCurrencyUsdCents('-$1')).toBe(-100);
		expect(getCurrencyUsdCents('-$1.1')).toBe(-110);
		expect(getCurrencyUsdCents('($1.10)')).toBe(-110);
		expect(getCurrencyUsdCents('($1.100)')).toBe(-110);
	});

	it('should round to the nearest cent when there are more than two decimal places', () => {
		expect(getCurrencyUsdCents('$1.005')).toBe(101); // 1.005 rounds to 1.01
		expect(getCurrencyUsdCents('$1.00543212')).toBe(101); // 1.00543212 rounds to 1.01
		expect(getCurrencyUsdCents('$1.004')).toBe(100); // 1.004 rounds to 1.00
		expect(getCurrencyUsdCents('-$1.005')).toBe(-101); // -1.005 rounds to -1.01
		expect(getCurrencyUsdCents('-$1.00543212')).toBe(-101); // -1.00543212 rounds to -1.01
		expect(getCurrencyUsdCents('-$1.004')).toBe(-100); // -1.004 rounds to -1.00
	});

	it('should handle cases without dollar signs or with numeric inputs directly', () => {
		expect(getCurrencyUsdCents('1.00')).toBe(100);
		expect(getCurrencyUsdCents('1')).toBe(100);
		expect(getCurrencyUsdCents(-1.1)).toBe(-110);
		expect(getCurrencyUsdCents(1.005)).toBe(101); // Should round 1.005 to 1.01
	});

	it('should return 0 for invalid or non-numeric inputs', () => {
		expect(getCurrencyUsdCents('abc')).toBe(0);
		expect(getCurrencyUsdCents('')).toBe(0);
		expect(getCurrencyUsdCents(null)).toBe(0);
		expect(getCurrencyUsdCents(undefined)).toBe(0);
		expect(getCurrencyUsdCents({})).toBe(0);
		expect(getCurrencyUsdCents([])).toBe(0);
	});
});

describe('isCurrencyUsdString', () => {
	// Valid cases
	it('should return true for valid positive dollar amounts', () => {
		expect(isCurrencyUsdString('$5.00')).toBe(true);
		expect(isCurrencyUsdString('$5')).toBe(true);
		expect(isCurrencyUsdString('$5.10')).toBe(true);
		expect(isCurrencyUsdString('$123.45')).toBe(true);
		expect(isCurrencyUsdString('$0.99')).toBe(true);
		expect(isCurrencyUsdString('$5.001')).toBe(true); // More than two decimal places
	});

	it('should return true for valid negative dollar amounts with leading hyphen', () => {
		expect(isCurrencyUsdString('-$5.00')).toBe(true);
		expect(isCurrencyUsdString('-$123.45')).toBe(true);
		expect(isCurrencyUsdString('-$0.99')).toBe(true);
		expect(isCurrencyUsdString('-$0.990324')).toBe(true);
	});

	it('should return true for valid negative dollar amounts with parentheses', () => {
		expect(isCurrencyUsdString('($5.00)')).toBe(true);
		expect(isCurrencyUsdString('($123.45)')).toBe(true);
		expect(isCurrencyUsdString('($0.99)')).toBe(true);
		expect(isCurrencyUsdString('($0.990324)')).toBe(true);
	});

	// Invalid cases
	it('should return false for improperly formatted strings', () => {
		expect(isCurrencyUsdString('$-5.00')).toBe(false); // Disallowed internal hyphen
		expect(isCurrencyUsdString('$5.0')).toBe(false); // Only one decimal place
		expect(isCurrencyUsdString('5.00')).toBe(false); // Missing dollar sign
		expect(isCurrencyUsdString('-5.00')).toBe(false); // Missing dollar sign
		expect(isCurrencyUsdString('($-5.00)')).toBe(false); // Disallowed internal hyphen
		expect(isCurrencyUsdString('$5.')).toBe(false); // Missing cents after decimal
	});

	it('should return false for non-string inputs', () => {
		expect(isCurrencyUsdString(5.0)).toBe(false);
		expect(isCurrencyUsdString(null)).toBe(false);
		expect(isCurrencyUsdString(undefined)).toBe(false);
		expect(isCurrencyUsdString({})).toBe(false);
		expect(isCurrencyUsdString([])).toBe(false);
	});

	// Edge cases
	it('should handle edge cases with only dollar signs or invalid formats', () => {
		expect(isCurrencyUsdString('$')).toBe(false); // Just a dollar sign
		expect(isCurrencyUsdString('($)')).toBe(false); // Just a dollar sign in parentheses
		expect(isCurrencyUsdString('')).toBe(false); // Empty string
		expect(isCurrencyUsdString('($5.00')).toBe(false); // Missing closing parenthesis
		expect(isCurrencyUsdString('$5.00)')).toBe(false); // Missing opening parenthesis
	});
});
