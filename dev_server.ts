import chokidar from 'chokidar';
const { exec } = require('child_process');

chokidar.watch('src').on('all', (event, path) => {
    console.log(event, path);
    // Trigger a rebuild or other action here
    exec('rsbuild build', (error, stdout, stderr) => {
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