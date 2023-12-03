import * as validator from 'validator';

export const isEmailAddress = (stringValue: unknown): stringValue is string =>
	typeof stringValue === 'string' &&
	validator.default.isEmail(stringValue.slice().toLowerCase().trim());
