import * as Luxon from 'luxon';

export const isDuration = (stringValue: unknown): stringValue is string =>
	typeof stringValue === 'string' &&
	Luxon.Duration.isDuration(Luxon.Duration.fromISO(stringValue.slice().trim()));
