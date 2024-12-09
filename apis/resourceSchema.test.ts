import { defaultGeneralizedApiResource } from 'ergonomic/apis/resourceSchema.js';
import { utcDateRegex } from 'ergonomic/utils/string.js';

test('GeneralizedApiResourceSchema.getDefault', () => {
	type T = typeof defaultGeneralizedApiResource;
	expect<T>(defaultGeneralizedApiResource).toStrictEqual<T>({
		_archived: false,
		_created_by: '',
		_date_created: expect.stringMatching(utcDateRegex) as string,
		_date_last_modified: expect.stringMatching(utcDateRegex) as string,
		_deleted: false,
		_id: undefined,
		_obect: undefined,
		category: undefined,
		description: '',
		name: undefined,
	});
});
