import { GeneralizedResponse } from 'ergonomic/typescript-helpers/index.js';

export type FirebaseAuthCustomTokenParams = {
	id_token: string;
};
export type FirebaseAuthCustomTokenResponseData = {
	custom_token: string;
};
export type FirebaseAuthCustomTokenResponse =
	GeneralizedResponse<FirebaseAuthCustomTokenResponseData> & {
		readonly data: [FirebaseAuthCustomTokenResponseData];
	};
