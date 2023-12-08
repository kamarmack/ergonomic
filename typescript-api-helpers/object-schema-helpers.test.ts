import { defaultBaseApiObject } from 'ergonomic/typescript-api-helpers/object-schema-helpers.js';
import { utcDateRegex } from 'ergonomic/typescript-helpers/string-helpers.js';

test('BaseApiObjectSchema.getDefault', () => {
	type T = typeof defaultBaseApiObject;
	expect<T>(defaultBaseApiObject).toStrictEqual<T>({
		_archived: false,
		_date_created: expect.stringMatching(utcDateRegex) as string,
		_deleted: false,
		_id: undefined,
		_object: undefined,
		_ref_user: undefined,
		category: undefined,
		description: '',
		name: undefined,
	});
});
