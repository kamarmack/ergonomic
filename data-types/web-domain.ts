import { getEnum, EnumMember } from 'ergonomic/typescript/enum.js';
import { default as validator } from 'validator';

export const WebProtocolEnum = getEnum(['http://', 'https://']);
export type WebProtocol = EnumMember<typeof WebProtocolEnum>;

export const isWebDomain = (stringValue: unknown): stringValue is string => {
	if (typeof stringValue === 'string') {
		const cleanedStringValue = stringValue.slice().trim().toLocaleLowerCase();
		if (validator.isURL(cleanedStringValue)) {
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
		if (validator.isURL(cleanedStringValue)) {
			const protocol = WebProtocolEnum.arr.find((protocol) =>
				cleanedStringValue.includes(protocol),
			);
			return protocol !== undefined;
		}
	}
	return false;
};
