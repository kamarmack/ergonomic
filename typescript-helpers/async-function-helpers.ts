import {
	GeneralizedResponse,
	isGeneralizedErrorResponse,
} from 'ergonomic/typescript-helpers/function-response-helpers.js';
import { getGeneralizedError } from 'ergonomic/typescript-helpers/function-error-response-helpers.js';

export type GeneralizedPromiseChainFn = (
	prevResponseData: unknown[],
) => Promise<unknown>;
export type GeneralizedPromiseChainResponse = GeneralizedResponse<unknown>;
export type GeneralizedPromiseChainWrapper = (
	prevResponse: GeneralizedPromiseChainResponse,
) => Promise<GeneralizedPromiseChainResponse>;

const getGeneralizedPromiseChainWrapper =
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

const resolveGeneralizedPromiseChainWrappers = async ({
	defaultResponse,
	fnWrappers,
}: {
	defaultResponse: GeneralizedPromiseChainResponse;
	fnWrappers: GeneralizedPromiseChainWrapper[];
}): Promise<GeneralizedPromiseChainResponse> => {
	const res = await fnWrappers.reduce((fnWrapperAcc: unknown, fnWrapper) => {
		try {
			const acc = fnWrapperAcc as Promise<GeneralizedPromiseChainResponse>;
			return acc.then(fnWrapper);
		} catch (msg) {
			return defaultResponse;
		}
	}, Promise.resolve(defaultResponse));
	return res as GeneralizedPromiseChainResponse;
};

export const resolveGeneralizedPromiseChain = async (
	fns: GeneralizedPromiseChainFn[],
	defaultResponse = { data: [], errors: [getGeneralizedError()] },
): Promise<GeneralizedPromiseChainResponse> => {
	try {
		const res: GeneralizedPromiseChainResponse =
			await resolveGeneralizedPromiseChainWrappers({
				defaultResponse,
				fnWrappers: fns.map(getGeneralizedPromiseChainWrapper(defaultResponse)),
			});
		return res as unknown as GeneralizedPromiseChainResponse;
	} catch (msg) {
		return defaultResponse;
	}
};
