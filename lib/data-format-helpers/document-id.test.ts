import { shortenObjectName } from './document-id';

describe('shortenObjectName', () => {
	it('should shorten collection names', () => {
		expect(shortenObjectName('user')).toBe('usr');
		expect(shortenObjectName('user_api_key')).toBe('usr_api_ky');
	});
});
