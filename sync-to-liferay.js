const fs = require('fs-extra');
const path = require('path');

// Cấu hình đường dẫn
const BUILD_DIR = path.join(__dirname, 'build');
const LIFERAY_PROJECT_DIR = path.join(__dirname, 'liferay-build');
const COLLECTION_DIR = path.join(LIFERAY_PROJECT_DIR, 'src', 'liferay-fragment');
const FRAGMENT_DIR = path.join(COLLECTION_DIR, 'fragments', 'react-hello-world');

console.log('🚀 Syncing React build to Liferay Fragment...\n');
console.log('📂 Paths:');
console.log('   Build dir:', BUILD_DIR);
console.log('   Liferay project:', LIFERAY_PROJECT_DIR);
console.log('   Collection dir:', COLLECTION_DIR);
console.log('   Fragment dir:', FRAGMENT_DIR);
console.log('');

try {
  // 1. Kiểm tra build folder
  if (!fs.existsSync(BUILD_DIR)) {
    console.error('❌ Build folder not found!');
    console.error('   Expected at:', BUILD_DIR);
    console.error('   Please run "npm run build" first.');
    process.exit(1);
  }
  console.log('✅ Build folder found');

  // 2. Kiểm tra/Tạo liferay-build project structure
  if (!fs.existsSync(LIFERAY_PROJECT_DIR)) {
    console.error('❌ Liferay project not found!');
    console.error('   Expected at:', LIFERAY_PROJECT_DIR);
    console.error('   Make sure liferay-build folder exists.');
    process.exit(1);
  }
  console.log('✅ Liferay project found');

  // 3. Tạo collection directory nếu chưa có
  if (!fs.existsSync(COLLECTION_DIR)) {
    console.log('📁 Creating collection directory...');
    fs.ensureDirSync(COLLECTION_DIR);
  }
  console.log('✅ Collection directory ready');

  // 4. Tạo/Cập nhật collection.json
  const collectionJsonPath = path.join(COLLECTION_DIR, 'collection.json');
  const collectionJson = {
    name: "vec-intranet",
    description: "React-based fragments for Liferay Portal"
  };
  fs.writeJsonSync(collectionJsonPath, collectionJson, { spaces: 2 });
  console.log('✅ Created/Updated collection.json');

  // 5. Tạo fragments directory nếu chưa có
  const fragmentsDir = path.join(COLLECTION_DIR, 'fragments');
  if (!fs.existsSync(fragmentsDir)) {
    fs.ensureDirSync(fragmentsDir);
  }

  // 6. Tạo fragment directory
  if (!fs.existsSync(FRAGMENT_DIR)) {
    console.log('📁 Creating fragment directory...');
    fs.ensureDirSync(FRAGMENT_DIR);
  }
  console.log('✅ Fragment folder ready');

  // 7. Copy static folder
  const STATIC_SRC = path.join(BUILD_DIR, 'static');
  const STATIC_DEST = path.join(FRAGMENT_DIR, 'resources');

  if (!fs.existsSync(STATIC_SRC)) {
    console.error('❌ Static folder not found in build!');
    console.error('   Expected at:', STATIC_SRC);
    console.error('   Build might have failed. Check build output.');
    process.exit(1);
  }

  // Xóa static cũ
  if (fs.existsSync(STATIC_DEST)) {
    fs.removeSync(STATIC_DEST);
    console.log('🗑️  Removed old static folder');
  }

  // Copy static mới
  fs.copySync(STATIC_SRC, STATIC_DEST);
  console.log('✅ Copied static folder');

  // 8. Tìm file CSS và JS
  const cssDir = path.join(STATIC_DEST, 'css');
  const jsDir = path.join(STATIC_DEST, 'js');

  if (!fs.existsSync(cssDir) || !fs.existsSync(jsDir)) {
    console.error('❌ CSS or JS folder not found!');
    console.error('   CSS dir exists:', fs.existsSync(cssDir));
    console.error('   JS dir exists:', fs.existsSync(jsDir));
    process.exit(1);
  }

  const cssFiles = fs.readdirSync(cssDir).filter(f => f.startsWith('main.') && f.endsWith('.css'));
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.startsWith('main.') && f.endsWith('.js'));

  if (cssFiles.length === 0) {
    console.error('❌ No main CSS file found!');
    console.error('   Files in css folder:', fs.readdirSync(cssDir));
    process.exit(1);
  }

  if (jsFiles.length === 0) {
    console.error('❌ No main JS file found!');
    console.error('   Files in js folder:', fs.readdirSync(jsDir));
    process.exit(1);
  }

  const mainCss = cssFiles[0];
  const mainJs = jsFiles[0];

  console.log(`\n📄 Found files:`);
  console.log(`   CSS: ${mainCss}`);
  console.log(`   JS:  ${mainJs}\n`);

  // 9. Tạo index.html
  const indexHtml = `<div id="react-root"></div>

<!-- Load React libraries -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Load CSS -->
<link rel="stylesheet" href="[resources:css/${mainCss}]">

<!-- Load React app bundle -->
<script src="[resources:js/${mainJs}]"></script>`;

  fs.writeFileSync(path.join(FRAGMENT_DIR, 'index.html'), indexHtml);
  console.log('✅ Created index.html');

// 10. Tạo index.js
const indexJs = `const root = fragmentElement.querySelector('#react-root');

console.log('Fragment loaded');
console.log('React root:', root);
console.log('Global app:', window.ReactHelloWorldApp);

if (root && window.ReactHelloWorldApp) {
  window.ReactHelloWorldApp.render(root);
}`;
fs.writeFileSync(path.join(FRAGMENT_DIR, 'index.js'), indexJs);
console.log('✅ Created index.js');

  // 11. Tạo index.css
  const indexCss = `.react-fragment-container {
  width: 100%;
  min-height: 200px;
}`;

  fs.writeFileSync(path.join(FRAGMENT_DIR, 'index.css'), indexCss);
  console.log('✅ Created index.css');

  // 12. Tạo fragment.json
  const fragmentJson = {
    cssPath: 'index.css',
    htmlPath: 'index.html',
    jsPath: 'index.js',
    name: 'intranet-fragment',
    type: 'component'
  };

  fs.writeJsonSync(path.join(FRAGMENT_DIR, 'fragment.json'), fragmentJson, { spaces: 2 });
  console.log('✅ Created fragment.json');

  // 13. Thành công
  console.log('\n✨ Sync completed successfully!\n');
  console.log('📁 Complete structure:');
  console.log('   liferay-fragment/');
  console.log('   ├── collection.json        ← Collection metadata');
  console.log('   └── fragments/');
  console.log('       └── react-hello-world/');
  console.log('           ├── fragment.json');
  console.log('           ├── index.html');
  console.log('           ├── index.css');
  console.log('           ├── index.js');
  console.log('           └── static/');
  console.log('               ├── css/');
  console.log(`               │   └── ${mainCss}`);
  console.log('               ├── js/');
  console.log(`               │   └── ${mainJs}`);
  console.log('               └── media/\n');
  console.log('📝 Next steps:');
  console.log('   1. cd liferay-build');
  console.log('   2. npm run compress');
  console.log('   3. Answer "No" to deployment descriptor');
  console.log('   4. Import the generated ZIP to Liferay Portal\n');

} catch (error) {
  console.error('\n❌ Error during sync:', error.message);
  console.error(error);
  process.exit(1);
}