import * as TsHelpers from '../typescript-helpers';

export const getDataFormatFns = <
	M extends TsHelpers.TsMapFn = TsHelpers.TsMapFn,
	P extends TsHelpers.TsPredicateFn = TsHelpers.TsPredicateFn,
>({
	defaultResponseData,
	mapFn,
	// mapFnTests,
	predicateFn,
}: // predicateFnInvalidValues,
// predicateFnValidValues,
{
	defaultResponseData: unknown;
	mapFnTests: [unknown, unknown][];
	mapFn: M;
	predicateFnInvalidValues: unknown[];
	predicateFnValidValues: unknown[];
	predicateFn: P;
}) => {
	const parseFn = TsHelpers.getTsParseFn({
		mapFn,
		predicateFn,
	});
	const castFn = TsHelpers.toTsCastFn({
		defaultResponse: [defaultResponseData],
		parseFn,
	});

	// const testMapFn: JestHelpers.TsMapFnTest = {
	// 	mapFn,
	// 	mapFnTests,
	// };
	// const testPredicateFn: JestHelpers.TsPredicateFnTest = {
	// 	invalidValues: predicateFnInvalidValues,
	// 	validValues: predicateFnValidValues,
	// 	predicateFn,
	// };
	return {
		defaultResponseData,
		mapFn,
		parseFn,
		predicateFn,
		castFn,
		// testMapFn,
		// testPredicateFn,
	} as const;
};
