import * as R from 'ramda';
import * as UUID from 'uuid';
import * as TsHelpers from '../typescript-helpers';

/**
 * Deterministically shortens an object name.
 *
 * Returns a value that can be prepended to uuids to create document ids e.g. `usr_a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6`
 *
 * @param _object object name
 * @returns {string} shortened name
 *
 * @example
 * shortenObjectName('user') // 'usr'
 * shortenObjectName('asset_account') // 'ast_acnt'
 * shortenObjectName('balance_sheet') // 'blnce_sht'
 * shortenObjectName('credit_line') // 'crdt_lne'
 * shortenObjectName('debt_financing') // 'dbt_fncng'
 */
export const shortenObjectName = (_object: string): string => {
	const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
	const parts = _object.split('_');
	let shortenedName = '';

	for (const part of parts) {
		let shortenedPart = '';

		for (let i = 0; i < part.length; i++) {
			const char = part[i];
			const prevChar = i > 0 ? part[i - 1] : '';

			if (char && vowels.has(char) && i > 0 && i < part.length - 1) {
				continue;
			}

			if (
				i > 0 &&
				char === prevChar &&
				char &&
				!vowels.has(char) &&
				i < part.length - 1 &&
				part[i + 1] === char
			) {
				continue;
			}

			shortenedPart += char;
		}

		shortenedName +=
			shortenedPart + (parts.indexOf(part) < parts.length - 1 ? '_' : '');
	}

	return TsHelpers.removeConsecutiveDuplicates(shortenedName);
};

export const getDocumentIdString = (_object: string): string =>
	shortenObjectName(_object) + '_' + UUID.v4();
export const getUUIDFromDocumentId = (_id: string): string => {
	const splitByUnderscore = _id.split('_');
	return R.last(splitByUnderscore) as string;
};

const _isDocumentIdString = (_object: string, testValue: string): boolean => {
	const prefix = shortenObjectName(_object);
	const suffix = testValue.slice(prefix.length + 1);
	return UUID.validate(suffix);
};

export const isDocumentIdString = (
	allowObjects: string[],
	testValue: unknown,
): boolean => {
	if (typeof testValue !== 'string') return false;
	return allowObjects.some((object) => _isDocumentIdString(object, testValue));
};

export const isDocumentIdStringRef = (
	allowObjects: string[],
	testValue: unknown,
): boolean => {
	return testValue === '' || isDocumentIdString(allowObjects, testValue);
};
