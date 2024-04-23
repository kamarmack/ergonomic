/**
 * Compresses a UUID into a shorter string using base62 encoding.
 *
 * @param {string} uuid - The UUID to compress.
 * @returns {string} The compressed UUID.
 *
 * @example
 *
 * ```typescript
 * compressUUID('a2455f7c-1a42-4d98-9fb2-28e4de1b5790');
 * // => "4wCSYDmd7Mt6jO7gR1VKdM"
 * compressUUID('a2455f7c-1a42-4d98-9fb2-28e4de1b5780');
 * // => "4wCSYDmd7Mt6jO7gR1VKd6"
 * compressUUID('2d8f3151-f46e-43a1-b3ad-204a0116a2ac');
 * // => "1Ny5p6sOjBt6bfijfrhnJs"
 * ```
 */
export const compressUUID = (uuid: string) => {
	// Remove dashes and convert the UUID hex string to a BigInt
	const hex = uuid.replace(/-/g, '');
	const bigint = BigInt('0x' + hex);

	// Characters to be used in the base62 encoding
	const chars =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const base = BigInt(chars.length);

	let result = '';
	let number = bigint;

	// Convert BigInt to a base62 string
	do {
		result = (chars[Number(number % base)] as string) + result;
		number = number / base;
	} while (number > 0);

	return result;
};
