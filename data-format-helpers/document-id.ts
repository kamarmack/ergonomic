import * as R from 'ramda';
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
	const prefix = R.init(split).join('_');
	if (prefix !== options.document_id_prefix) return false;
	const suffix = R.last(split);
	if (typeof suffix !== 'string') return false;
	const chars =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	return suffix.split('').every((char) => chars.includes(char));
};

export const isDocumentIdString = (
	referenceCollections: {
		document_id_prefix: string;
	}[],
	testValue: unknown,
): boolean => {
	if (typeof testValue !== 'string') return false;
	return referenceCollections.some((options) =>
		validateDocumentIdString(options, testValue),
	);
};

export const isDocumentIdStringRef = (
	referenceCollections: {
		document_id_prefix: string;
	}[],
	testValue: unknown,
): boolean => {
	return (
		testValue === '' || isDocumentIdString(referenceCollections, testValue)
	);
};
