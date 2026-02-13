import forge from 'node-forge';

// Generate a random AES key (32 bytes)
export const generateAESKey = () => {
    return forge.random.getBytesSync(32);
};

// Generate a random IV (12 bytes for GCM)
export const generateIV = () => {
    return forge.random.getBytesSync(12);
};

// Encrypt data with AES-GCM
export const encryptData = (data, key, iv) => {
    const cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(JSON.stringify(data), 'utf8'));
    cipher.finish();
    const encrypted = cipher.output.getBytes();
    const tag = cipher.mode.tag.getBytes();
    return forge.util.encode64(encrypted + tag); // Concatenate ciphertext + tag
};

// Encrypt the AES key with RSA Public Key
export const encryptKey = (aesKey, publicKeyPem) => {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedKey = publicKey.encrypt(aesKey, 'RSA-OAEP');
    return forge.util.encode64(encryptedKey);
};

// Decrypt AES Key with RSA Private Key
export const decryptKey = (encryptedKeyBase64, privateKeyPem) => {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedKey = forge.util.decode64(encryptedKeyBase64);
    const aesKey = privateKey.decrypt(encryptedKey, 'RSA-OAEP');
    return aesKey;
};

// Decrypt Data with AES-GCM
export const decryptData = (encryptedDataBase64, key, ivBase64) => {
    const raw = forge.util.decode64(encryptedDataBase64);
    // Split ciphertext and tag (Tag is 16 bytes/128 bits for GCM default)
    const tagLength = 16;
    const encrypted = raw.slice(0, -tagLength);
    const tag = raw.slice(-tagLength);

    const decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({ iv: forge.util.decode64(ivBase64), tag: forge.util.createBuffer(tag) });
    decipher.update(forge.util.createBuffer(encrypted));
    const pass = decipher.finish(); // Check auth tag

    if (pass) {
        return JSON.parse(decipher.output.toString('utf8'));
    }
    throw new Error('Decryption Failed: Invalid Tag');
};

// Generate RSA Key Pair (Helper for Admin setup)
export const generateRSAKeyPair = async () => {
    return new Promise((resolve, reject) => {
        forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, keypair) => {
            if (err) reject(err);
            else {
                resolve({
                    publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
                    privateKey: forge.pki.privateKeyToPem(keypair.privateKey)
                });
            }
        });
    });
};
