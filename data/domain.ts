import { getEnum, EnumMember } from 'ergonomic/utils/enum.js';
import { default as validator } from 'validator';

export const WebProtocolEnum = getEnum(['http://', 'https://']);
export type WebProtocol = EnumMember<typeof WebProtocolEnum>;

export const isDomain = (stringValue: unknown): stringValue is string => {
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
