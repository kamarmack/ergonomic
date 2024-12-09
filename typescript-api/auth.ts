import { GeneralizedResponse } from 'ergonomic/typescript/index.js';

export type FirebaseUserCustomTokenParams = {
	id_token: string;
};
export type FirebaseUserCustomTokenResponseData = {
	custom_token: string;
};
export type FirebaseUserCustomTokenResponse =
	GeneralizedResponse<FirebaseUserCustomTokenResponseData> & {
		readonly data: [FirebaseUserCustomTokenResponseData];
	};
