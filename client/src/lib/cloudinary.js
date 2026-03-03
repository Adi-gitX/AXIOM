import { getApiUrl } from './api';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'profile';

const isPlaceholderValue = (value) => {
    if (!value) return true;
    const normalized = String(value).trim().toLowerCase();
    if (!normalized) return true;
    return (
        normalized.startsWith('your_') ||
        normalized.includes('your_cloud_name') ||
        normalized.includes('your_api_key') ||
        normalized.includes('your_api_secret') ||
        normalized.includes('placeholder')
    );
};

const getErrorMessage = async (response) => {
    const errorData = await response.json().catch(() => ({}));
    return errorData.error?.message || errorData.message || 'Upload failed';
};

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    try {
        const API_URL = getApiUrl();
        let resolvedCloudName = CLOUD_NAME;

        // Prefer signed upload when backend signature endpoint is available.
        try {
            const sigResponse = await fetch(`${API_URL}/api/sign-cloudinary`);
            if (sigResponse.ok) {
                const sigData = await sigResponse.json();
                const signature = sigData.signature;
                const timestamp = sigData.timestamp;
                const signedPreset = sigData.upload_preset || UPLOAD_PRESET;
                const signedApiKey = API_KEY || sigData.api_key;
                resolvedCloudName = CLOUD_NAME || sigData.cloud_name || resolvedCloudName;
                if (!signature || !timestamp || !signedApiKey) {
                    throw new Error('Invalid signature response');
                }
                if (isPlaceholderValue(resolvedCloudName) || isPlaceholderValue(signedApiKey)) {
                    throw new Error('Cloudinary credentials are placeholder values');
                }
                if (!resolvedCloudName) {
                    throw new Error('Cloudinary cloud name is missing');
                }

                const uploadUrl = `https://api.cloudinary.com/v1_1/${resolvedCloudName}/auto/upload`;

                const signedData = new FormData();
                signedData.append('file', file);
                signedData.append('api_key', signedApiKey);
                signedData.append('timestamp', timestamp);
                signedData.append('signature', signature);
                signedData.append('upload_preset', signedPreset);

                const signedResponse = await fetch(uploadUrl, {
                    method: 'POST',
                    body: signedData,
                });

                if (!signedResponse.ok) {
                    throw new Error(await getErrorMessage(signedResponse));
                }

                const signedResult = await signedResponse.json();
                return signedResult.secure_url;
            }
        } catch (signedErr) {
            console.warn('Signed Cloudinary upload failed, trying unsigned preset:', signedErr.message);
        }

        if (isPlaceholderValue(resolvedCloudName)) {
            throw new Error('Cloudinary cloud name is not configured with a real value.');
        }
        if (!resolvedCloudName) {
            throw new Error('Cloudinary cloud name is missing. Set VITE_CLOUDINARY_CLOUD_NAME.');
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${resolvedCloudName}/auto/upload`;

        // Fallback to unsigned upload preset for environments without signature support.
        const unsignedData = new FormData();
        unsignedData.append('file', file);
        unsignedData.append('upload_preset', UPLOAD_PRESET);

        const unsignedResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: unsignedData,
        });

        if (!unsignedResponse.ok) {
            const message = await getErrorMessage(unsignedResponse);
            if (message.toLowerCase().includes('whitelisted for unsigned uploads')) {
                throw new Error(
                    `Cloudinary preset "${UPLOAD_PRESET}" is not unsigned-enabled. ` +
                    'Enable unsigned uploads for this preset or fix backend signed credentials.'
                );
            }
            throw new Error(message);
        }

        const unsignedResult = await unsignedResponse.json();
        return unsignedResult.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
