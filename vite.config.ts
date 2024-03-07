import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import {coverageConfigDefaults} from "vitest/config";

export default defineConfig({
	plugins: [vue()],
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
	test: {
		environment: "jsdom",
		coverage: {
			provider: "v8",
			exclude: [
				...coverageConfigDefaults.exclude,
				"demo/**",
				"src/types/**",
				"src/interfaces/**",
			],
		},
	},
});