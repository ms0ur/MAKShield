// ECDH Key Exchange Engine
const ECDHEngine = {
    // Generate ECDH key pair (P-256 curve)
    generateKeyPair: async () => {
        try {
            const keyPair = await window.crypto.subtle.generateKey(
                { name: "ECDH", namedCurve: "P-256" },
                true,
                ["deriveKey", "deriveBits"]
            );
            return keyPair;
        } catch (e) {
            console.error("[Shield] ECDH generateKeyPair Error:", e);
            return null;
        }
    },

    // Export public key to base64 string
    exportPublicKey: async (publicKey) => {
        try {
            const exported = await window.crypto.subtle.exportKey("raw", publicKey);
            return CryptoEngine.toB64(exported);
        } catch (e) {
            console.error("[Shield] ECDH exportPublicKey Error:", e);
            return null;
        }
    },

    // Import public key from base64 string
    importPublicKey: async (publicKeyB64) => {
        try {
            const keyData = CryptoEngine.fromB64(publicKeyB64);
            const publicKey = await window.crypto.subtle.importKey(
                "raw",
                keyData,
                { name: "ECDH", namedCurve: "P-256" },
                true,
                []
            );
            return publicKey;
        } catch (e) {
            console.error("[Shield] ECDH importPublicKey Error:", e);
            return null;
        }
    },

    // Export private key to JWK for storage
    exportPrivateKey: async (privateKey) => {
        try {
            const exported = await window.crypto.subtle.exportKey("jwk", privateKey);
            return JSON.stringify(exported);
        } catch (e) {
            console.error("[Shield] ECDH exportPrivateKey Error:", e);
            return null;
        }
    },

    // Import private key from JWK string
    importPrivateKey: async (privateKeyJWK) => {
        try {
            const jwk = JSON.parse(privateKeyJWK);
            const privateKey = await window.crypto.subtle.importKey(
                "jwk",
                jwk,
                { name: "ECDH", namedCurve: "P-256" },
                true,
                ["deriveKey", "deriveBits"]
            );
            return privateKey;
        } catch (e) {
            console.error("[Shield] ECDH importPrivateKey Error:", e);
            return null;
        }
    },

    // Derive shared secret from own private key and peer's public key
    deriveSharedSecret: async (privateKey, peerPublicKey) => {
        try {
            const sharedBits = await window.crypto.subtle.deriveBits(
                { name: "ECDH", public: peerPublicKey },
                privateKey,
                256
            );
            // Convert to base64 string for use as password
            return CryptoEngine.toB64(sharedBits);
        } catch (e) {
            console.error("[Shield] ECDH deriveSharedSecret Error:", e);
            return null;
        }
    },

    // Generate fingerprint for key verification (first 8 chars of SHA-256 hash)
    generateFingerprint: async (publicKeyB64) => {
        try {
            const keyData = CryptoEngine.fromB64(publicKeyB64);
            const hash = await window.crypto.subtle.digest("SHA-256", keyData);
            const hashB64 = CryptoEngine.toB64(hash);
            return hashB64.substring(0, 8).toUpperCase();
        } catch (e) {
            console.error("[Shield] ECDH generateFingerprint Error:", e);
            return "????????";
        }
    }
};

const CryptoEngine = {
    str2buf: (str) => new TextEncoder().encode(str),
    buf2str: (buf) => new TextDecoder().decode(buf),

    toB64: (buf) => {
        let binary = '';
        const bytes = new Uint8Array(buf);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    },

    fromB64: (str) => {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        const binary = window.atob(str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    },

    importPassword: async (password, saltBase64 = null) => {
        const passBuf = CryptoEngine.str2buf(password);
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw", passBuf, "PBKDF2", false, ["deriveKey"]
        );

        let salt;
        if (saltBase64) {
            salt = CryptoEngine.fromB64(saltBase64);
        } else {
            salt = window.crypto.getRandomValues(new Uint8Array(16));
        }

        const key = await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );

        return { key, salt };
    },

    buildSpoofMessage: (preset, data) => {
        const rnd = Math.floor(Math.random() * 900) + 100;
        return preset.template
            .replace(/\{RND\}/g, rnd.toString())
            .replace(/\{DATA\}/g, data);
    },

    // Create ECDH key exchange message (unencrypted, just encoded)
    createECDHKeyMessage: async (publicKeyB64, spoofPreset = null) => {
        try {
            const payload = JSON.stringify({
                v: 2,
                t: 'ecdh',
                pk: publicKeyB64
            });

            const safePayload = encodeURIComponent(CryptoEngine.toB64(CryptoEngine.str2buf(payload)));

            if (!spoofPreset) {
                spoofPreset = await ShieldStorage.getSpoofPreset();
            }

            return CryptoEngine.buildSpoofMessage(spoofPreset, safePayload);
        } catch (e) {
            console.error("[Shield] createECDHKeyMessage Error:", e);
            return null;
        }
    },

    // Parse payload and check if it's ECDH key exchange
    parsePayload: (text) => {
        try {
            const currentPreset = ShieldStorage.getSpoofPreset();
            const allPresets = [currentPreset, ...Object.values(SpoofPresets)];

            let payloadStr = null;
            for (const preset of allPresets) {
                if (preset && preset.then) continue; // skip promises
                const extracted = CryptoEngine.extractPayload(text, preset);
                if (extracted) {
                    payloadStr = extracted;
                    break;
                }
            }

            if (!payloadStr) return null;

            const payloadJson = CryptoEngine.buf2str(
                CryptoEngine.fromB64(decodeURIComponent(payloadStr))
            );
            return JSON.parse(payloadJson);
        } catch (e) {
            return null;
        }
    },

    // Async version of parsePayload
    parsePayloadAsync: async (text) => {
        try {
            const currentPreset = await ShieldStorage.getSpoofPreset();
            const allPresets = [currentPreset, ...Object.values(SpoofPresets)];

            let payloadStr = null;
            for (const preset of allPresets) {
                const extracted = CryptoEngine.extractPayload(text, preset);
                if (extracted) {
                    payloadStr = extracted;
                    break;
                }
            }

            if (!payloadStr) return null;

            const payloadJson = CryptoEngine.buf2str(
                CryptoEngine.fromB64(decodeURIComponent(payloadStr))
            );
            return JSON.parse(payloadJson);
        } catch (e) {
            return null;
        }
    },

    encrypt: async (text, password, spoofPreset = null) => {
        try {
            const { key, salt } = await CryptoEngine.importPassword(password);
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const data = CryptoEngine.str2buf(text);

            const encrypted = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                data
            );

            const payload = JSON.stringify({
                v: 2,
                t: 'text',
                s: CryptoEngine.toB64(salt),
                iv: CryptoEngine.toB64(iv),
                d: CryptoEngine.toB64(encrypted)
            });

            const safePayload = encodeURIComponent(CryptoEngine.toB64(CryptoEngine.str2buf(payload)));

            if (!spoofPreset) {
                spoofPreset = await ShieldStorage.getSpoofPreset();
            }

            return CryptoEngine.buildSpoofMessage(spoofPreset, safePayload);

        } catch (e) {
            console.error("[Shield] Encrypt Error:", e);
            return null;
        }
    },

    extractPayload: (text, preset) => {
        if (preset.extract) {
            const regex = typeof preset.extract === 'string'
                ? new RegExp(preset.extract)
                : preset.extract;
            const match = text.match(regex);
            return match ? match[1] : null;
        }

        if (preset.param) {
            const paramRegex = new RegExp(preset.param + '=([^&\\s]+)');
            const match = text.match(paramRegex);
            return match ? match[1] : null;
        }

        return null;
    },

    decrypt: async (text, password) => {
        try {
            const currentPreset = await ShieldStorage.getSpoofPreset();
            const allPresets = [currentPreset, ...Object.values(SpoofPresets)];

            let payload = null;
            for (const preset of allPresets) {
                const extracted = CryptoEngine.extractPayload(text, preset);
                if (extracted) {
                    payload = extracted;
                    break;
                }
            }

            if (!payload) return null;

            const payloadJson = CryptoEngine.buf2str(
                CryptoEngine.fromB64(decodeURIComponent(payload))
            );
            const pkg = JSON.parse(payloadJson);

            if (pkg.v !== 1 && pkg.v !== 2) return null;

            const { key } = await CryptoEngine.importPassword(password, pkg.s);
            const iv = CryptoEngine.fromB64(pkg.iv);
            const data = CryptoEngine.fromB64(pkg.d);

            const decryptedBuf = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                data
            );

            return {
                type: 'text',
                content: CryptoEngine.buf2str(decryptedBuf)
            };
        } catch (e) {
            console.error("[Shield] Decrypt Error:", e);
            return null;
        }
    }
};
