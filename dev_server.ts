import chokidar from 'chokidar';
const { exec } = require('node:child_process');

const target = process.argv[2] || 'chrome';

console.log(`Starting dev server for ${target}...`);

chokidar.watch(['src', 'manifest.json']).on('all', (event, path) => {
	console.log(event, path);
	exec(`node build.mjs ${target}`, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});
});
