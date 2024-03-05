export type TokenBackendResponse = {
	// eslint-disable-next-line camelcase
	access_token?: string;
	// eslint-disable-next-line camelcase
	user_id?: string;
};

export enum MEDIA_TYPE {
	IMAGE = "IMAGE",
	VIDEO = "VIDEO",
	CAROUSEL_ALBUM = "CAROUSEL_ALBUM",
}

export type IGPhoto = {
	id: string;
	// eslint-disable-next-line camelcase
	media_type: MEDIA_TYPE;
	// eslint-disable-next-line camelcase
	media_url: string;
};

type IGAuthResponseCode = { code: string; state?: string };
type IGAuthResponseError = {
	error: string;
	errorReason: string;
	errorDescription: string;
};

export type IGAuthResponse = IGAuthResponseCode | IGAuthResponseError;
