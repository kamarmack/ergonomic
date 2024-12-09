import { getEnum, EnumMember } from 'ergonomic/utils/enum.js';

export const GeneralizedFieldTypeEnum = getEnum([
	'address_field', // string - address field (city, country, line1, line2, postal_code, state)
	'boolean', // boolean - true or false
	'currency', // number - number of cents, e.g. 1000 for $10.00
	'date', // string - ISO date string with millisecond precision, e.g. 2020-01-01T00:00:00.000Z
	'domain', // string - domain name, e.g. example.com
	'duration', // string - ISO duration string, e.g. P3Y6M1W4DT12H or P5Y3M
	'email_address', // string - email address, e.g. john@example.com
	'file', // string - single Google Cloud Storage Bucket URL, e.g. gs://bucket/file
	'file_list', // array - multiple Google Cloud Storage Bucket URLs, e.g. [gs://bucket/file1, ...]
	'floating_point_number', // number - floating point number
	'id', // string - ID, e.g. usr_5lVsQD0PTnDuYeYrflCPsI
	'id_ref', // string - ID reference
	'id_refs', // array - array of ID references
	'integer', // number - integer
	'interval', // string - ISO interval string, e.g. 2020-01-01T00:00:00.000Z/2020-01-02T00:00:00.000Z
	'list', // array - array of strings
	'long_text', // string - long text
	'markdown_text', // string - markdown text
	'percentage', // number - floating point number, e.g. 0.1 for 10%
	'phone_number', // string - phone number
	'recurrence_rule', // string - iCalendar RFC recurrence rule string, e.g. FREQ=MONTHLY;DTSTART=20220211T000000Z;COUNT=36, FREQ=MONTHLY;DTSTART=20221001T000000Z;UNTIL=20240524T000000Z, or FREQ=YEARLY;DTSTART=20230307T000000Z
	'rich_text', // string - rich text
	'select_many', // array - array of strings from enum
	'select_one', // string - single string from enum
	'sensitive_text', // string - sensitive text hidden while editing
	'short_text', // string - short text
	'time_zone', // string - IANA time zone string, e.g. America/New_York
	'url', // string - URL, e.g. https://example.com
]);
export type GeneralizedFieldType = EnumMember<typeof GeneralizedFieldTypeEnum>;

export type GeneralizedFieldSchemaMetadata = {
	can_update?: boolean;
	label_by_enum_option?: Record<string, string>;
	label_message_admin_text?: string;
	label_message_user_text?: string;
	label_tooltip_admin_text?: string;
	label_tooltip_user_text?: string;
	pii?: boolean;
	primary_key?: boolean;
	server_managed?: boolean;
	reference_collections?: string[];
	required_on_create?: boolean;
	type: GeneralizedFieldType;
	unique_key?: boolean;
};

export const defaultGeneralizedFieldSchemaMetadata: Omit<
	GeneralizedFieldSchemaMetadata,
	'type'
> = {
	can_update: true,
	label_by_enum_option: {},
	label_message_admin_text: '',
	label_message_user_text: '',
	label_tooltip_admin_text: '',
	label_tooltip_user_text: '',
	pii: false,
	primary_key: false,
	server_managed: false,
	reference_collections: [],
	required_on_create: false,
	unique_key: false,
};

export type GeneralizedFieldSpec = {
	default?: string;
	innerType?: GeneralizedFieldSpec;
	label?: string;
	meta?: GeneralizedFieldSchemaMetadata;
	notOneOf: string[];
	nullable?: boolean;
	oneOf: string[];
	tests: {
		name: 'defined' | 'required';
		params: unknown;
	}[];
	type: 'string' | 'number' | 'boolean' | 'array' | 'mixed';
};

const getFieldPresencePredicate =
	(predicate: 'defined' | 'required') =>
	(params: {
		fieldSpec: GeneralizedFieldSpec;
		operation: 'create' | 'update';
	}): boolean => {
		const { required_on_create = false } = params.fieldSpec?.meta || {};

		if (
			predicate === 'required' &&
			params.operation === 'create' &&
			required_on_create
		) {
			return true;
		}

		if (!Array.isArray(params.fieldSpec.tests)) {
			return false;
		}

		return params.fieldSpec.tests.some((test) => {
			return test.name === predicate;
		});
	};
export const isFieldRequired = getFieldPresencePredicate('required');
export const isFieldDefined = getFieldPresencePredicate('defined');
