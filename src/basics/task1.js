import process from 'node:process';

process.stdin.on('data', (data) => {
    process.stdout.write(data.toString().trim().split('').reverse().join('') + '\n\n');
});
