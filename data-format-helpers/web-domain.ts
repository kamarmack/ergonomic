import { getEnum } from 'ergonomic/typescript-helpers/enum-helpers.js';
import validator, { default as validatorType } from 'validator';
const validatorLib = validator as unknown as typeof validatorType['default'];

export const WebProtocolEnum = getEnum(['http://', 'https://']);

export const isWebDomain = (stringValue: unknown): stringValue is string => {
	if (typeof stringValue === 'string') {
		const cleanedStringValue = stringValue.slice().trim().toLocaleLowerCase();
		if (validatorLib.isURL(cleanedStringValue)) {
			const protocol = WebProtocolEnum.arr.find((protocol) =>
				cleanedStringValue.includes(protocol),
			);
			if (protocol === undefined) return !cleanedStringValue.includes('/');
		}
	}
	return false;
};

export const isWebUrl = (stringValue: unknown): stringValue is string => {
	if (typeof stringValue === 'string') {
		const cleanedStringValue = (
			stringValue.startsWith('gs://')
				? stringValue
						.slice()
						.replace('gs://', 'https://storage.googleapis.com/')
				: stringValue
		)
			.slice()
			.trim()
			.toLocaleLowerCase();
		if (validatorLib.isURL(cleanedStringValue)) {
			const protocol = WebProtocolEnum.arr.find((protocol) =>
				cleanedStringValue.includes(protocol),
			);
			return protocol !== undefined;
		}
	}
	return false;
};
