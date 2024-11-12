import { Keys } from 'ergonomic/typescript-helpers/object-helpers.js';
import {
	EnumMember,
	getEnum,
} from 'ergonomic/typescript-helpers/enum-helpers.js';

export const USA_STATE_BY_CODE = {
	// States
	AL: 'Alabama',
	AK: 'Alaska',
	AZ: 'Arizona',
	AR: 'Arkansas',
	CA: 'California',
	CO: 'Colorado',
	CT: 'Connecticut',
	DE: 'Delaware',
	FL: 'Florida',
	GA: 'Georgia',
	HI: 'Hawaii',
	ID: 'Idaho',
	IL: 'Illinois',
	IN: 'Indiana',
	IA: 'Iowa',
	KS: 'Kansas',
	KY: 'Kentucky',
	LA: 'Louisiana',
	ME: 'Maine',
	MD: 'Maryland',
	MA: 'Massachusetts',
	MI: 'Michigan',
	MN: 'Minnesota',
	MS: 'Mississippi',
	MO: 'Missouri',
	MT: 'Montana',
	NE: 'Nebraska',
	NV: 'Nevada',
	NH: 'New Hampshire',
	NJ: 'New Jersey',
	NM: 'New Mexico',
	NY: 'New York',
	NC: 'North Carolina',
	ND: 'North Dakota',
	OH: 'Ohio',
	OK: 'Oklahoma',
	OR: 'Oregon',
	PA: 'Pennsylvania',
	RI: 'Rhode Island',
	SC: 'South Carolina',
	SD: 'South Dakota',
	TN: 'Tennessee',
	TX: 'Texas',
	UT: 'Utah',
	VT: 'Vermont',
	VA: 'Virginia',
	WA: 'Washington',
	WV: 'West Virginia',
	WI: 'Wisconsin',
	WY: 'Wyoming',

	// DC
	DC: 'District of Columbia',

	// Territories
	PR: 'Puerto Rico',
	VI: 'U.S. Virgin Islands',
	GU: 'Guam',
	AS: 'American Samoa',
	MP: 'Northern Mariana Islands',
} as const;

export const UsaStateCodeEnum = getEnum(Keys(USA_STATE_BY_CODE));
export type UsaStateCode = EnumMember<typeof UsaStateCodeEnum>;

export const UsaStateTitleEnum = getEnum(Object.values(USA_STATE_BY_CODE));
export type UsaStateTitle = EnumMember<typeof UsaStateTitleEnum>;

/**
 * @deprecated Use `USA_STATE_BY_CODE`, `UsaStateCodeEnum`, or `UsaStateTitleEnum` instead.
 */
export const UsaStateEnum = getEnum([
	'Alabama',
	'Alaska',
	'Arizona',
	'Arkansas',
	'California',
	'Colorado',
	'Connecticut',
	'Delaware',
	'District of Columbia',
	'Florida',
	'Georgia',
	'Hawaii',
	'Idaho',
	'Illinois',
	'Indiana',
	'Iowa',
	'Kansas',
	'Kentucky',
	'Louisiana',
	'Maine',
	'Maryland',
	'Massachusetts',
	'Michigan',
	'Minnesota',
	'Mississippi',
	'Missouri',
	'Montana',
	'Nebraska',
	'Nevada',
	'New Hampshire',
	'New Jersey',
	'New Mexico',
	'New York',
	'North Carolina',
	'North Dakota',
	'Ohio',
	'Oklahoma',
	'Oregon',
	'Pennsylvania',
	'Rhode Island',
	'South Carolina',
	'South Dakota',
	'Tennessee',
	'Texas',
	'US Virgin Islands',
	'Utah',
	'Vermont',
	'Virginia',
	'Washington',
	'West Virginia',
	'Wisconsin',
	'Wyoming',
]);

export const isPostalCodeUnitedStates = (
	stringValue: unknown,
): stringValue is string =>
	typeof stringValue === 'string' && /^\d{5}$/.test(stringValue);
