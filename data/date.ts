import * as R from 'ramda';
import { DateTime } from 'luxon';
import { getEnum, EnumMember } from 'ergonomic/utils/enum.js';
import { NumericCharacters } from 'ergonomic/utils/number.js';

export const getUtcDateNow = () => DateTime.now().toUTC().toISO();
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

const UTCDateCharacters = [...NumericCharacters, ':', 'T', 'Z'];
const validateUTCDateCharacter = (
	stringValue: unknown,
): stringValue is string =>
	typeof stringValue === 'string' &&
	UTCDateCharacters.slice().includes(stringValue);

export const isUtcDate = (stringValue: unknown): stringValue is string => {
	if (typeof stringValue === 'string') {
		const trimmedStringValue = stringValue.slice().trim();
		if (trimmedStringValue !== '') {
			if (
				trimmedStringValue
					.slice()
					.split('')
					.filter(R.complement(validateUTCDateCharacter)).length > 0
			)
				return false;
			return DateTime.isDateTime(
				DateTime.fromISO(trimmedStringValue, { zone: 'utc' }),
			);
		}
	}
	return false;
};

export const isDateYyyyMmDd = (stringValue: unknown): stringValue is string => {
	if (typeof stringValue === 'string') {
		const trimmedStringValue = stringValue.slice().trim();
		if (trimmedStringValue !== '') {
			const [yyyy, mm, dd] = trimmedStringValue.split('-');
			return yyyy?.length === 4 && mm?.length === 2 && dd?.length === 2;
		}
	}
	return false;
};

export const MmEnum = getEnum([
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
export type Mm = EnumMember<typeof MmEnum>;

export const FiscalQuarterEnum = getEnum(['Q1', 'Q2', 'Q3', 'Q4'] as const);
export type FiscalQuarter = EnumMember<typeof FiscalQuarterEnum>;

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

/**
 * Returns a date string with minute precision from an ISO date input.
 *
 * @param isoDateInput - An ISO date string (e.g. "2023-10-01T12:34:56Z").
 * @returns A string formatted as "YYYY-MM-DDTHH:mm" in local time or an empty string if the input is invalid.
 *
 * @example
 * ```ts
 * getDateWithMinutePrecision("2023-10-01T12:34:56Z");
 * // => "2023-10-01T12:34" if the local time is UTC+0
 * // => "2023-10-01T14:34" if the local time is UTC+2
 * ```
 */
export function getDateWithMinutePrecision(isoDateInput: string) {
	if (typeof isoDateInput === 'string' && isoDateInput) {
		const isoDateOutput = DateTime.fromISO(isoDateInput).toISO({
			suppressMilliseconds: false,
		});

		if (isoDateOutput == null) {
			return '';
		}

		return isoDateOutput.slice(0, 16);
	}
	return '';
}

/**
 * Converts an epoch milliseconds string into a UTC ISO string with millisecond precision.
 *
 * @param {string} epochMsStr - A string representing epoch time in milliseconds.
 * @returns {string} ISO 8601 string in UTC with milliseconds, e.g. '2025-06-05T14:23:11.123Z'
 *
 * @example
 * convertEpochMsToUtcIso('1717591391123');
 * // => '2024-06-05T14:23:11.123Z'
 */
export function convertEpochMsToUtcIso(
	epochMsStr: string | number | null,
): string {
	if (!epochMsStr) {
		return '';
	}

	// Parse the input string into a number
	const epochMs =
		typeof epochMsStr === 'string' ? parseInt(epochMsStr, 10) : epochMsStr;

	if (isNaN(epochMs)) {
		console.error(`Invalid epoch milliseconds value: ${epochMsStr}`);
		return '';
	}

	// Convert to a Luxon DateTime in UTC, then format as ISO with milliseconds
	return (
		DateTime.fromMillis(epochMs, { zone: 'utc' }).toISO({
			suppressMilliseconds: false,
			includeOffset: false,
		}) || ''
	);
}

export function getTodaysDate() {
	return DateTime.now().toISODate();
}
export function getTodaysDateInUTC() {
	return DateTime.utc().toISODate();
}

/**
 * Returns the yyyy-mm-dd string that is exactly between two given yyyy-mm-dd dates.
 * Example:
 *   midDateBetween('2025-01-01', '2025-01-11') // '2025-01-06'
 *
 * @param {string} date1 - First date string in yyyy-mm-dd format
 * @param {string} date2 - Second date string in yyyy-mm-dd format
 * @returns {string} - The midpoint date string in yyyy-mm-dd format
 */
export function midDateBetween(date1: string, date2: string): string {
	// Parse input dates as Luxon DateTime objects
	const dt1 = DateTime.fromISO(date1);
	const dt2 = DateTime.fromISO(date2);

	// Calculate the difference in milliseconds between the two dates
	const diffMillis = dt2.toMillis() - dt1.toMillis();

	// Calculate the midpoint time in milliseconds
	const midMillis = dt1.toMillis() + diffMillis / 2;

	// Convert midpoint millis back to a DateTime and format to yyyy-MM-dd
	return DateTime.fromMillis(midMillis).toISODate() || '';
}
