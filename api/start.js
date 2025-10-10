const { spawn } = require('child_process');
const path = require('path');

console.log('=== Starting Tijaniyah API ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || 3000);
console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

// Check if dist/main.js exists
const fs = require('fs');
const mainPath = path.join(__dirname, 'dist', 'main.js');

if (!fs.existsSync(mainPath)) {
  console.error('❌ dist/main.js not found! Build may have failed.');
  process.exit(1);
}

console.log('✅ dist/main.js found, starting application...');

// Start the application
const child = spawn('node', ['dist/main.js'], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
});
