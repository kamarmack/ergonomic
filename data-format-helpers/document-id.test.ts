import { shortenObjectName } from 'ergonomic/data-format-helpers/document-id.js';

describe('shortenObjectName', () => {
	it('should shorten collection names', () => {
		expect(shortenObjectName('user')).toBe('usr');
		expect(shortenObjectName('user_api_key')).toBe('usr_api_ky');
	});
});
