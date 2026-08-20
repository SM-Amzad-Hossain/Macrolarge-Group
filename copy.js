const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

fs.copyFileSync('C:\\Users\\Amzad\\.gemini\\antigravity-ide\\brain\\3efa7724-e2be-4333-ad6e-9ef48bd4b8f2\\macrolarge_logo_1787244073970.png', path.join(dir, 'logo.png'));

console.log('Logo copied successfully.');
