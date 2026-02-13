const fs = require('fs');
const path = require('path');

const privateKeyPath = path.join(__dirname, 'keys', 'private.pem');

try {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    console.log('\n🔑 PRIVATE KEY (Copy this entire block):\n');
    console.log('═'.repeat(60));
    console.log(privateKey);
    console.log('═'.repeat(60));
    console.log('\n📝 Instructions:');
    console.log('1. Copy the ENTIRE key above (including BEGIN/END lines)');
    console.log('2. Login to the admin dashboard');
    console.log('3. Paste it into the "Decryption Key" textarea');
    console.log('4. Now you can decrypt and view reports!\n');
} catch (err) {
    console.error('❌ Error reading private key:', err.message);
}
