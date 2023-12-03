import * as FunctionResponseHelpers from './function-response-helpers';

export type TsPromiseChainFn = (
	prevResponseData: unknown[],
) => Promise<unknown>;
export type TsPromiseChainResponse =
	FunctionResponseHelpers.TsResponse<unknown>;
export type TsPromiseChainWrapper = (
	prevResponse: TsPromiseChainResponse,
) => Promise<TsPromiseChainResponse>;

const _toTsPromiseChainWrapper =
	(defaultResponse: TsPromiseChainResponse) =>
	(fn: TsPromiseChainFn, i: number): TsPromiseChainWrapper =>
	async (prevResponse) => {
		const encounteredError =
			i > 0 && FunctionResponseHelpers.isTsErrorResponse(prevResponse);
		if (encounteredError) return defaultResponse;
		try {
			const res = await fn(prevResponse.data);
			return {
				data: Array.isArray(res) ? res : [res],
				errors: [],
			};
		} catch (msg) {
			return defaultResponse;
		}
	};

const _resolveTsPromiseChainWrappers = async ({
	defaultResponse,
	fnWrappers,
}: {
	defaultResponse: TsPromiseChainResponse;
	fnWrappers: TsPromiseChainWrapper[];
}): Promise<TsPromiseChainResponse> => {
	const res = await fnWrappers.reduce((_acc: unknown, _fn) => {
		try {
			const acc = _acc as Promise<TsPromiseChainResponse>;
			return acc.then(_fn);
		} catch (msg) {
			return defaultResponse;
		}
	}, Promise.resolve(defaultResponse));
	return res as TsPromiseChainResponse;
};

export const resolveTsPromiseChain = async (
	fns: TsPromiseChainFn[],
	defaultResponse = FunctionResponseHelpers.getTsErrorResponse(),
): Promise<TsPromiseChainResponse> => {
	try {
		const res: TsPromiseChainResponse = await _resolveTsPromiseChainWrappers({
			defaultResponse,
			fnWrappers: fns.map(_toTsPromiseChainWrapper(defaultResponse)),
		});
		return res as unknown as TsPromiseChainResponse;
	} catch (msg) {
		return defaultResponse;
	}
};
