import { default as RRule } from 'rrule';

export const isRecurrenceRule = (
	stringValue: unknown,
): stringValue is string => {
	try {
		return (
			typeof stringValue === 'string' &&
			!!RRule.rrulestr(stringValue)?.isFullyConvertibleToText()
		);
	} catch {
		return false;
	}
};
