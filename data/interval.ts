import * as Luxon from 'luxon';

export const isInterval = (stringValue: unknown): stringValue is string =>
	typeof stringValue === 'string' &&
	Luxon.Interval.isInterval(
		Luxon.Interval.fromISO(stringValue.slice().trim(), { zone: 'utc' }),
	);
