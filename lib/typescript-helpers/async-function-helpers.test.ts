import * as FunctionResponseHelpers from './function-response-helpers';
import * as AsyncFunctionHelpers from './async-function-helpers';

describe('typescript-helpers.async-function-helpers.resolveTsPromiseChain', () => {
	test('numeric mappers', () =>
		void (async () => {
			expect(
				await AsyncFunctionHelpers.resolveTsPromiseChain([
					() => Promise.resolve([1, 2, 3]),
				]),
			).toStrictEqual({ data: [1, 2, 3], errors: [] });
		})());
	test('mixed mappers', () =>
		void (async () => {
			expect(
				await AsyncFunctionHelpers.resolveTsPromiseChain([
					() => Promise.resolve([1, 2, 3]),
					(prevData) =>
						Promise.resolve((prevData as number[]).map((x) => `${x}`)),
				]),
			).toStrictEqual({ data: ['1', '2', '3'], errors: [] });
		})());
	test('failed queue', () =>
		void (async () => {
			try {
				const errorResponse = await AsyncFunctionHelpers.resolveTsPromiseChain([
					() => Promise.resolve([1, 2, 3]),
					() => Promise.reject('invalid data'),
					(prevData) =>
						Promise.resolve((prevData as number[]).map((x) => `${x}`)),
				]);
				expect<FunctionResponseHelpers.TsResponse>(
					errorResponse,
				).toStrictEqual<FunctionResponseHelpers.TsResponse>({
					data: [],
					errors: [
						{
							_object: 'error',
							category: 'request.unknown-error',
							msg: '',
							status_code: FunctionResponseHelpers.getTsErrorStatusCode(
								'request.unknown-error',
							),
						},
					],
				});
			} catch (msg) {
				typeof msg;
			}
		})());
});
