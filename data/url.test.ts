import { isUrl } from 'ergonomic/data/url.js';

describe('isUrl', () => {
	test('should recognize and validate URLs transformed from gs:// to https://', () => {
		expect(isUrl('gs://bucket_name/path/to/resource')).toBe(true);
		expect(isUrl('gs://bucket_name')).toBe(true);
	});

	test('should return true for well-formed http and https URLs', () => {
		expect(isUrl('http://example.com')).toBe(true);
		expect(isUrl('https://example.com')).toBe(true);
	});

	test('should return false for URLs with non-web protocols or without protocols', () => {
		expect(isUrl('ftp://example.com')).toBe(false);
		expect(isUrl('example.com')).toBe(false);
	});

	test('should properly handle leading and trailing spaces and case sensitivity', () => {
		expect(isUrl('  https://EXAMPLE.COM/path  ')).toBe(true);
	});
});
