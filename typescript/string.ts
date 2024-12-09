import * as R from 'ramda';

export const utcDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.{1}\d{3}Z/;
export const uuidRegex =
	/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/;
export const documentIdRegex =
	/^([a-z]+(?:_[a-z]+)*_)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const removeConsecutiveDuplicates = (str: string): string => {
	const chars = str.split('');
	return R.reduce(
		(acc: string[], char: string) => {
			if (R.last(acc) === char) {
				return acc;
			}
			return R.append(char, acc);
		},
		[],
		chars,
	).join('');
};
