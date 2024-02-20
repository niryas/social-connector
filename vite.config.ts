import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.ts"),
			name: "SocialConnector",
			fileName: "social-connector",
		},
		rollupOptions: {
			external: ["vue"],
			output: {
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});