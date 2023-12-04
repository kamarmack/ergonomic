import { rrulestr } from 'rrule';

export const isRecurrenceRule = (
	stringValue: unknown,
): stringValue is string => {
	try {
		return (
			typeof stringValue === 'string' &&
			!!rrulestr(stringValue)?.isFullyConvertibleToText()
		);
	} catch {
		return false;
	}
};
