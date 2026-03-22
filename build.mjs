import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, 'output');
const manifestPath = resolve(__dirname, 'manifest.base.json');
const packageJsonPath = resolve(__dirname, 'package.json');

const FIREFOX_ID =
	'"gecko": {"id": "pasrs-helper@malaow3.com","strict_min_version": "109.0"}';

function build(target = 'chrome') {
	console.log(`Building for ${target}...`);

	execSync('rsbuild build', { cwd: __dirname, stdio: 'inherit' });

	const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
	const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
	manifest.version = version;

	if (target === 'firefox') {
		manifest.browser_specific_settings = JSON.parse(`{${FIREFOX_ID}}`);
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
