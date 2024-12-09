import * as R from 'ramda';
import { getDocumentIdString } from 'ergonomic/data/document-id.js';

export const getIdObj = <T extends string>(
	_object: T,
	obj: Record<T, string>,
	idPrefixMap: Record<T, string>,
): Record<T, string> =>
	R.mapObjIndexed(
		(_) =>
			getDocumentIdString({
				id_prefix: idPrefixMap[_object],
			}),
		obj,
	);
