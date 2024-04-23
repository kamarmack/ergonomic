import * as R from 'ramda';
import { getDocumentIdString } from 'ergonomic/data-format-helpers/document-id.js';

export const getIdObj = <T extends string>(
	_object: T,
	obj: Record<T, string>,
	documentIdPrefixMap: Record<T, string>,
): Record<T, string> =>
	R.mapObjIndexed(
		(_) =>
			getDocumentIdString({
				document_id_prefix: documentIdPrefixMap[_object],
			}),
		obj,
	);
