import {
	GeneralizedMapFn,
	GeneralizedPredicateFn,
	getGeneralizedParseFn,
	toGeneralizedCastFn,
} from 'ergonomic/typescript-helpers/function-helpers.js';

export const getDataFormatFns = <
	M extends GeneralizedMapFn = GeneralizedMapFn,
	P extends GeneralizedPredicateFn = GeneralizedPredicateFn,
>({
	defaultResponseData,
	mapFn,
	predicateFn,
}: {
	defaultResponseData: unknown;
	mapFnTests: [unknown, unknown][];
	mapFn: M;
	predicateFnInvalidValues: unknown[];
	predicateFnValidValues: unknown[];
	predicateFn: P;
}) => {
	const parseFn = getGeneralizedParseFn({
		mapFn,
		predicateFn,
	});
	const castFn = toGeneralizedCastFn({
		defaultResponse: [defaultResponseData],
		parseFn,
	});

	return {
		defaultResponseData,
		mapFn,
		parseFn,
		predicateFn,
		castFn,
	} as const;
};
