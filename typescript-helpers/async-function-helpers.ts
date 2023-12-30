import {
	GeneralizedResponse,
	getGeneralizedErrorResponse,
	isGeneralizedErrorResponse,
} from 'ergonomic/typescript-helpers/function-response-helpers.js';

export type GeneralizedPromiseChainFn = (
	prevResponseData: unknown[],
) => Promise<unknown>;
export type GeneralizedPromiseChainResponse = GeneralizedResponse<unknown>;
export type GeneralizedPromiseChainWrapper = (
	prevResponse: GeneralizedPromiseChainResponse,
) => Promise<GeneralizedPromiseChainResponse>;

const _toGeneralizedPromiseChainWrapper =
	(defaultResponse: GeneralizedPromiseChainResponse) =>
	(fn: GeneralizedPromiseChainFn, i: number): GeneralizedPromiseChainWrapper =>
	async (prevResponse) => {
		const encounteredError = i > 0 && isGeneralizedErrorResponse(prevResponse);
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

const _resolveGeneralizedPromiseChainWrappers = async ({
	defaultResponse,
	fnWrappers,
}: {
	defaultResponse: GeneralizedPromiseChainResponse;
	fnWrappers: GeneralizedPromiseChainWrapper[];
}): Promise<GeneralizedPromiseChainResponse> => {
	const res = await fnWrappers.reduce((_acc: unknown, _fn) => {
		try {
			const acc = _acc as Promise<GeneralizedPromiseChainResponse>;
			return acc.then(_fn);
		} catch (msg) {
			return defaultResponse;
		}
	}, Promise.resolve(defaultResponse));
	return res as GeneralizedPromiseChainResponse;
};

export const resolveGeneralizedPromiseChain = async (
	fns: GeneralizedPromiseChainFn[],
	defaultResponse = getGeneralizedErrorResponse(),
): Promise<GeneralizedPromiseChainResponse> => {
	try {
		const res: GeneralizedPromiseChainResponse =
			await _resolveGeneralizedPromiseChainWrappers({
				defaultResponse,
				fnWrappers: fns.map(_toGeneralizedPromiseChainWrapper(defaultResponse)),
			});
		return res as unknown as GeneralizedPromiseChainResponse;
	} catch (msg) {
		return defaultResponse;
	}
};
