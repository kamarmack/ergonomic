import * as TsHelpers from '../typescript-helpers';

export const getCurrencyUsdCents = (value: unknown): number => {
	if (typeof value === 'number') return value;
	const currencyUsdString = value as string;
	const digits = parseInt(
		currencyUsdString
			.slice()
			.split('')
			.filter(TsHelpers.isDigitCharacter)
			.join(''),
	);
	const factor = currencyUsdString.includes('.') ? 1 : 100;
	return digits * factor;
};

export const isCurrencyUsdCents = (value: unknown): value is string => {
	if (typeof value !== 'string' || !value.includes('$')) return false;
	const numCents = getCurrencyUsdCents(value);
	if (isNaN(numCents)) return false;
	return isCurrencyUsdCents(numCents);
};
