import dayjs from "dayjs";
import SocialConnector, {
	DIRECTION,
	SocialPhotoType,
} from "./SocialConnector";

enum MEDIA_TYPE {
	IMAGE = "IMAGE",
	VIDEO = "VIDEO",
	CAROUSEL_ALBUM = "CAROUSEL_ALBUM",
}

type IGPhotoType = {
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

export default class Instagram extends SocialConnector {
	private static init = false;
	private static instance: Instagram;
	private tokenExpiry = 0;
	private redirectUri = "";
	private static photos: Array<SocialPhotoType> = [];

	public static getInstance(): Instagram {
		if (Instagram.init) return Instagram.instance;
		Instagram.instance = new Instagram();
		Instagram.init = true;
		return Instagram.instance;
	}

	public setRedirectUri(uri: string) {
		this.redirectUri = uri;
	}

	requestAccess(): Promise<void> {
		if (this.accessToken && dayjs(this.tokenExpiry).isAfter(dayjs())) {
			return Promise.resolve();
		}
		return Promise.reject(new Error("token invalid"));
	}

	async requestToken(authCode: string): Promise<void> {
		const result = await window.$nuxt.$axios.$post<{
			// eslint-disable-next-line camelcase
			access_token?: string;
			// eslint-disable-next-line camelcase
			user_id?: string;
		}>(API_URL.IG_TOKEN, {
			code: authCode,
			uri: this.redirectUri,
		});
		if (!("access_token" in result)) {
			return Promise.reject(new Error("No access token provided"));
		}
		this.tokenExpiry = dayjs().add(59, "m").unix();
		this.setToken(result);
		return Promise.resolve();
	}

	async getPhotos(direction?: DIRECTION): Promise<Array<SocialPhotoType>> {
		const result = await window.$nuxt.$axios.$get<{
			data: Array<IGPhotoType>;
			paging: any;
		}>(
			`https://graph.instagram.com/me/media?fields=id,media_type,media_url${this.pagingQueryUrl(
				direction
			)}&access_token=${this.accessToken}`
		);
		Instagram.photos = [];
		for (const photo of result.data) {
			const parsedData = Instagram.parsePhotoData(photo);
			if (parsedData) {
				Instagram.photos.push(parsedData);
			}
		}
		this.setPaginationCursors(result);
		return Promise.resolve(Instagram.photos);
	}

	private pagingQueryUrl(direction?: DIRECTION): string {
		if (this.after !== "" && direction === DIRECTION.NEXT)
			return `&after=${this.after}`;
		if (this.before !== "" && direction === DIRECTION.PREVIOUS)
			return `&before=${this.before}`;
		return "";
	}

	private static parsePhotoData(
		data: IGPhotoType
	): undefined | SocialPhotoType {
		if (data.media_type !== MEDIA_TYPE.IMAGE) return;
		return {
			id: data.id,
			picture: data.media_url,
		};
	}

	static getPhotoUrl(id: string): Promise<string> {
		const uri = Instagram.photos.find((p) => p.id === id)?.picture || "";
		return Promise.resolve(uri);
	}

	public static buildAuthObject(response: string): IGAuthResponse {
		const searchParams = new URLSearchParams(response);
		let authObj: IGAuthResponse;
		if (searchParams.has("code")) {
			authObj = {
				code: searchParams.get("code") || "",
			};
		} else {
			authObj = {
				error: searchParams.get("error") || "generic_error",
				errorReason: searchParams.get("error_reason") || "",
				errorDescription:
            searchParams.get("error_description") || "An error occurred",
			};
		}
		return authObj;
	}

	public static getUserId(): string {
		return this.instance.userId;
	}
}
