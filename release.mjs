import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = resolve(__dirname, 'build');
const outputDir = resolve(__dirname, 'dist');
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
	const targetDir = join(buildDir, target);
	mkdirSync(targetDir, { recursive: true });

	cpSync(outputDir, join(targetDir, 'dist'), { recursive: true });
	cpSync(resolve(__dirname, '128.png'), join(targetDir, '128.png'));

	const manifestFile =
		target === 'firefox' ? 'firefox_manifest.json' : 'manifest.json';
	cpSync(resolve(__dirname, manifestFile), join(targetDir, 'manifest.json'));

	return targetDir;
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
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
