import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import terser from "@rollup/plugin-terser";
import { coverageConfigDefaults } from "vitest/config";

export default defineConfig({
	plugins: [vue(), dts({ rollupTypes: true })],
	build: {
		copyPublicDir: false,
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
			plugins: [
				terser({
					format: {
						comments: false,
					},
				}),
			],
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
