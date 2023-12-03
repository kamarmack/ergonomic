import * as validator from 'validator';
import * as TsHelpers from '../typescript-helpers';

export const WebProtocolEnum = TsHelpers.getEnum(['http://', 'https://']);

export const isWebHost = (stringValue: unknown): stringValue is string => {
	if (typeof stringValue === 'string') {
		const cleanedStringValue = stringValue.slice().trim().toLocaleLowerCase();
		if (validator.default.isURL(cleanedStringValue)) {
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
		if (validator.default.isURL(cleanedStringValue)) {
			const protocol = WebProtocolEnum.arr.find((protocol) =>
				cleanedStringValue.includes(protocol),
			);
			return protocol !== undefined;
		}
	}
	return false;
};
