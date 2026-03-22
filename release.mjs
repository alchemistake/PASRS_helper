import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = resolve(__dirname, 'build');
const outputDir = resolve(__dirname, 'output');
const packageJsonPath = resolve(__dirname, 'package.json');

const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

function exec(command, options = {}) {
	console.log(`$ ${command}`);
	return execSync(command, {
		stdio: 'inherit',
		...options,
	});
}

function buildExtension(target = 'chrome') {
	console.log(`Building ${target} extension...`);
	const buildScript = target === 'firefox' ? 'build:firefox' : 'build:chrome';
	exec(`bun run ${buildScript}`);
	cpSync(outputDir, join(buildDir, target), { recursive: true });
}

function zipDirectory(sourceDir, outputPath) {
	if (existsSync(outputPath)) {
		rmSync(outputPath);
	}
	exec(`zip -r "${outputPath}" .`, { cwd: sourceDir });
}

function buildSourceZip() {
	const sourceZipName = 'pasrs-helper.source.zip';
	const sourceZipPath = join(buildDir, sourceZipName);

	console.log(`Creating source zip: ${sourceZipName}`);

	exec(
		`git ls-files --cached --exclude-standard -z | xargs -0 zip "${sourceZipName}"`,
		{ cwd: __dirname },
	);

	rmSync(sourceZipPath, { force: true });
	cpSync(resolve(__dirname, sourceZipName), sourceZipPath);
	rmSync(resolve(__dirname, sourceZipName));

	console.log(`Created source zip: ${sourceZipPath}`);
}

async function uploadToChrome(chromeZip) {
	console.log('Uploading to Chrome Web Store...');
	try {
		exec('npx chrome-webstore-upload --help');
	} catch {
		console.log(
			'Chrome upload tool not found. Install with: npm install -g chrome-webstore-upload-cli',
		);
		console.log(
			'Or set environment variables: CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, EXTENSION_ID',
		);
		return;
	}

	const clientId = process.env.CLIENT_ID;
	const clientSecret = process.env.CLIENT_SECRET;
	const refreshToken = process.env.REFRESH_TOKEN;
	const extensionId = process.env.EXTENSION_ID;

	if (!clientId || !clientSecret || !refreshToken || !extensionId) {
		console.log('Missing Chrome credentials. Skipping upload.');
		return;
	}

	exec(
		`npx chrome-webstore-upload upload --source "${chromeZip}" --extension-id "${extensionId}" --client-id "${clientId}" --client-secret "${clientSecret}" --refresh-token "${refreshToken}"`,
	);
	console.log('Uploaded to Chrome Web Store!');
}

async function uploadToFirefox(firefoxZip) {
	console.log('Uploading to Firefox Add-ons...');
	try {
		exec('npx web-ext --version');
	} catch {
		console.log('web-ext not found. Install with: npm install -g web-ext');
		console.log(
			'Or set environment variables: WEB_EXT_JWT_ISSUER, WEB_EXT_JWT_SECRET',
		);
		return;
	}

	const jwtIssuer = process.env.WEB_EXT_JWT_ISSUER;
	const jwtSecret = process.env.WEB_EXT_JWT_SECRET;

	if (!jwtIssuer || !jwtSecret) {
		console.log('Missing Firefox credentials. Skipping upload.');
		return;
	}

	exec(
		`npx web-ext sign --source-dir "${join(buildDir, 'firefox')}" --api-key "${jwtIssuer}" --api-secret "${jwtSecret}"`,
	);
	console.log('Uploaded to Firefox Add-ons!');
}

async function createGitHubRelease() {
	const tag = `v${version}`;
	const releaseName = `v${version}`;

	console.log('Checking for GitHub CLI...');
	try {
		exec('gh --version');
	} catch {
		console.error('GitHub CLI (gh) is not installed. Skip GitHub release.');
		return;
	}

	const chromeZip = join(buildDir, 'pasrs-helper.chrome.zip');
	const firefoxZip = join(buildDir, 'pasrs-helper.firefox.zip');
	const sourceZip = join(buildDir, 'pasrs-helper.source.zip');

	console.log(`Creating GitHub release: ${tag}`);

	exec(
		`gh release create "${tag}" "${chromeZip}" "${firefoxZip}" "${sourceZip}" --title "${releaseName}"`,
		{ cwd: __dirname },
	);

	console.log(`Release ${tag} created successfully!`);
}

async function main() {
	const args = process.argv.slice(2);
	const skipBuild = args.includes('--skip-build');
	const skipUpload = args.includes('--skip-upload');

	if (!skipBuild) {
		console.log('Installing dependencies...');
		exec('bun i');

		console.log('Building...');
		exec('bun run build');
	}

	if (existsSync(buildDir)) {
		rmSync(buildDir, { recursive: true });
	}
	mkdirSync(buildDir, { recursive: true });

	console.log('Building Chrome extension...');
	buildExtension('chrome');
	const chromeZip = join(buildDir, 'pasrs-helper.chrome.zip');
	zipDirectory(join(buildDir, 'chrome'), chromeZip);
	console.log(`Created: ${chromeZip}`);

	console.log('Building Firefox extension...');
	buildExtension('firefox');
	const firefoxZip = join(buildDir, 'pasrs-helper.firefox.zip');
	zipDirectory(join(buildDir, 'firefox'), firefoxZip);
	console.log(`Created: ${firefoxZip}`);

	buildSourceZip();

	if (!skipUpload) {
		await createGitHubRelease();
		await uploadToChrome(chromeZip);
		await uploadToFirefox(firefoxZip);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
