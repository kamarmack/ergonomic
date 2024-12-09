import { defaultGeneralizedApiObject } from 'ergonomic/apis/objectSchema.js';
import { utcDateRegex } from 'ergonomic/utils/string.js';

test('GeneralizedApiObjectSchema.getDefault', () => {
	type T = typeof defaultGeneralizedApiObject;
	expect<T>(defaultGeneralizedApiObject).toStrictEqual<T>({
		_archived: false,
		_created_by: '',
		_date_created: expect.stringMatching(utcDateRegex) as string,
		_date_last_modified: expect.stringMatching(utcDateRegex) as string,
		_deleted: false,
		_id: undefined,
		_object: undefined,
		category: undefined,
		description: '',
		name: undefined,
	});
});