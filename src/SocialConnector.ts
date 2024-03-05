import API from "./API.ts";

type IGAuthResponse = {
	// eslint-disable-next-line camelcase
	access_token?: string;
	// eslint-disable-next-line camelcase
	user_id?: string;
};

// eslint-disable-next-line no-undef
// type FBAuthResponse = facebook.AuthResponse;

export type SocialAuthResponse = IGAuthResponse;

export enum DIRECTION {
	NEXT,
	PREVIOUS,
}

export type SocialPhoto = { id: string; picture: string };

export interface PaginationFields {
	after?: string;
	before?: string;
}

export default abstract class SocialConnector {
	protected static appId: string;
	protected accessToken: string = "";
	protected userId: string = "";
	protected after: string = "";
	protected before: string = "";
	protected api: API;

	/** Social Connector classes are singletons. Use "getInstance()" method. */
	protected constructor() {
		this.api = new API();
	}

	protected setToken(authResponse: SocialAuthResponse) {
		// Following commented lines are part of the FB integration:
		// if ("accessToken" in authResponse)
		// 	this.accessToken = authResponse.accessToken || "";
		// if ("userID" in authResponse) this.userId = authResponse.userID || "";

		if ("access_token" in authResponse)
			this.accessToken = authResponse.access_token || "";
		if ("user_id" in authResponse) this.userId = authResponse.user_id || "";
	}

	protected addDirectionToParams(params: any, direction?: DIRECTION) {
		if (this.after !== "" && direction === DIRECTION.NEXT)
			params.after = this.after;
		if (this.before !== "" && direction === DIRECTION.PREVIOUS)
			params.before = this.before;

		return params;
	}

	protected setPaginationCursors(response: {
		paging?: {
			next?: string;
			cursors?: { after: string; before: string };
			previous?: string;
		};
	}) {
		if (!response.paging) return;
		if (response.paging.next) {
			this.after = response.paging.cursors?.after || "";
		} else {
			this.after = "";
		}
		if (response.paging.previous) {
			this.before = response.paging.cursors?.before || "";
		} else {
			this.before = "";
		}
	}

	public showNext(): boolean {
		return this.after !== "";
	}

	public showPrevious(): boolean {
		return this.before !== "";
	}

	public static setAppId(appId: string) {
		SocialConnector.appId = appId;
	}

	public abstract requestAccess(isNative?: boolean): Promise<void>;

	public abstract getPhotos(
		direction?: DIRECTION
	): Promise<Array<SocialPhoto>>;

	public static getPhotoUrl(_id: string): Promise<string> {
		return Promise.resolve("");
	}

	public static getUserId(): string {
		return "";
	}
}
