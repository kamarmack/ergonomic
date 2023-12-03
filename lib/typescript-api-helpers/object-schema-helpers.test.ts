import * as TsHelpers from '../typescript-helpers';
import * as ObjectSchemaHelpers from './object-schema-helpers';
import * as DataFormatHelpers from '../data-format-helpers';

test('BaseApiObjectSchema.getDefault', () => {
	type T = typeof ObjectSchemaHelpers.defaultBaseApiObject;
	expect<T>(ObjectSchemaHelpers.defaultBaseApiObject).toStrictEqual<T>({
		_archived: false,
		_date_created: expect.stringMatching(TsHelpers.utcDateRegex) as string,
		_deleted: false,
		_id: undefined,
		_object: undefined,
		_ref_user: undefined,
		category: undefined,
		description: '',
		name: undefined,
	});
	const now = DataFormatHelpers.getUtcDateNow();
	expect(
		Math.abs(
			DataFormatHelpers.getUnixSeconds(
				ObjectSchemaHelpers.defaultBaseApiObject._date_created,
			) - DataFormatHelpers.getUnixSeconds(now),
		),
	).toBeLessThan(1);
});
