export type GeopointData = {
	_latitude: number;
	_longitude: number;
};

/**
 * Enables geohash queries in Firestore with the native location functionality and GeoFirestore.
 *
 * More info: https://github.com/KeikoPlatform/downloadkeiko.com/issues/105
 *
 * Example:
 * ```ts
 * import { default as ngeohash } from 'ngeohash';
 * import { GeoPoint } from 'firebase-admin/firestore';
 * const lat = 35.7;
 * const lng = 139.6;
 * const geopoint = new GeoPoint(lat, lng);
 * const geohash = ngeohash.encode(lat, lng);
 * ```
 *
 * Underlying data {@link GeopointData}:
 * ```json
 * {
 *   "g": {
 *     "geopoint": { "_latitude": 34.7, "_longitude": 135.5 },
 *     "geohash": "xn0m7kun4"
 *   }
 * }
 * ```
 */
export type GeoqueryData = {
	g?: {
		geopoint: unknown;
		geohash: string;
	};
};

export const fallbackGeoqueryData: Required<GeoqueryData> = {
	g: {
		geopoint: { _latitude: 0, _longitude: 0 },
		geohash: '',
	},
};
