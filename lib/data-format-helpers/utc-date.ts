import * as R from 'ramda';
import * as Luxon from 'luxon';
import * as TSHelpers from '../typescript-helpers';

export const getUtcDateNow = () => Luxon.DateTime.now().toUTC().toISO();
export const getUtcDateString = <
	T extends string,
	U extends Mm,
	V extends string,
	W extends string = '00:00:00.000Z',
>(
	yyyy: T,
	mm: U,
	dd: V,
	time: W = '00:00:00.000Z' as W,
) => `${yyyy}-${mm}-${dd}T${time}` as const;

export const getUnixMs = (utcDate: string = '') =>
	new Date(utcDate || getUtcDateNow()).getTime();
export const getUnixSeconds = (utcDate: string = '') =>
	getUnixMs(utcDate) / 1000;

const _UTCDateCharacters = [...TSHelpers.NumericCharacters, ':', 'T', 'Z'];
const _isUTCDateCharacter = (stringValue: unknown): stringValue is string =>
	typeof stringValue === 'string' &&
	_UTCDateCharacters.slice().includes(stringValue);

export const isUtcDate = (stringValue: unknown): stringValue is string => {
	if (typeof stringValue === 'string') {
		const trimmedStringValue = stringValue.slice().trim();
		if (trimmedStringValue !== '') {
			if (
				trimmedStringValue
					.slice()
					.split('')
					.filter(R.complement(_isUTCDateCharacter)).length > 0
			)
				return false;
			return Luxon.DateTime.isDateTime(
				Luxon.DateTime.fromISO(trimmedStringValue, { zone: 'utc' }),
			);
		}
	}
	return false;
};

export const MmEnum = TSHelpers.getEnum([
	'01',
	'02',
	'03',
	'04',
	'05',
	'06',
	'07',
	'08',
	'09',
	'10',
	'11',
	'12',
] as const);
export type Mm = keyof typeof MmEnum.obj;

export const FiscalQuarterEnum = TSHelpers.getEnum([
	'Q1',
	'Q2',
	'Q3',
	'Q4',
] as const);
export type FiscalQuarter = keyof typeof FiscalQuarterEnum.obj;

/**
 * Returns the first day of the month for a given year and month.
 *
 * @example
 * getStartOfMonth('2019', '01');
 * // => '2019-01-01T00:00:00.000Z'
 */
export const getStartOfMonth = <T extends string, U extends Mm>(
	yyyy: T,
	mm: U,
) => getUtcDateString(yyyy, mm, '01');

/**
 * Returns the last day of the month for a given year and month.
 *
 * @example
 * getEndOfMonth('2019', '01');
 * // => '2019-01-31T23:59:59.999Z'
 *
 * getEndOfMonth('2019', '02');
 * // => '2019-02-28T23:59:59.999Z'
 *
 * getEndOfMonth('2020', '02');
 * // => '2020-02-29T23:59:59.999Z'
 */
export const getEndOfMonth = <T extends string, U extends Mm>(
	yyyy: T,
	mm: U,
) => {
	const lastDay = new Date(parseInt(yyyy), parseInt(mm), 0).getDate();
	return getUtcDateString(
		yyyy,
		mm,
		lastDay.toString(),
		'23:59:59.999Z' as const,
	);
};

/**
 * Returns the previous month for a given year and month.
 *
 * @example
 * getPrevMonth('2019', '01');
 * // => { yyyy: '2018', mm: '12' }
 *
 * getPrevMonth('2019', '02');
 * // => { yyyy: '2019', mm: '01' }
 */
export const getPrevMonth = <T extends string, U extends Mm>(
	yyyy: T,
	mm: U,
) => {
	const prevMonth = parseInt(mm) - 1;
	if (prevMonth === 0) {
		return {
			yyyy: (parseInt(yyyy) - 1).toString(),
			mm: '12' as Mm,
		};
	}
	return {
		yyyy,
		mm: prevMonth.toString().padStart(2, '0') as Mm, // Note -- padStart is used to ensure that the month is always 2 digits.
	};
};

/**
 * Returns the next month for a given year and month.
 *
 * @example
 * getNextMonth('2019', '01');
 * // => { yyyy: '2019', mm: '02' }
 *
 * getNextMonth('2019', '12');
 * // => { yyyy: '2020', mm: '01' }
 *
 */
export const getNextMonth = <T extends string, U extends Mm>(
	yyyy: T,
	mm: U,
) => {
	const nextMonth = parseInt(mm) + 1;
	if (nextMonth === 13) {
		return {
			yyyy: (parseInt(yyyy) + 1).toString(),
			mm: '01' as Mm,
		};
	}
	return {
		yyyy,
		mm: nextMonth.toString().padStart(2, '0') as Mm, // Note -- padStart is used to ensure that the month is always 2 digits.
	};
};
