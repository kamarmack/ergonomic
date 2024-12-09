import { Duration } from 'luxon';

export const isDuration = (stringValue: unknown): stringValue is string =>
	typeof stringValue === 'string' &&
	Duration.isDuration(Duration.fromISO(stringValue.slice().trim()));
