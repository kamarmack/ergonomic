import {
	GeneralizedError,
	GeneralizedResponse,
	getGeneralizedErrorResponse,
	isGeneralizedErrorResponse,
} from 'ergonomic/typescript-helpers/function-response-helpers.js';

export type GeneralizedPredicateFn = (value: unknown) => boolean;
export type GeneralizedMapFn<T = unknown, U = unknown> = (value: T) => U;

export type GeneralizedParseFnResponse<
	_ = unknown,
	U = unknown,
> = GeneralizedResponse<U>;
export type GeneralizedParseFn<T = unknown, U = unknown> = (
	value: T,
) => GeneralizedParseFnResponse<T, U>;

type GetGeneralizedParseFnProps<T = unknown, U = unknown> = {
	mapFn: GeneralizedMapFn<T, U>;
	predicateFn: GeneralizedPredicateFn;
	getGeneralizedError?: () => GeneralizedError;
};
export const getGeneralizedParseFn =
	<T = unknown, U = unknown>({
		mapFn,
		predicateFn,
		getGeneralizedError,
	}: GetGeneralizedParseFnProps<T, U>): GeneralizedParseFn<T, U> =>
	(value) => {
		if (predicateFn(value)) {
			const res = mapFn(value);
			return { data: Array.isArray(res) ? res : [res], errors: [] };
		}
		return getGeneralizedErrorResponse(getGeneralizedError);
	};

type GeneralizedCastFnResponse<
	T = unknown,
	U = unknown,
> = GeneralizedParseFnResponse<T, U>['data'];
export type GeneralizedCastFn<T = unknown, U = unknown> = (
	value: T,
) => GeneralizedCastFnResponse<T, U>;

type GetGeneralizedCastFnProps<T = unknown, U = unknown> = {
	defaultResponse: GeneralizedCastFnResponse<T, U>;
	parseFn: GeneralizedParseFn<T, U>;
};
export const getGeneralizedCastFn =
	<T = unknown, U = unknown>({
		defaultResponse,
		parseFn,
	}: GetGeneralizedCastFnProps<T, U>): GeneralizedCastFn<T, U> =>
	(value) => {
		const res = parseFn(value);
		if (isGeneralizedErrorResponse(res)) return defaultResponse;
		return res.data;
	};
