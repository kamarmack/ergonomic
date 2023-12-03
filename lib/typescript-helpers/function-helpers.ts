import * as FunctionResponseHelpers from './function-response-helpers';

export type TsPredicateFn = (value: unknown) => boolean;
export type TsMapFn<T = unknown, U = unknown> = (value: T) => U;

export type TsParseFnResponse<
	_ = unknown,
	U = unknown,
> = FunctionResponseHelpers.TsResponse<U>;
export type TsParseFn<T = unknown, U = unknown> = (
	value: T,
) => TsParseFnResponse<T, U>;

type _getTsParseFnProps<T = unknown, U = unknown> = {
	mapFn: TsMapFn<T, U>;
	predicateFn: TsPredicateFn;
	getTsError?: () => FunctionResponseHelpers.TsError;
};
export const getTsParseFn =
	<T = unknown, U = unknown>({
		mapFn,
		predicateFn,
		getTsError,
	}: _getTsParseFnProps<T, U>): TsParseFn<T, U> =>
	(value) => {
		if (predicateFn(value)) {
			const res = mapFn(value);
			return { data: Array.isArray(res) ? res : [res], errors: [] };
		}
		return FunctionResponseHelpers.getTsErrorResponse(getTsError);
	};

type _TsCastFnResponse<T = unknown, U = unknown> = TsParseFnResponse<
	T,
	U
>['data'];
export type TsCastFn<T = unknown, U = unknown> = (
	value: T,
) => _TsCastFnResponse<T, U>;

type _ToTsCastFnProps<T = unknown, U = unknown> = {
	defaultResponse: _TsCastFnResponse<T, U>;
	parseFn: TsParseFn<T, U>;
};
export const toTsCastFn =
	<T = unknown, U = unknown>({
		defaultResponse,
		parseFn,
	}: _ToTsCastFnProps<T, U>): TsCastFn<T, U> =>
	(value) => {
		const res = parseFn(value);
		if (FunctionResponseHelpers.isTsErrorResponse(res)) return defaultResponse;
		return res.data;
	};
