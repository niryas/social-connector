import SocialConnector, { DIRECTION, SocialPhoto } from "./SocialConnector";
import { InstagramInstanceOptionsInterface } from "./interfaces/InstagramInstanceOptions.ts";
import {
	IGAuthResponse,
	IGPhoto,
	MEDIA_TYPE,
	TokenBackendResponse,
} from "./types/APIResponses.ts";
import { Pageable } from "./interfaces/Pagination.ts";

/** Token is set to expire in 59 minutes */
const TOKEN_EXPIRY = 59 * 60 * 1000;

/** Instagram OAuth URL API Endpoint */
const INSTAGRAM_AUTH_URL = "https://api.instagram.com/oauth/authorize";

export default class InstagramClient extends SocialConnector {
	private static instance: InstagramClient;
	private tokenExpiry = 0;
	private redirectUri = "";
	private photos: Array<SocialPhoto> = [];
	private tokenBackendUri = "";

	private constructor({
		appId,
		afterTokenFunction,
		api,
	}: InstagramInstanceOptionsInterface) {
		if (!appId) {
			throw new Error(
				"Cannot initialize Instagram Social Connector without an app id",
			);
		}
		super(
			appId,
			afterTokenFunction ??
				(() => {
					console.error(
						"Social Connector initialized without an afterTokenFunction",
					);
				}),
			api,
		);
	}
	/** The InstagramClient class is a Singleton object. Use the getInstance() method to get
	 *  or instantiate an instance.
	 *
	 *  On the first call to getInstance, a required options {InstagramInstanceOptionsInterface} parameter
	 *  is required. The call will fail without it.
	 *
	 *  Subsequent calls to getInstance will work without any parameters.
	 *
	 * @param options {InstagramInstanceOptionsInterface} - options object. Required for initialization,
	 * optional when getting an instantiated instance.
	 *
	 * Changing the options object on further calls to getInstance is not supported and may be removed
	 * at any point.
	 * */
	public static getInstance(
		options?: InstagramInstanceOptionsInterface,
	): InstagramClient {
		if (!InstagramClient.instance) {
			InstagramClient.instance = new InstagramClient(options ?? {});
		}

		if (options?.redirectUri) {
			InstagramClient.instance.redirectUri = options.redirectUri;
		}

		if (!InstagramClient.instance.redirectUri) {
			throw new Error(
				"Cannot initialize Instagram Social Connector without a redirect uri",
			);
		}

		if (options?.tokenBackendUri) {
			InstagramClient.instance.tokenBackendUri = options.tokenBackendUri;
		}

		InstagramClient.instance.processRedirect();

		return InstagramClient.instance;
	}

	private get authFullUrl(): string {
		return (
			`${INSTAGRAM_AUTH_URL}?client_id=${this.appId}&redirect_uri=${this.redirectUri}` +
			"&response_type=code&scope=user_profile,user_media"
		);
	}

	/** Redirects the browser to Instagram's inner URL for authentication and authorization. */
	private login() {
		window.location.href = this.authFullUrl;
	}

	private requestAccess(): Promise<void> {
		if (this.accessToken && this.tokenExpiry > Date.now()) {
			return Promise.resolve();
		}
		return Promise.reject(new Error("token invalid"));
	}

	private async requestToken(authCode: string): Promise<void> {
		const result = await this.api.post<TokenBackendResponse>(
			this.tokenBackendUri,
			{
				code: authCode,
				uri: this.redirectUri,
			},
		);
		if (!("access_token" in result)) {
			return Promise.reject(new Error("No access token provided"));
		}
		this.tokenExpiry = Date.now() + TOKEN_EXPIRY;
		this.setToken(result);
		return Promise.resolve();
	}

	/** Handler function that can be directly used as a click handler for the
	 * "Connect with Instagram" button, or can be called inside the event handler.
	 *
	 * @see demo
	 * */
	public async clickHandler() {
		return this.requestAccess()
			.then(() => {
				this.afterTokenFunction();
			})
			.catch(() => {
				this.login();
			});
	}

	/** Static method that returns the instance clickHandler.
	 * To enable usage without additional getInstance() calls.
	 *
	 * Note: initialization with getInstance is required anyway!
	 * */
	public static clickHandler() {
		if (!this.instance) {
			throw new Error(
				"Must call getInstance() before calling clickHandler().",
			);
		}
		return this.instance.clickHandler();
	}

	public async getPhotos(direction?: DIRECTION): Promise<Array<SocialPhoto>> {
		const result = await this.api.get<
			{
				data: Array<IGPhoto>;
			} & Partial<Pageable>
		>(this.mediaApiUrl(direction));

		this.photos = [];
		for (const photo of result.data) {
			const parsedData = this.parsePhotoData(photo);
			if (parsedData) {
				this.photos.push(parsedData);
			}
		}
		this.setPaginationCursors(result);
		return Promise.resolve(this.photos);
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

	private parsePhotoData(data: IGPhoto): undefined | SocialPhoto {
		if (data.media_type !== MEDIA_TYPE.IMAGE) return;
		return {
			id: data.id,
			picture: data.media_url,
		};
	}

	public static getPhotoUrl(id: string): Promise<string> {
		const uri =
			this.instance.photos.find((p) => p.id === id)?.picture || "";
		return Promise.resolve(uri);
	}

	private buildAuthObject(response: string): IGAuthResponse {
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

	private afterAuthRedirect(queryString: string) {
		const authObj = this.buildAuthObject(queryString);
		if (!authObj || "error" in authObj) {
			console.error(authObj ?? "Error authenticating with Instagram");
			return;
		}
		return this.requestToken(authObj.code).then(() => {
			this.afterTokenFunction();
		});
	}

	/** Check whether this is a redirect (after Instagram login screen), and if so, handle it. */
	private processRedirect() {
		const queryString = window.localStorage.getItem("igAuth");
		if (!queryString) return;
		window.localStorage.removeItem("igAuth");
		this.afterAuthRedirect(queryString)?.catch(() =>
			console.error("error in redirection"),
		);
	}

	public static getUserId(): string {
		return this.instance.userId;
	}
}
