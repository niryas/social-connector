/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_IG_APP_ID: string;
	readonly VITE_IG_REDIRECT_URI: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
