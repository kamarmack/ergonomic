import { PhoneNumberUtil } from 'google-libphonenumber';

const getPhoneUtil = () => PhoneNumberUtil.getInstance();

export const isPhoneNumberUnitedStates = (
	stringValue: unknown,
): stringValue is string => {
	try {
		return (
			typeof stringValue === 'string' &&
			getPhoneUtil().isValidNumberForRegion(
				getPhoneUtil().parseAndKeepRawInput(stringValue, 'US'),
				'US',
			)
		);
	} catch (msg) {
		return false;
	}
};
