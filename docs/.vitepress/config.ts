import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "Social Connector",
	description:
		"Simple TypeScript / JavaScript integration with Instagram Basic Display API",
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Getting Started", link: "/guide/getting-started" },
			{ text: "Examples", link: "/examples/vue" },
			{ text: "Reference", link: "/references/instagram" },
		],

		sidebar: [
			{
				text: "Guide",
				items: [
					{ text: "Introduction", link: "/guide/introduction" },
					{ text: "Getting Started", link: "/guide/getting-started" },
					{ text: "Configuration", link: "/guide/configuration" },
					{ text: "Usage", link: "/guide/usage" },
					{
						text: "Extending Social Connector",
						link: "/guide/extending",
					},
					{ text: "Contributing", link: "/CONTRIBUTING" },
				],
			},
			{
				text: "Examples",
				items: [
					{ text: "Usage with Vue", link: "/examples/vue" },
					{ text: "Vanilla JS", link: "/examples/vanilla" },
				],
			},
			{
				text: "Reference",
				items: [
					{ text: "APIAbstract & API", link: "/reference/api" },
					{
						text: "SocialConnector",
						link: "/reference/social-connector",
					},
					{ text: "Instagram", link: "/reference/instagram" },
				],
			},
		],

		socialLinks: [
			// @TODO
			// {icon: "github", link: "https://github.com/vuejs/vitepress"}
		],
		outline: "deep",
	},
});
