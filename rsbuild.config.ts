import { defineConfig } from "@rsbuild/core";
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginReact } from '@rsbuild/plugin-react';

import path from "node:path";

console.log(path.resolve(__dirname, "src"));

export default defineConfig({
	plugins: [pluginReact(), pluginSass()],

	output: {
		filenameHash: false,
		distPath: {
			js: "",
			css: "",
			root: "dist"
		},
	},
	source: {
		define: {
			VERSION: JSON.stringify(require("./manifest.json").version),
		},
		entry: {
			extension: "./src/extension/index.ts",
			showdown: "./src/lib/showdown/showdown.ts",
			react: "./src/index.tsx",
		},
	},
	tools: {
		htmlPlugin: false,
	},
});