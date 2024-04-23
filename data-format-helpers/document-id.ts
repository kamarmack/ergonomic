import { v4 } from 'uuid';
import { compressUUID } from 'ergonomic/data-format-helpers/compressUUID.js';

export const getDocumentIdString = (options: {
	document_id_prefix: string;
}): string => options.document_id_prefix + '_' + compressUUID(v4());

const validateDocumentIdString = (
	options: {
		document_id_prefix: string;
	},
	testValue: string,
): boolean => {
	const split = testValue.split('_');
	if (split.length !== 2) return false;
	const [prefix, suffix] = split;
	if (prefix !== options.document_id_prefix) return false;
	if (typeof suffix !== 'string') return false;
	const chars =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	return suffix.split('').every((char) => chars.includes(char));
};

export const isDocumentIdString = (
	allowObjects: {
		document_id_prefix: string;
	}[],
	testValue: unknown,
): boolean => {
	if (typeof testValue !== 'string') return false;
	return allowObjects.some((options) =>
		validateDocumentIdString(options, testValue),
	);
};

export const isDocumentIdStringRef = (
	allowObjects: {
		document_id_prefix: string;
	}[],
	testValue: unknown,
): boolean => {
	return testValue === '' || isDocumentIdString(allowObjects, testValue);
};
