import {
	TsResponse,
	getTsErrorStatusCode,
} from '@/typescript-helpers/function-response-helpers';
import { resolveTsPromiseChain } from '@/typescript-helpers/async-function-helpers';

describe('typescript-helpers.async-function-helpers.resolveTsPromiseChain', () => {
	test('numeric mappers', () =>
		void (async () => {
			expect(
				await resolveTsPromiseChain([() => Promise.resolve([1, 2, 3])]),
			).toStrictEqual({ data: [1, 2, 3], errors: [] });
		})());
	test('mixed mappers', () =>
		void (async () => {
			expect(
				await resolveTsPromiseChain([
					() => Promise.resolve([1, 2, 3]),
					(prevData) =>
						Promise.resolve((prevData as number[]).map((x) => `${x}`)),
				]),
			).toStrictEqual({ data: ['1', '2', '3'], errors: [] });
		})());
	test('failed queue', () =>
		void (async () => {
			try {
				const errorResponse = await resolveTsPromiseChain([
					() => Promise.resolve([1, 2, 3]),
					() => Promise.reject('invalid data'),
					(prevData) =>
						Promise.resolve((prevData as number[]).map((x) => `${x}`)),
				]);
				expect<TsResponse>(errorResponse).toStrictEqual<TsResponse>({
					data: [],
					errors: [
						{
							_object: 'error',
							category: 'request.unknown-error',
							msg: '',
							status_code: getTsErrorStatusCode('request.unknown-error'),
						},
					],
				});
			} catch (msg) {
				typeof msg;
			}
		})());
});
