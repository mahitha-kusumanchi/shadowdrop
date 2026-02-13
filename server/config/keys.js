const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const KEYS_DIR = path.join(__dirname, '../keys');
const PUB_KEY_PATH = path.join(KEYS_DIR, 'public.pem');
const PRIV_KEY_PATH = path.join(KEYS_DIR, 'private.pem');

// Ensure keys exist
const initializeKeys = () => {
    if (!fs.existsSync(KEYS_DIR)) fs.mkdirSync(KEYS_DIR, { recursive: true });

    if (!fs.existsSync(PRIV_KEY_PATH) || !fs.existsSync(PUB_KEY_PATH)) {
        console.log('Generating RSA Key Pair...');
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        fs.writeFileSync(PUB_KEY_PATH, publicKey);
        fs.writeFileSync(PRIV_KEY_PATH, privateKey);
        console.log('Keys generated successfully.');
    } else {
        console.log('Keys already exist.');
    }
};

const getPublicKey = () => {
    if (!fs.existsSync(PUB_KEY_PATH)) initializeKeys();
    return fs.readFileSync(PUB_KEY_PATH, 'utf8');
};

const getPrivateKey = () => {
    // In a real app, this might be password protected or not stored on disk like this if strictly E2EE client-side only.
    // However, for the signature part (Server signing), the server needs a private key (its own Identity Key, distinct from the decryption key if we are splitting roles).
    // For simplicity in this demo, we use the same key or a separate signing key.
    // Let's assume this key is the Server's Identity Key.
    if (!fs.existsSync(PRIV_KEY_PATH)) initializeKeys();
    return fs.readFileSync(PRIV_KEY_PATH, 'utf8');
};

module.exports = { initializeKeys, getPublicKey, getPrivateKey };
