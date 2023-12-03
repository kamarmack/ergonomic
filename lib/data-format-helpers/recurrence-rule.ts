import * as RR from 'rrule';

export const isRecurrenceRule = (
	stringValue: unknown,
): stringValue is string => {
	try {
		return (
			typeof stringValue === 'string' &&
			!!RR.rrulestr(stringValue)?.isFullyConvertibleToText()
		);
	} catch {
		return false;
	}
};
