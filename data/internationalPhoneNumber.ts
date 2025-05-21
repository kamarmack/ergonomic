import GoogleLibPhoneNumber from 'google-libphonenumber';
import { countries } from 'ergonomic/data/countries.js';

const getPhoneUtil = () => GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();

export const isInternationalPhoneNumber = (
	stringValue: unknown,
): stringValue is string => {
	return countries.some(({ two_letter_country_code }) => {
		try {
			return (
				typeof stringValue === 'string' &&
				getPhoneUtil().isValidNumberForRegion(
					getPhoneUtil().parseAndKeepRawInput(
						stringValue,
						two_letter_country_code,
					),
					two_letter_country_code,
				)
			);
		} catch (msg) {
			return false;
		}
	});
};
