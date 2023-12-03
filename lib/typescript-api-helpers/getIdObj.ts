import * as R from 'ramda';
import * as DataFormatHelpers from '../data-format-helpers';

export const getIdObj = <T extends string>(
	_object: string,
	obj: Record<T, string>,
): Record<T, string> =>
	R.mapObjIndexed((_) => DataFormatHelpers.getDocumentIdString(_object), obj);
