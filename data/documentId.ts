import * as R from 'ramda';
import { v4 } from 'uuid';
import { compressUUID } from 'ergonomic/utils/string.js';

export const getDocumentIdString = (options: { id_prefix: string }): string =>
	options.id_prefix + '_' + compressUUID(v4());

const validateDocumentIdString = (
	options: {
		id_prefix: string;
	},
	testValue: string,
): boolean => {
	const split = testValue.split('_');
	const prefix = R.init(split).join('_');
	if (prefix !== options.id_prefix) return false;
	const suffix = R.last(split);
	if (typeof suffix !== 'string') return false;
	const chars =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	return suffix.split('').every((char) => chars.includes(char));
};

export const isDocumentIdString = (
	resources: {
		id_prefix: string;
	}[],
	testValue: unknown,
): boolean => {
	if (typeof testValue !== 'string') return false;
	return resources.some((options) =>
		validateDocumentIdString(options, testValue),
	);
};

export const isDocumentIdStringRef = (
	resources: {
		id_prefix: string;
	}[],
	testValue: unknown,
): boolean => {
	return testValue === '' || isDocumentIdString(resources, testValue);
};
