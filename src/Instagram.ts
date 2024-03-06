import SocialConnector, { DIRECTION, SocialPhoto } from "./SocialConnector";
import { InstagramInstanceOptionsInterface } from "./interfaces/InstagramInstanceOptionsInterface.ts";
import {
	IGAuthResponse,
	IGPhoto,
	MEDIA_TYPE,
	TokenBackendResponse
} from "./types/APIResponses.ts";

/** Token is set to expire in 59 minutes */
const TOKEN_EXPIRY = 59 * 60 * 1000;

/** Instagram OAuth URL API Endpoint */
const INSTAGRAM_AUTH_URL = "https://api.instagram.com/oauth/authorize";


export default class Instagram extends SocialConnector {
	private static init = false;
	private static instance: Instagram;
	private tokenExpiry = 0;
	private redirectUri = "";
	private static photos: Array<SocialPhoto> = [];
	private tokenBackend = "";

	private constructor({appId}: InstagramInstanceOptionsInterface) {
		if (!appId) {
			throw new Error(
				"Cannot initialize Instagram Social Connector without an app id",
			);
		}
		super(appId);
	}
	public static getInstance(options?: InstagramInstanceOptionsInterface): Instagram {
		if (!Instagram.init) {
			Instagram.instance = new Instagram(options ?? {});
			Instagram.init = true;
		}

		if (options?.redirectUri) {
			Instagram.instance.redirectUri = options.redirectUri;
		}

		if (!Instagram.instance.redirectUri) {
			throw new Error(
				"Cannot initialize Instagram Social Connector without a redirect uri",
			);
		}

		if (options?.tokenBackend) {
			Instagram.instance.tokenBackend = options.tokenBackend;
		}

		return Instagram.instance;
	}

	get authFullUrl(): string {
		return `${INSTAGRAM_AUTH_URL}?client_id=${this.appId}&redirect_uri=${this.redirectUri}` +
            "&response_type=code&scope=user_profile,user_media";
	}

	public login() {
		window.location.href = this.authFullUrl;
	}

	public requestAccess(): Promise<void> {
		if (this.accessToken && (this.tokenExpiry > Date.now())) {
			return Promise.resolve();
		}
		return Promise.reject(new Error("token invalid"));
	}

	public async requestToken(authCode: string): Promise<void> {
		const result = await this.api.post<TokenBackendResponse>(this.tokenBackend, {
			code: authCode,
			uri: this.redirectUri,
		});
		if (!("access_token" in result)) {
			return Promise.reject(new Error("No access token provided"));
		}
		this.tokenExpiry = Date.now() + TOKEN_EXPIRY;
		this.setToken(result);
		return Promise.resolve();
	}

	public async getPhotos(direction?: DIRECTION): Promise<Array<SocialPhoto>> {
		const result = await this.api.get<{
			data: Array<IGPhoto>;
			paging: any;
		}>(this.mediaApiUrl(direction));

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

	private mediaApiUrl(direction?: DIRECTION): string {
		return `https://graph.instagram.com/me/media?fields=id,media_type,media_url${this.pagingQueryUrl(
			direction,
		)}&access_token=${this.accessToken}`;
	}

	private pagingQueryUrl(direction?: DIRECTION): string {
		if (this.after !== "" && direction === DIRECTION.NEXT)
			return `&after=${this.after}`;
		if (this.before !== "" && direction === DIRECTION.PREVIOUS)
			return `&before=${this.before}`;
		return "";
	}

	private static parsePhotoData(
		data: IGPhoto,
	): undefined | SocialPhoto {
		if (data.media_type !== MEDIA_TYPE.IMAGE) return;
		return {
			id: data.id,
			picture: data.media_url,
		};
	}

	public static getPhotoUrl(id: string): Promise<string> {
		const uri = Instagram.photos.find((p) => p.id === id)?.picture || "";
		return Promise.resolve(uri);
	}

	public buildAuthObject(response: string): IGAuthResponse {
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
                    searchParams.get("error_description") ||
                    "An error occurred",
			};
		}
		return authObj;
	}

	public static getUserId(): string {
		return this.instance.userId;
	}
}
