import { getEnum } from 'ergonomic/typescript-helpers/enum-helpers.js';

export const GeneralizedFieldTypeEnum = getEnum([
	'address_field', // string - address field (city, country, line1, line2, postal_code, state)
	'boolean', // boolean - true or false
	'currency', // number - number of cents
	'date', // string - ISO date string
	'domain', // string - domain name
	'duration', // string - ISO duration string
	'email_address', // string - email address
	'file', // string - single Google Cloud Storage Bucket URL
	'file_list', // array - multiple Google Cloud Storage Bucket URLs
	'floating_point_number', // number - floating point number
	'id', // string - ID
	'id_ref', // string - ID reference
	'id_refs', // array - array of ID references
	'integer', // number - integer
	'interval', // string - ISO interval string
	'list', // array - array of strings
	'long_text', // string - long text
	'phone_number', // string - phone number
	'select_many', // array - array of strings from enum
	'select_one', // string - single string from enum
	'short_text', // string - short text
	'url', // string - URL
]);
export type GeneralizedFieldType = keyof typeof GeneralizedFieldTypeEnum.obj;

export type GeneralizedFieldSchemaMetadata = {
	label_by_enum_option?: Record<string, string>;
	label_message_admin_text?: string;
	label_message_user_text?: string;
	label_tooltip_admin_text?: string;
	label_tooltip_user_text?: string;
	pii?: boolean;
	reference_collections?: string[];
	required_on_create?: boolean;
	type: GeneralizedFieldType;
};

export type GeneralizedFieldSpec = {
	default?: string;
	oneOf: string[];
	label?: string;
	meta?: GeneralizedFieldSchemaMetadata;
	notOneOf: string[];
	nullable?: boolean;
	type: 'string' | 'number' | 'boolean' | 'array' | 'mixed';
};
