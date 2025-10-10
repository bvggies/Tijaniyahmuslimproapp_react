const { spawn } = require('child_process');
const path = require('path');

console.log('=== Starting Tijaniyah API ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', process.env.PORT || 3000);
console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('Working directory:', process.cwd());
console.log('Script directory:', __dirname);

// List files in current directory
const fs = require('fs');
console.log('Files in current directory:');
try {
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stat = fs.statSync(file);
    console.log(`  ${stat.isDirectory() ? '📁' : '📄'} ${file}`);
  });
} catch (error) {
  console.error('Error listing files:', error);
}

// Check if dist/main.js exists
const mainPath = path.join(__dirname, 'dist', 'main.js');
console.log('Looking for main.js at:', mainPath);

if (!fs.existsSync(mainPath)) {
  console.error('❌ dist/main.js not found! Build may have failed.');
  
  // Check if dist directory exists
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('dist directory exists, contents:');
    try {
      const distFiles = fs.readdirSync(distPath);
      distFiles.forEach(file => {
        console.log(`  📄 ${file}`);
      });
    } catch (error) {
      console.error('Error reading dist directory:', error);
    }
  } else {
    console.log('❌ dist directory does not exist');
  }
  
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
