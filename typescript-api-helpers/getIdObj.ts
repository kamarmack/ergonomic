import * as R from 'ramda';
import { getDocumentIdString } from 'ergonomic/data-format-helpers/document-id.js';

export const getIdObj = <T extends string>(
	_object: string,
	obj: Record<T, string>,
): Record<T, string> =>
	R.mapObjIndexed((_) => getDocumentIdString(_object), obj);
