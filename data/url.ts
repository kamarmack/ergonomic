import { default as validator } from 'validator';
import { WebProtocolEnum } from 'ergonomic/data/domain.js';

export const isUrl = (stringValue: unknown): stringValue is string => {
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
