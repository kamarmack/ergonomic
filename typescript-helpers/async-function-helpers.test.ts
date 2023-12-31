import { GeneralizedResponse } from 'ergonomic/typescript-helpers/function-response-helpers.js';
import { resolveGeneralizedPromiseChain } from 'ergonomic/typescript-helpers/async-function-helpers.js';

describe('typescript-helpers.async-function-helpers.resolveGeneralizedPromiseChain', () => {
	test('numeric mappers', () =>
		void (async () => {
			expect(
				await resolveGeneralizedPromiseChain([
					() => Promise.resolve([1, 2, 3]),
				]),
			).toStrictEqual({ data: [1, 2, 3], errors: [] });
		})());
	test('mixed mappers', () =>
		void (async () => {
			expect(
				await resolveGeneralizedPromiseChain([
					() => Promise.resolve([1, 2, 3]),
					(prevData) =>
						Promise.resolve((prevData as number[]).map((x) => `${x}`)),
				]),
			).toStrictEqual({ data: ['1', '2', '3'], errors: [] });
		})());
	test('failed queue', () =>
		void (async () => {
			try {
				const errorResponse = await resolveGeneralizedPromiseChain([
					() => Promise.resolve([1, 2, 3]),
					() => Promise.reject('invalid data'),
					(prevData) =>
						Promise.resolve((prevData as number[]).map((x) => `${x}`)),
				]);
				expect<GeneralizedResponse>(
					errorResponse,
				).toStrictEqual<GeneralizedResponse>({
					data: [],
					errors: [
						{
							error: {
								category: 'request.unknown-error',
								data: {},
								message: 'An unknown error occurred.',
								status_code: 500,
								status_text: 'Internal Server Error',
							},
						},
					],
				});
			} catch (msg) {
				typeof msg;
			}
		})());
});
