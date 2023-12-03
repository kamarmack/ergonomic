import * as GoogleLibPhoneNumber from 'google-libphonenumber';

const _phoneUtil = () => GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();

export const isPhoneNumberUnitedStates = (
	stringValue: unknown,
): stringValue is string => {
	try {
		return (
			typeof stringValue === 'string' &&
			_phoneUtil().isValidNumberForRegion(
				_phoneUtil().parseAndKeepRawInput(stringValue, 'US'),
				'US',
			)
		);
	} catch (msg) {
		return false;
	}
};
