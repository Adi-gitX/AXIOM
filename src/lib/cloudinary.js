const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    try {
        // 1. Get Signature from Backend
        const sigResponse = await fetch('http://localhost:3000/api/sign-cloudinary');
        if (!sigResponse.ok) throw new Error('Failed to get upload signature');
        const { signature, timestamp } = await sigResponse.json();

        // 2. Upload to Cloudinary using Signature
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', API_KEY);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('upload_preset', 'profile');
        // Remove upload_preset, we are using signed upload now

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Cloudinary Upload Error:', errorData);
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};
