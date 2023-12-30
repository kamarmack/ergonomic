import { GeneralizedResponse } from 'ergonomic/typescript-helpers/index.js';

export type FirebaseAuthCustomTokenParams = {
	id_token: string;
};
export type FirebaseAuthCustomTokenResponse = GeneralizedResponse<{
	custom_token: string;
}>;
