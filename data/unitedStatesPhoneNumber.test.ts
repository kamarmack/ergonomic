import { isUnitedStatesPhoneNumber } from 'ergonomic/data/unitedStatesPhoneNumber.js'; // adjust path as necessary

describe('isUnitedStatesPhoneNumber', () => {
	// Valid U.S. phone numbers
	it('should return true for a valid U.S. phone number in the standard format', () => {
		expect(isUnitedStatesPhoneNumber('+1 202-555-0173')).toBe(true);
	});

	it('should return true for a valid U.S. phone number in the standard format, without spaces', () => {
		expect(isUnitedStatesPhoneNumber('+1202-555-0173')).toBe(true);
	});

	it('should return true for a valid U.S. phone number with parentheses and hyphens', () => {
		expect(isUnitedStatesPhoneNumber('(202) 555-0173')).toBe(true);
		expect(isUnitedStatesPhoneNumber('+1 (202) 555-0173')).toBe(true);
	});

	it('should return true for a valid U.S. phone number without any spaces or symbols', () => {
		expect(isUnitedStatesPhoneNumber('+12025550173')).toBe(true);
		expect(isUnitedStatesPhoneNumber('12025550173')).toBe(true);
		expect(isUnitedStatesPhoneNumber('2025550173')).toBe(true);
	});

	// Invalid U.S. phone numbers
	it('should return false for an invalid U.S. phone number with incorrect digits', () => {
		expect(isUnitedStatesPhoneNumber('+1 202-555-12345')).toBe(false);
	});

	it('should return false for a valid-looking number from a non-U.S. region', () => {
		expect(isUnitedStatesPhoneNumber('+44 20 7946 0958')).toBe(false); // UK number
	});

	it('should return false for a U.S. phone number missing area code', () => {
		expect(isUnitedStatesPhoneNumber('555-0173')).toBe(false);
	});

	// Non-string inputs
	it('should return false for non-string inputs', () => {
		expect(isUnitedStatesPhoneNumber(12025550173)).toBe(false);
		expect(isUnitedStatesPhoneNumber({ number: '12025550173' })).toBe(false);
		expect(isUnitedStatesPhoneNumber(null)).toBe(false);
		expect(isUnitedStatesPhoneNumber(undefined)).toBe(false);
		expect(isUnitedStatesPhoneNumber(['+1 202-555-0173'])).toBe(false);
	});

	// Edge cases
	it('should return false for an empty string', () => {
		expect(isUnitedStatesPhoneNumber('')).toBe(false);
	});

	it('should return false for a string with non-numeric characters', () => {
		expect(isUnitedStatesPhoneNumber('abc-def-ghij')).toBe(false);
	});

	it('should return false for a string with excessive length', () => {
		expect(isUnitedStatesPhoneNumber('+1 202-555-0173222')).toBe(false);
	});

	it('should return false for a string with special characters only', () => {
		expect(isUnitedStatesPhoneNumber('+++----')).toBe(false);
	});
});
