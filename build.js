const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Install frontend dependencies
console.log('Installing frontend dependencies...');
execSync('cd frontend && npm install', { stdio: 'inherit' });

// 2. Build frontend
console.log('Building frontend...');
execSync('cd frontend && npm run build', { stdio: 'inherit' });

// 3. Clean root dist folder
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
}

// 4. Copy frontend/dist to root dist
console.log('Copying build output to root dist...');
fs.cpSync(path.join(__dirname, 'frontend', 'dist'), distPath, { recursive: true });

console.log('Build completed successfully!');
