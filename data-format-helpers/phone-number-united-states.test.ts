import { isPhoneNumberUnitedStates } from './phone-number-united-states.js'; // adjust path as necessary

describe('isPhoneNumberUnitedStates', () => {
	// Valid U.S. phone numbers
	it('should return true for a valid U.S. phone number in the standard format', () => {
		expect(isPhoneNumberUnitedStates('+1 202-555-0173')).toBe(true);
	});

	it('should return true for a valid U.S. phone number in the standard format, without spaces', () => {
		expect(isPhoneNumberUnitedStates('+1202-555-0173')).toBe(true);
	});

	it('should return true for a valid U.S. phone number with parentheses and hyphens', () => {
		expect(isPhoneNumberUnitedStates('(202) 555-0173')).toBe(true);
		expect(isPhoneNumberUnitedStates('+1 (202) 555-0173')).toBe(true);
	});

	it('should return true for a valid U.S. phone number without any spaces or symbols', () => {
		expect(isPhoneNumberUnitedStates('+12025550173')).toBe(true);
		expect(isPhoneNumberUnitedStates('12025550173')).toBe(true);
		expect(isPhoneNumberUnitedStates('2025550173')).toBe(true);
	});

	// Invalid U.S. phone numbers
	it('should return false for an invalid U.S. phone number with incorrect digits', () => {
		expect(isPhoneNumberUnitedStates('+1 202-555-12345')).toBe(false);
	});

	it('should return false for a valid-looking number from a non-U.S. region', () => {
		expect(isPhoneNumberUnitedStates('+44 20 7946 0958')).toBe(false); // UK number
	});

	it('should return false for a U.S. phone number missing area code', () => {
		expect(isPhoneNumberUnitedStates('555-0173')).toBe(false);
	});

	// Non-string inputs
	it('should return false for non-string inputs', () => {
		expect(isPhoneNumberUnitedStates(12025550173)).toBe(false);
		expect(isPhoneNumberUnitedStates({ number: '12025550173' })).toBe(false);
		expect(isPhoneNumberUnitedStates(null)).toBe(false);
		expect(isPhoneNumberUnitedStates(undefined)).toBe(false);
		expect(isPhoneNumberUnitedStates(['+1 202-555-0173'])).toBe(false);
	});

	// Edge cases
	it('should return false for an empty string', () => {
		expect(isPhoneNumberUnitedStates('')).toBe(false);
	});

	it('should return false for a string with non-numeric characters', () => {
		expect(isPhoneNumberUnitedStates('abc-def-ghij')).toBe(false);
	});

	it('should return false for a string with excessive length', () => {
		expect(isPhoneNumberUnitedStates('+1 202-555-0173222')).toBe(false);
	});

	it('should return false for a string with special characters only', () => {
		expect(isPhoneNumberUnitedStates('+++----')).toBe(false);
	});
});
