import { DateTime } from 'luxon';
import { getEnum, EnumMember } from 'ergonomic/utils/enum.js';

export const RecurrenceRuleFrequencyEnum = getEnum([
	'YEARLY',
	'MONTHLY',
	'WEEKLY',
	'DAILY',
]);
export type RecurrenceRuleFrequency = EnumMember<
	typeof RecurrenceRuleFrequencyEnum
>;

export const RecurrenceRuleEndingEnum = getEnum(['COUNT', 'INFINITE', 'UNTIL']);
export type RecurrenceRuleEnding = EnumMember<typeof RecurrenceRuleEndingEnum>;

export type RecurrenceRuleData = {
	FREQ: RecurrenceRuleFrequency;
	DTSTART: string;
	COUNT?: number;
	UNTIL?: string;
};

export const isRecurrenceRuleData = (
	data: Partial<RecurrenceRuleData>,
): data is RecurrenceRuleData => {
	return (
		RecurrenceRuleFrequencyEnum.isMember(data.FREQ) &&
		typeof data.DTSTART === 'string' &&
		(data.COUNT === undefined || typeof data.COUNT === 'number') &&
		(data.UNTIL === undefined || typeof data.UNTIL === 'string')
	);
};

/**
 * Parses a recurrence rule string into a map of key-value pairs.
 *
 * Example recurrence rule strings supported
 *
 * - FREQ=MONTHLY;DTSTART=20220211T000000Z;COUNT=36
 * - FREQ=MONTHLY;DTSTART=20221001T000000Z;UNTIL=20240524T000000Z
 * - FREQ=YEARLY;DTSTART=20230307T000000Z
 *
 * @param ruleString The recurrence rule string to parse.
 * @returns A map of key-value pairs representing the recurrence rule.
 *
 * @example
 * ```typescript
 * const ruleString = 'FREQ=MONTHLY;DTSTART=20220211T000000Z;COUNT=36';
 * const ruleMap = getRecurrenceRuleData(ruleString);
 * console.log(ruleMap);
 * // {
 * //   FREQ: 'MONTHLY',
 * //   DTSTART: '20220211T000000Z',
 * //   COUNT: 36
 * // }
 * ```
 */
export const getRecurrenceRuleData = (
	ruleString: string,
): RecurrenceRuleData | null => {
	const ruleParts = ruleString.split(';');
	const ruleMap: Partial<RecurrenceRuleData> = {};

	ruleParts.forEach((part) => {
		const [key, value] = part.split('=');
		if (key && value) {
			if (key === 'FREQ') {
				ruleMap.FREQ = value as RecurrenceRuleFrequency;
			}
			if (key === 'DTSTART') {
				ruleMap.DTSTART = value;
			}
			if (key === 'COUNT') {
				ruleMap.COUNT = parseInt(value);
			}
			if (key === 'UNTIL') {
				ruleMap.UNTIL = value;
			}
		}
	});

	if (isRecurrenceRuleData(ruleMap)) {
		return ruleMap;
	}

	return null;
};

export const isRecurrenceRuleString = (value: unknown): value is string => {
	return typeof value === 'string' && getRecurrenceRuleData(value) !== null;
};

/**
 * Converts a recurrence rule data object into a recurrence rule string.
 *
 * @param ruleData The recurrence rule data object to convert.
 * @returns The recurrence rule string.
 *
 * @example
 * ```typescript
 * const ruleData = {
 *  FREQ: 'MONTHLY',
 *  DTSTART: '20220211T000000Z',
 *  COUNT: 36
 * };
 * const ruleString = getRecurrenceRuleString(ruleData);
 * console.log(ruleString); // => "FREQ=MONTHLY;DTSTART=20220211T000000Z;COUNT=36"
 * ```
 */
export const getRecurrenceRuleString = (
	ruleData: RecurrenceRuleData,
): string => {
	const parts = [`FREQ=${ruleData.FREQ}`, `DTSTART=${ruleData.DTSTART}`];

	if (ruleData.COUNT !== undefined) {
		parts.push(`COUNT=${ruleData.COUNT}`);
	}

	if (ruleData.UNTIL !== undefined) {
		parts.push(`UNTIL=${ruleData.UNTIL}`);
	}

	return parts.join(';');
};

/**
 * Converts a recurrence rule data object into a human-friendly string.
 *
 * @param data The recurrence rule data object to convert.
 * @returns The human-friendly string representation of the recurrence rule.
 *
 * @example
 * ```typescript
 * const ruleData = {
 *  FREQ: 'MONTHLY',
 *  DTSTART: '20220211T000000Z',
 *  COUNT: 36
 * };
 * const humanFriendlyString = getHumanFriendlyRecurrenceRuleString(ruleData);
 * console.log(humanFriendlyString);
 * // => "Repeats monthly starting on February 11, 2022 for 36 occurrences."
 * ```
 */
export const getHumanFriendlyRecurrenceRuleString = (
	data: RecurrenceRuleData,
): string => {
	const startDate = DateTime.fromISO(data.DTSTART, { zone: 'utc' });
	const startDateString = startDate.toFormat('MMMM d, yyyy');
	const frequencyText = data.FREQ.toLowerCase();

	if (data.COUNT != null) {
		return `Repeats ${frequencyText} starting on ${startDateString} for ${data.COUNT} occurrences.`;
	} else if (data.UNTIL != null) {
		const untilDate = DateTime.fromISO(data.UNTIL, { zone: 'utc' });
		const untilDateString = untilDate.toFormat('MMMM d, yyyy');
		return `Repeats ${frequencyText} starting on ${startDateString} until ${untilDateString}.`;
	} else {
		return `Repeats ${frequencyText} starting on ${startDateString} indefinitely.`;
	}
};
