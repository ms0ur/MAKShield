// ===== ECDH Key Exchange Engine — P-384 (192-bit security) =====
const ECDHEngine = {
    CURVE: 'P-384',

    generateKeyPair: async () => {
        try {
            return await crypto.subtle.generateKey(
                { name: 'ECDH', namedCurve: ECDHEngine.CURVE },
                true,
                ['deriveKey', 'deriveBits']
            );
        } catch (e) {
            console.error('[Shield] ECDH generateKeyPair Error:', e);
            return null;
        }
    },

    exportPublicKey: async (publicKey) => {
        try {
            const exported = await crypto.subtle.exportKey('raw', publicKey);
            return CryptoEngine.toB64(exported);
        } catch (e) {
            console.error('[Shield] ECDH exportPublicKey Error:', e);
            return null;
        }
    },

    importPublicKey: async (publicKeyB64) => {
        try {
            const keyData = CryptoEngine.fromB64(publicKeyB64);
            // Auto-detect curve: P-256 raw = 65 bytes, P-384 raw = 97 bytes
            const curve = keyData.byteLength === 97 ? 'P-384' : 'P-256';
            return await crypto.subtle.importKey(
                'raw', keyData,
                { name: 'ECDH', namedCurve: curve },
                true, []
            );
        } catch (e) {
            console.error('[Shield] ECDH importPublicKey Error:', e);
            return null;
        }
    },

    exportPrivateKey: async (privateKey) => {
        try {
            const exported = await crypto.subtle.exportKey('jwk', privateKey);
            return JSON.stringify(exported);
        } catch (e) {
            console.error('[Shield] ECDH exportPrivateKey Error:', e);
            return null;
        }
    },

    importPrivateKey: async (privateKeyJWK) => {
        try {
            const jwk = JSON.parse(privateKeyJWK);
            const curve = jwk.crv || ECDHEngine.CURVE;
            return await crypto.subtle.importKey(
                'jwk', jwk,
                { name: 'ECDH', namedCurve: curve },
                true,
                ['deriveKey', 'deriveBits']
            );
        } catch (e) {
            console.error('[Shield] ECDH importPrivateKey Error:', e);
            return null;
        }
    },

    deriveSharedSecret: async (privateKey, peerPublicKey) => {
        // Try P-384 (384 bits), fallback to P-256 (256 bits)
        for (const bits of [384, 256]) {
            try {
                const sharedBits = await crypto.subtle.deriveBits(
                    { name: 'ECDH', public: peerPublicKey },
                    privateKey, bits
                );
                return CryptoEngine.toB64(sharedBits);
            } catch (_) { /* try next */ }
        }
        console.error('[Shield] ECDH deriveSharedSecret: all attempts failed');
        return null;
    },

    generateFingerprint: async (publicKeyB64) => {
        try {
            const keyData = CryptoEngine.fromB64(publicKeyB64);
            const hash = await crypto.subtle.digest('SHA-256', keyData);
            return CryptoEngine.toB64(hash).substring(0, 8).toUpperCase();
        } catch (_) {
            return '????????';
        }
    }
};

// ===== Core Crypto Engine — AES-256-GCM + PBKDF2(600K) + HKDF =====
const CryptoEngine = {
    PBKDF2_ITERATIONS: 600000,
    HKDF_INFO: 'makshield-v3-aes256gcm',

    // ---- Encoding helpers ----
    str2buf: (str) => new TextEncoder().encode(str),
    buf2str: (buf) => new TextDecoder().decode(buf),

    toB64: (buf) => {
        let binary = '';
        const bytes = new Uint8Array(buf);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    },

    fromB64: (str) => {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) str += '=';
        const binary = atob(str);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    },

    // ---- Key derivation: PBKDF2 → HKDF → AES-256 key ----
    deriveKey: async (password, salt) => {
        // Step 1: PBKDF2 — stretch password into master key material
        const passBuf = CryptoEngine.str2buf(password);
        const pbkdf2Key = await crypto.subtle.importKey(
            'raw', passBuf, 'PBKDF2', false, ['deriveBits']
        );
        const masterBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: CryptoEngine.PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            pbkdf2Key, 256
        );

        // Step 2: HKDF — expand master bits into AES key with domain separation
        const hkdfKey = await crypto.subtle.importKey(
            'raw', masterBits, 'HKDF', false, ['deriveKey']
        );
        return await crypto.subtle.deriveKey(
            {
                name: 'HKDF',
                hash: 'SHA-256',
                salt: new Uint8Array(32),
                info: CryptoEngine.str2buf(CryptoEngine.HKDF_INFO)
            },
            hkdfKey,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    },

    // Helper to compress bytes using Native Web API
    compressData: async (dataBuffer) => {
        if (typeof CompressionStream === 'undefined') return { bytes: dataBuffer, compressed: false };
        try {
            const stream = new Response(dataBuffer).body.pipeThrough(new CompressionStream('deflate'));
            const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
            return { bytes, compressed: true };
        } catch (e) {
            console.warn('[Shield] Compression failed, falling back:', e);
            return { bytes: dataBuffer, compressed: false };
        }
    },

    // ---- Encrypt plaintext → spoofed message ----
    encrypt: async (text, password, spoofPreset = null) => {
        try {
            const salt = crypto.getRandomValues(new Uint8Array(32));
            const iv = crypto.getRandomValues(new Uint8Array(12));

            const key = await CryptoEngine.deriveKey(password, salt);
            
            const plainBytes = CryptoEngine.str2buf(text);
            const compResult = await CryptoEngine.compressData(plainBytes);

            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                key,
                compResult.bytes
            );

            const payloadPkg = {
                v: 3,
                s: CryptoEngine.toB64(salt),
                iv: CryptoEngine.toB64(iv),
                d: CryptoEngine.toB64(encrypted)
            };

            if (compResult.compressed) {
                payloadPkg.c = 1;
            }

            const payload = JSON.stringify(payloadPkg);

            const safePayload = encodeURIComponent(
                CryptoEngine.toB64(CryptoEngine.str2buf(payload))
            );

            if (!spoofPreset) {
                spoofPreset = await ShieldStorage.getSpoofPreset();
            }
            return CryptoEngine.buildSpoofMessage(spoofPreset, safePayload);
        } catch (e) {
            console.error('[Shield] Encrypt Error:', e);
            return null;
        }
    },

    // ---- Decrypt spoofed message → plaintext ----
    decrypt: async (text, password) => {
        try {
            const currentPreset = await ShieldStorage.getSpoofPreset();
            const allPresets = [currentPreset, ...Object.values(SpoofPresets)];

            let payload = null;
            for (const preset of allPresets) {
                const extracted = CryptoEngine.extractPayload(text, preset);
                if (extracted) { payload = extracted; break; }
            }
            if (!payload) return null;

            const payloadJson = CryptoEngine.buf2str(
                CryptoEngine.fromB64(decodeURIComponent(payload))
            );
            const pkg = JSON.parse(payloadJson);
            if (pkg.v !== 3) return null;

            const salt = CryptoEngine.fromB64(pkg.s);
            const iv = CryptoEngine.fromB64(pkg.iv);
            const data = CryptoEngine.fromB64(pkg.d);

            const key = await CryptoEngine.deriveKey(password, salt);
            const decryptedBuf = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv }, key, data
            );

            let plainBytes = new Uint8Array(decryptedBuf);
            if (pkg.c === 1 && typeof DecompressionStream !== 'undefined') {
                try {
                    const stream = new Response(plainBytes).body.pipeThrough(new DecompressionStream('deflate'));
                    plainBytes = new Uint8Array(await new Response(stream).arrayBuffer());
                } catch (e) {
                    console.error('[Shield] Decompression error:', e);
                }
            }

            return { type: 'text', content: CryptoEngine.buf2str(plainBytes) };
        } catch (e) {
            console.error('[Shield] Decrypt Error:', e);
            return null;
        }
    },

    // ---- Build spoofed message from preset template ----
    buildSpoofMessage: (preset, data) => {
        let result = preset.template;

        // Replace {RND} placeholders with random values
        while (result.includes('{RND}')) {
            result = result.replace('{RND}', (Math.floor(Math.random() * 900) + 100).toString());
        }

        // Multipart or single-part data replacement
        if (preset.multipart && preset.parts && preset.parts >= 2) {
            const parts = CryptoEngine.splitDataForMultipart(data, preset.parts);
            for (let i = 0; i < preset.parts; i++) {
                result = result.replace(`{DATA_${i + 1}}`, parts[i] || '');
            }
        } else {
            result = result.replace(/\{DATA\}/g, data);
        }
        return result;
    },

    splitDataForMultipart: (data, numParts) => {
        const partLen = Math.ceil(data.length / numParts);
        const parts = [];
        for (let i = 0; i < numParts; i++) {
            parts.push(data.slice(i * partLen, (i + 1) * partLen));
        }
        return parts;
    },

    // ---- Extract payload from text using preset patterns ----
    extractPayload: (text, preset) => {
        if (!preset || !preset.detect) return null;

        // Clean text and remove zero-width chars injected by some platforms
        const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/[\u200B-\u200D\uFEFF]/g, '');

        const fixRegex = (regex) => {
            const src = typeof regex === 'string' ? regex : regex.source;
            if (src.endsWith('([^\\n]+)') || src.endsWith('([^"]+)')) {
                const prefix = src.replace(/\(\[\^\\n\]\+\)$/, '').replace(/\(\[\^"\]\+\)$/, '');
                return new RegExp(prefix + '([A-Za-z0-9%_\\-\\n\\r]+)');
            }
            return typeof regex === 'string' ? new RegExp(regex) : regex;
        };

        // --- Multipart extraction ---
        if (preset.multipart && preset.extractMulti && preset.parts >= 2) {
            const parts = [];
            for (let i = 0; i < preset.extractMulti.length; i++) {
                const regex = fixRegex(preset.extractMulti[i]);
                const match = cleanText.match(regex);
                if (match && match[1]) {
                    parts.push(match[1].replace(/[\s\n\r]+/g, ''));
                }
            }
            if (parts.length === preset.parts) {
                return parts.join('');
            }
        }

        // --- Single-part extraction with custom regex ---
        if (preset.extract) {
            const regex = fixRegex(preset.extract);
            const match = cleanText.match(regex);
            if (match && match[1]) return match[1].replace(/[\s\n\r]+/g, '');
        }

        // --- URL parameter extraction ---
        if (preset.param) {
            const paramName = preset.param;
            const escaped = paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let patterns;
            if (paramName.endsWith('=') || paramName.endsWith('-') || paramName.endsWith('_')) {
                patterns = [new RegExp(escaped + '([A-Za-z0-9%_\\-\\n\\r]+)')];
            } else {
                patterns = [
                    new RegExp(escaped + '=([A-Za-z0-9%_\\-\\n\\r]+)'),
                    new RegExp(escaped + '-([A-Za-z0-9%_\\-\\n\\r]+)'),
                    new RegExp(escaped + '([A-Za-z0-9%_\\-\\n\\r]+)')
                ];
            }
            for (const p of patterns) {
                const match = cleanText.match(p);
                if (match && match[1]) return match[1].replace(/[\s\n\r]+/g, '');
            }
        }
        return null;
    },

    // ---- ECDH key message helpers ----
    createECDHKeyMessage: async (publicKeyB64, spoofPreset = null) => {
        try {
            const payload = JSON.stringify({
                v: 3,
                t: 'ecdh',
                c: ECDHEngine.CURVE,
                pk: publicKeyB64
            });
            const safePayload = encodeURIComponent(
                CryptoEngine.toB64(CryptoEngine.str2buf(payload))
            );
            if (!spoofPreset) spoofPreset = await ShieldStorage.getSpoofPreset();
            return CryptoEngine.buildSpoofMessage(spoofPreset, safePayload);
        } catch (e) {
            console.error('[Shield] createECDHKeyMessage Error:', e);
            return null;
        }
    },

    parsePayloadAsync: async (text) => {
        try {
            const currentPreset = await ShieldStorage.getSpoofPreset();
            const allPresets = [currentPreset, ...Object.values(SpoofPresets)];
            let payloadStr = null;
            for (const preset of allPresets) {
                const extracted = CryptoEngine.extractPayload(text, preset);
                if (extracted) { payloadStr = extracted; break; }
            }
            if (!payloadStr) return null;
            const payloadJson = CryptoEngine.buf2str(
                CryptoEngine.fromB64(decodeURIComponent(payloadStr))
            );
            return JSON.parse(payloadJson);
        } catch (_) { return null; }
    },

    parsePayload: (text) => {
        try {
            const allPresets = Object.values(SpoofPresets);
            let payloadStr = null;
            for (const preset of allPresets) {
                const extracted = CryptoEngine.extractPayload(text, preset);
                if (extracted) { payloadStr = extracted; break; }
            }
            if (!payloadStr) return null;
            const payloadJson = CryptoEngine.buf2str(
                CryptoEngine.fromB64(decodeURIComponent(payloadStr))
            );
            return JSON.parse(payloadJson);
        } catch (_) { return null; }
    }
};
