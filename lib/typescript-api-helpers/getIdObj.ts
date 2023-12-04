import * as R from 'ramda';
import { getDocumentIdString } from '@/data-format-helpers/document-id';

export const getIdObj = <T extends string>(
	_object: string,
	obj: Record<T, string>,
): Record<T, string> =>
	R.mapObjIndexed((_) => getDocumentIdString(_object), obj);
