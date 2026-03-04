import crypto from 'crypto';

const ALGO = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;

const toBase64Url = (buffer) => buffer.toString('base64url');
const fromBase64Url = (value) => Buffer.from(value, 'base64url');

const getSecret = () => (
    process.env.GITHUB_TOKEN_SECRET
    || process.env.ENCRYPTION_SECRET
    || process.env.JWT_SECRET
    || ''
);

const deriveKey = () => crypto
    .createHash('sha256')
    .update(getSecret() || 'axiom-dev-fallback-secret')
    .digest()
    .subarray(0, KEY_LENGTH);

export const encryptText = (plainText = '') => {
    if (!plainText) return '';
    const key = deriveKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(String(plainText), 'utf8'),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return `${toBase64Url(iv)}.${toBase64Url(tag)}.${toBase64Url(encrypted)}`;
};

export const decryptText = (token = '') => {
    if (!token) return '';
    const [ivRaw, tagRaw, encRaw] = String(token).split('.');
    if (!ivRaw || !tagRaw || !encRaw) return '';
    const key = deriveKey();
    const iv = fromBase64Url(ivRaw);
    const authTag = fromBase64Url(tagRaw);
    const encrypted = fromBase64Url(encRaw);
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
};

export default {
    encryptText,
    decryptText,
};
