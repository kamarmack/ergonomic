import { compressUUID } from 'ergonomic/utils/string.js';

describe('compressUUID', () => {
	// Test known UUIDs
	it('correctly compresses known UUIDs', () => {
		expect(compressUUID('a2455f7c-1a42-4d98-9fb2-28e4de1b5790')).toBe(
			'4wCSYDmd7Mt6jO7gR1VKdM',
		);
		expect(compressUUID('a2455f7c-1a42-4d98-9fb2-28e4de1b5780')).toBe(
			'4wCSYDmd7Mt6jO7gR1VKd6',
		);
		expect(compressUUID('2d8f3151-f46e-43a1-b3ad-204a0116a2ac')).toBe(
			'1Ny5p6sOjBt6bfijfrhnJs',
		);
	});

	// Test for input edge cases
	it('handles invalid UUID formats gracefully', () => {
		try {
			compressUUID('invalid-uuid-format');
			// If no error is thrown, fail the test
			fail('Expected function to throw an error due to invalid UUID format');
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
			expect((error as Error).message).toMatch('Cannot convert');
		}
	});

	// Testing the uniqueness for a series of different UUIDs
	it('returns unique outputs for different UUIDs', () => {
		const uuids = new Set([
			'a2455f7c-1a42-4d98-9fb2-28e4de1b5790',
			'a2455f7c-1a42-4d98-9fb2-28e4de1b5780',
			'2d8f3151-f46e-43a1-b3ad-204a0116a2ac',
		]);
		const results = new Set(
			Array.from(uuids).map((uuid) => compressUUID(uuid)),
		);
		expect(results.size).toBe(uuids.size); // Expect no collisions
	});

	// Consistency test: same input should yield same output every time
	it('produces consistent output for the same input', () => {
		const uuid = 'a2455f7c-1a42-4d98-9fb2-28e4de1b5780';
		const firstCall = compressUUID(uuid);
		const secondCall = compressUUID(uuid);
		expect(firstCall).toBe(secondCall);
	});
});
