const { execSync } = require('child_process');
const path = require('path');

const rendererPath = path.join(__dirname, '../../renderer');

try {
  console.log('🔨 Building renderer...');
  execSync('npm run build', { cwd: rendererPath, stdio: 'inherit' });
  
  console.log('\n📦 Copying build to backend...');
  execSync('npm run copy-build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  
  console.log('\n✅ Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
