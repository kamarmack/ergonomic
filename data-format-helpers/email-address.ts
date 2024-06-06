import validator, { default as validatorType } from 'validator';
const validatorLib = validator as unknown as typeof validatorType['default'];

export const isEmailAddress = (stringValue: unknown): stringValue is string =>
	typeof stringValue === 'string' &&
	validatorLib.isEmail(stringValue.slice().toLowerCase().trim());
