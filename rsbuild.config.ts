import { defineConfig } from "@rsbuild/core";
import path from "node:path";

console.log(path.resolve(__dirname, "src"));

export default defineConfig({
	plugins: [],

	output: {
		filenameHash: false,
		filename: {
			js: "[name].js",
		},
		distPath: {
			js: "",
		},
	},
	source: {
		define: {
			VERSION: JSON.stringify(require("./manifest.json").version),
		},
		entry: {
			extension: "./src/extension/index.ts",
			showdown: "./src/showdown/index.ts",
		},
	},
	tools: {
		htmlPlugin: false,
	},
});
