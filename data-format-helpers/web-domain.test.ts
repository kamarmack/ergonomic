import { isWebUrl } from 'ergonomic/data-format-helpers/web-domain.js';

const testUrl = 'gs://my-app.appspot.com/files/mdx/hello-world.mdx';
describe('GeneralizedWebUrl', () => {
	describe('isWebUrl', () => {
		it('returns true for valid urls', () => {
			expect(isWebUrl(testUrl)).toBe(true);
		});
	});
});
