import GoogleLibPhoneNumber from 'google-libphonenumber';
import { countries } from 'ergonomic/data/countries.js';
import { Digits } from 'ergonomic/utils/number.js';

export const phoneNumberUtil =
	GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();

export const isInternationalPhoneNumber = (
	stringValue: unknown,
): stringValue is string => {
	return countries.some(({ two_letter_country_code }) => {
		try {
			return (
				typeof stringValue === 'string' &&
				phoneNumberUtil.isValidNumberForRegion(
					phoneNumberUtil.parseAndKeepRawInput(
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
export const isE164 = (stringValue: unknown): stringValue is string => {
	const e164Characters = Digits.map(String).concat('+');
	return (
		isInternationalPhoneNumber(stringValue) &&
		stringValue.split('').every(function (character) {
			return e164Characters.includes(character);
		})
	);
};
export const formatE164 = (rawPhoneNumber: string, defaultRegion: string) => {
	const trimmedPhoneNumber = rawPhoneNumber.trim();
	const e164 = isE164(trimmedPhoneNumber)
		? trimmedPhoneNumber
		: getE164PhoneNumber(trimmedPhoneNumber, defaultRegion);
	return e164;
};

/** Convert a "messy" phone string (e.g. "(813) 555-5555") to strict
 *  E.164 (e.g. "+18135555555").
 *
 *  If the input already starts with "+", the country is inferred by the
 *  lib itself. Otherwise we pass a **defaultRegion** hint (ISO-3166
 *  α-2, like "US") so the library can supply the missing country code.
 *
 *  @param {string} humanFriendlyPhoneNumber - Any human-friendly phone text.
 * @param {string} defaultRegion - ISO-3166 α-2 country code (e.g. "US").
 *  @returns {string} Strict E.164 string or a best-effort "+digits".
 *
 *  @example
 * ```ts
 * getE164PhoneNumber("(813) 555-5555"); // => "+18135555555"
 * getE164PhoneNumber("+44 7123 456789"); // => "+447123456789"
 * ```
 */
export function getE164PhoneNumber(
	humanFriendlyPhoneNumber: string,
	defaultRegion: string,
): string {
	try {
		// If number starts with "+", region is irrelevant.
		const phone = humanFriendlyPhoneNumber.trim().startsWith('+')
			? phoneNumberUtil.parse(humanFriendlyPhoneNumber) // auto-detect
			: phoneNumberUtil.parse(humanFriendlyPhoneNumber, defaultRegion); // need the hint

		// Return canonical E.164.
		return phoneNumberUtil.format(
			phone,
			GoogleLibPhoneNumber.PhoneNumberFormat.E164,
		);
	} catch {
		// Fallback: strip junk, ensure a leading "+".
		return `+${humanFriendlyPhoneNumber.replace(/[^0-9]/g, '')}`;
	}
}

/**
 * Converts an E.164 phone string to a human‐friendly national or international form.
 *
 * @param e164   Raw phone number in E.164 format ("+" followed by digits).
 * @param format Desired output format:
 *                  - "international": full international with separators
 *                  - "national":    local format per national conventions
 * @returns      Formatted phone number, or the original input on parse failure.
 *
 * @example
 * ```ts
 * getHumanFriendlyPhoneNumber("+18135555555", "international"); // => "+1 813-555-5555"
 * getHumanFriendlyPhoneNumber("+18135555555", "national");      // => "(813) 555-5555"
 * getHumanFriendlyPhoneNumber("+447123456789", "international"); // => "+44 7123 456789"
 * getHumanFriendlyPhoneNumber("+447123456789", "national");      // => "07123 456789"
 * ```
 */
export function getHumanFriendlyPhoneNumber(
	e164: string,
	format: 'national' | 'international',
): string {
	try {
		const parsed = phoneNumberUtil.parse(e164); // country inferred from "+"
		return phoneNumberUtil.format(
			parsed,
			{
				international: GoogleLibPhoneNumber.PhoneNumberFormat.INTERNATIONAL,
				national: GoogleLibPhoneNumber.PhoneNumberFormat.NATIONAL,
			}[format],
		);
	} catch (_) {
		return e164; // fallback: return as-is
	}
}
