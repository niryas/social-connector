import APIAbstract from "../APIAbstract.ts";

export interface InstagramInstanceOptionsInterface {
	/** Instagram app id as set in the Meta Developer Center */
	appId?: string;

	/** Auth redirect URI - must exactly match a redirect URI set in the Meta Developer Center */
	redirectUri?: string;

	/** Full URL to token handling backend endpoint */
	tokenBackendUri?: string;

	/** Function to call after access token is available */
	afterTokenFunction?: () => void;

	/** API Class (optional) */
	api?: new () => APIAbstract;
}
