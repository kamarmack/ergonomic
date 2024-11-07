import {
	getEnum,
	EnumMember,
} from 'ergonomic/typescript-helpers/enum-helpers.js';

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

const isValidRecurrenceRuleData = (
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
 * const ruleMap = parseRecurrenceRuleString(ruleString);
 * console.log(ruleMap);
 * // {
 * //   FREQ: 'MONTHLY',
 * //   DTSTART: '20220211T000000Z',
 * //   COUNT: 36
 * // }
 * ```
 */
export const parseRecurrenceRuleString = (
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

	if (isValidRecurrenceRuleData(ruleMap)) {
		return ruleMap;
	}

	return null;
};

/**
 * Converts a recurrence rule data object into a recurrence rule string.
 *
 * @param data The recurrence rule data object to convert.
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
export const getRecurrenceRuleString = (data: RecurrenceRuleData): string => {
	const parts = [`FREQ=${data.FREQ}`, `DTSTART=${data.DTSTART}`];

	if (data.COUNT !== undefined) {
		parts.push(`COUNT=${data.COUNT}`);
	}

	if (data.UNTIL !== undefined) {
		parts.push(`UNTIL=${data.UNTIL}`);
	}

	return parts.join(';');
};
