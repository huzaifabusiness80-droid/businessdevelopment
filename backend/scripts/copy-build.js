const fs = require('fs');
const path = require('path');

const rendererBuildPath = path.join(__dirname, '../../renderer/build');
const backendDestPath = path.join(__dirname, '../renderer/build');

// Copy renderer build to backend renderer folder
function copyBuild() {
  try {
    // Remove existing destination folder if it exists
    if (fs.existsSync(backendDestPath)) {
      fs.rmSync(backendDestPath, { recursive: true, force: true });
    }

    // Copy new build
    fs.cpSync(rendererBuildPath, backendDestPath, { recursive: true });
    console.log('✅ Build copied successfully from renderer/build to backend/renderer/build');
  } catch (error) {
    console.error('❌ Error copying build:', error.message);
    process.exit(1);
  }
}

copyBuild();
