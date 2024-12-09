import * as R from 'ramda';
import { getDocumentIdString } from 'ergonomic/data/documentId.js';

export const getIdObj = <T extends string>(
	_obect: T,
	obj: Record<T, string>,
	idPrefixMap: Record<T, string>,
): Record<T, string> =>
	R.mapObjIndexed(
		(_) =>
			getDocumentIdString({
				id_prefix: idPrefixMap[_obect],
			}),
		obj,
	);
