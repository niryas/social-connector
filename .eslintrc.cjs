module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:vue/vue3-essential"
	],
	"overrides": [
		{
			"env": {
				"node": true
			},
			"files": [
				".eslintrc.{js,cjs}"
			],
			"parserOptions": {
				"sourceType": "script"
			}
		}
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"parser": "@typescript-eslint/parser",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
		"vue",
		"@stylistic"
	],
	"rules": {
		"@stylistic/indent": [
			"error",
			"tab"
		],
		"@stylistic/linebreak-style": [
			"error",
			"unix"
		],
		"@stylistic/quotes": [
			"error",
			"double"
		],
		"@stylistic/semi": [
			"error",
			"always"
		]
	}
};
