import {
	TsMapFn,
	TsPredicateFn,
	getTsParseFn,
	toTsCastFn,
} from '@/typescript-helpers/function-helpers';

export const getDataFormatFns = <
	M extends TsMapFn = TsMapFn,
	P extends TsPredicateFn = TsPredicateFn,
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
	const parseFn = getTsParseFn({
		mapFn,
		predicateFn,
	});
	const castFn = toTsCastFn({
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
