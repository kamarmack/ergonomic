import {
	isWebDomain,
	isWebUrl,
} from 'ergonomic/data-format-helpers/web-domain.js';

describe('URL Validation Tests', () => {
	describe('isWebDomain', () => {
		test('should return false for URLs with protocols', () => {
			expect(isWebDomain('http://example.com')).toBe(false);
			expect(isWebDomain('https://example.com')).toBe(false);
		});

		test('should return false for URLs with paths, even if valid', () => {
			expect(isWebDomain('http://example.com/path')).toBe(false);
			expect(isWebDomain('https://example.com/path')).toBe(false);
		});

		test('should return true for domain-like strings without protocols and slashes', () => {
			expect(isWebDomain('example.com')).toBe(true);
		});

		test('should return false for non-web protocols and malformed URLs', () => {
			expect(isWebDomain('ftp://example.com')).toBe(false);
			expect(isWebDomain('example.com/path')).toBe(false);
			expect(isWebDomain('Just a string')).toBe(false);
		});

		test('should handle leading and trailing spaces in inputs', () => {
			expect(isWebDomain('  http://example.com  ')).toBe(false);
			expect(isWebDomain('  example.com  ')).toBe(true);
		});
	});

	describe('isWebUrl', () => {
		test('should recognize and validate URLs transformed from gs:// to https://', () => {
			expect(isWebUrl('gs://bucket_name/path/to/resource')).toBe(true);
			expect(isWebUrl('gs://bucket_name')).toBe(true);
		});

		test('should return true for well-formed http and https URLs', () => {
			expect(isWebUrl('http://example.com')).toBe(true);
			expect(isWebUrl('https://example.com')).toBe(true);
		});

		test('should return false for URLs with non-web protocols or without protocols', () => {
			expect(isWebUrl('ftp://example.com')).toBe(false);
			expect(isWebUrl('example.com')).toBe(false);
		});

		test('should properly handle leading and trailing spaces and case sensitivity', () => {
			expect(isWebUrl('  https://EXAMPLE.COM/path  ')).toBe(true);
		});
	});
});
