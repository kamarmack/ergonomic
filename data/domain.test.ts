import { isDomain } from 'ergonomic/data/domain.js';

describe('isDomain', () => {
	test('should return false for URLs with protocols', () => {
		expect(isDomain('http://example.com')).toBe(false);
		expect(isDomain('https://example.com')).toBe(false);
	});

	test('should return false for URLs with paths, even if valid', () => {
		expect(isDomain('http://example.com/path')).toBe(false);
		expect(isDomain('https://example.com/path')).toBe(false);
	});

	test('should return true for domain-like strings without protocols and slashes', () => {
		expect(isDomain('example.com')).toBe(true);
	});

	test('should return false for non-web protocols and malformed URLs', () => {
		expect(isDomain('ftp://example.com')).toBe(false);
		expect(isDomain('example.com/path')).toBe(false);
		expect(isDomain('Just a string')).toBe(false);
	});

	test('should handle leading and trailing spaces in inputs', () => {
		expect(isDomain('  http://example.com  ')).toBe(false);
		expect(isDomain('  example.com  ')).toBe(true);
	});
});
