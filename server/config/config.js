import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();

/**
 * Centralized configuration with environment variable validation
 */
const config = {
    // Environment
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production',

    // Server
    port: parseInt(process.env.PORT, 10) || 3000,

    // Database
    database: {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    },

    // Cloudinary
    cloudinary: {
        cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.VITE_CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },

    // CORS Origins
    cors: {
        origins: [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://axiomdev.vercel.app',
            'https://axiom-client.vercel.app'
        ],
        credentials: true
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    },

    // Pagination defaults
    pagination: {
        defaultLimit: 20,
        maxLimit: 100
    }
};

/**
 * Validate required configuration
 */
const validateConfig = () => {
    const required = [
        'DATABASE_URL'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(key => console.error(`   - ${key}`));

        if (config.isProduction) {
            process.exit(1);
        } else {
            console.warn('⚠️  Running in development mode with missing config');
        }
    }
};

validateConfig();

export default config;
