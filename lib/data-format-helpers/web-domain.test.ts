import { isWebUrl } from './web-domain';

const testUrl = 'gs://my-app.appspot.com/files/mdx/hello-world.mdx';
describe('TsWebUrl', () => {
	describe('isWebUrl', () => {
		it('returns true for valid urls', () => {
			expect(isWebUrl(testUrl)).toBe(true);
		});
	});
});
