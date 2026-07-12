import { execSync } from 'node:child_process';
import {
	copyFileSync,
	cpSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, 'output');
const distDir = resolve(outputDir, 'dist');
const manifestPath = resolve(__dirname, 'manifest.base.json');
const packageJsonPath = resolve(__dirname, 'package.json');
const iconsDir = resolve(__dirname, 'icons');
const templatePath = resolve(__dirname, 'assets', 'pasrs-template.xlsx');

const FIREFOX_ID =
	'"gecko": {"id": "pasrs-helper@nimnim111","strict_min_version": "109.0"}';

function getProvidedChunkIds(code) {
	const match = code.match(/\.push\(\[\[([^\]]+)\],/);
	if (!match) {
		return [];
	}

	return match[1]
		.split(',')
		.map((chunkId) => chunkId.replace(/["'\s]/g, ''))
		.filter(Boolean);
}

function getRequiredChunkIds(code) {
	const ids = [];

	for (const match of code.matchAll(
		/\.O\(void 0,\[([^\]]+)\],function\(\)\{return [^}]+\}\)/g,
	)) {
		ids.push(
			...match[1]
				.split(',')
				.map((chunkId) => chunkId.replace(/["'\s]/g, ''))
				.filter(Boolean),
		);
	}

	return [...new Set(ids)];
}

function getInjectedScriptFiles() {
	const jsFiles = readdirSync(distDir).filter(
		(file) => file.endsWith('.js') && !file.endsWith('.LICENSE.txt'),
	);
	const codeByFile = new Map(
		jsFiles.map((file) => [
			file,
			readFileSync(resolve(distDir, file), 'utf-8'),
		]),
	);
	const chunkIdToFile = new Map();

	for (const [file, code] of codeByFile.entries()) {
		for (const chunkId of getProvidedChunkIds(code)) {
			chunkIdToFile.set(chunkId, file);
		}
	}

	const orderedScripts = [];
	const addScript = (file) => {
		if (
			!file ||
			file === 'extension.js' ||
			file === 'background.js' ||
			orderedScripts.includes(file)
		) {
			return;
		}

		orderedScripts.push(file);
	};

	for (const entryFile of ['react.js', 'showdown.js']) {
		const code = codeByFile.get(entryFile);
		if (!code) {
			continue;
		}

		for (const chunkId of getRequiredChunkIds(code)) {
			addScript(chunkIdToFile.get(chunkId));
		}
	}

	for (const file of [...jsFiles].sort()) {
		if (
			!['extension.js', 'background.js', 'react.js', 'showdown.js'].includes(
				file,
			)
		) {
			addScript(file);
		}
	}

	addScript('react.js');
	addScript('showdown.js');

	return orderedScripts;
}

function writeExtensionLoader() {
	const scriptFiles = getInjectedScriptFiles();
	const reactScripts = scriptFiles.filter((file) => file !== 'showdown.js');
	const showdownScript = scriptFiles.find((file) => file === 'showdown.js');
	// Preserve the compiled content-script logic (e.g. the Sheets relay) and
	// append the page-script injector below it. extension.js runs in the
	// content-script context, which has chrome.* access.
	const extensionPath = resolve(distDir, 'extension.js');
	const compiled = readFileSync(extensionPath, 'utf-8');
	const output = [
		compiled,
		'(()=>{',
		'const injectScript=(file)=>{const script=document.createElement("script");script.src=chrome.runtime.getURL(file);script.onload=()=>script.remove();(document.head||document.documentElement).append(script);};',
		'const injectStyle=(file)=>{const style=document.createElement("link");style.rel="stylesheet";style.href=chrome.runtime.getURL(file);(document.head||document.documentElement).append(style);};',
		...reactScripts.map(
			(file) => `injectScript(${JSON.stringify(`dist/${file}`)});`,
		),
		'injectStyle("dist/react.css");',
		...(showdownScript
			? [`injectScript(${JSON.stringify(`dist/${showdownScript}`)});`]
			: []),
		'})();',
	].join('');

	writeFileSync(resolve(distDir, 'extension.js'), output);
}

function build(target = 'chrome') {
	console.log(`Building for ${target}...`);

	execSync('rsbuild build', { cwd: __dirname, stdio: 'inherit' });
	writeExtensionLoader();

	const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
	const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
	manifest.version = version;

	cpSync(iconsDir, resolve(outputDir, 'icons'), { recursive: true });
	// The PASRS sheet template the extension uploads (via Drive) to auto-create a
	// tracker. Fetched at runtime through chrome.runtime.getURL.
	copyFileSync(templatePath, resolve(outputDir, 'pasrs-template.xlsx'));

	if (target === 'firefox') {
		manifest.browser_specific_settings = JSON.parse(`{${FIREFOX_ID}}`);
		// Firefox MV3 uses an event-page style background; service_worker is not
		// reliably supported. The Sheets auth there goes through launchWebAuthFlow.
		const serviceWorker = manifest.background?.service_worker;
		if (serviceWorker) {
			manifest.background = { scripts: [serviceWorker] };
		}
	} else {
		manifest.browser_specific_settings = undefined;
	}

	writeFileSync(
		resolve(outputDir, 'manifest.json'),
		JSON.stringify(manifest, null, '\t'),
	);

	console.log(`Built for ${target} successfully!`);
}

const target = process.argv[2] || 'chrome';
build(target);
