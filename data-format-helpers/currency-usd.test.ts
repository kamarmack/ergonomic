import { getCurrencyUsdCents } from './currency-usd.js';

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
