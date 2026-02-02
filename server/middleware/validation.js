/**
 * Request Validation Middleware
 * Provides simple schema validation for API requests
 */

/**
 * Creates a validation middleware for the given schema
 * @param {Object} schema - Validation schema
 * @returns {Function} Express middleware
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const errors = [];
        const source = schema.body ? req.body :
            schema.params ? req.params :
                schema.query ? req.query : {};
        const rules = schema.body || schema.params || schema.query || {};

        for (const [field, rule] of Object.entries(rules)) {
            const value = source[field];

            // Required check
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} is required`);
                continue;
            }

            // Skip optional empty fields
            if (!rule.required && (value === undefined || value === null)) {
                continue;
            }

            // Type check
            if (rule.type) {
                const actualType = Array.isArray(value) ? 'array' : typeof value;
                if (actualType !== rule.type) {
                    errors.push(`${field} must be of type ${rule.type}`);
                }
            }

            // Min length
            if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
                errors.push(`${field} must be at least ${rule.minLength} characters`);
            }

            // Max length  
            if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
                errors.push(`${field} must be at most ${rule.maxLength} characters`);
            }

            // Email validation
            if (rule.email && typeof value === 'string') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors.push(`${field} must be a valid email`);
                }
            }

            // Enum validation
            if (rule.enum && !rule.enum.includes(value)) {
                errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
            }

            // Min value (for numbers)
            if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
                errors.push(`${field} must be at least ${rule.min}`);
            }

            // Max value (for numbers)
            if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
                errors.push(`${field} must be at most ${rule.max}`);
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors
            });
        }

        next();
    };
};

/**
 * Sanitize string input to prevent XSS
 * @param {string} str - Input string
 * @returns {string} Sanitized string
 */
export const sanitize = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Sanitize request body middleware
 */
export const sanitizeBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        for (const key of Object.keys(req.body)) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitize(req.body[key]);
            }
        }
    }
    next();
};

// Common validation schemas
export const schemas = {
    email: {
        params: {
            email: { required: true, type: 'string', email: true }
        }
    },

    problemToggle: {
        body: {
            email: { required: true, type: 'string', email: true },
            problemId: { required: true, type: 'string' }
        }
    },

    jobSave: {
        body: {
            email: { required: true, type: 'string', email: true },
            jobId: { required: true, type: 'number' }
        }
    },

    chatMessage: {
        body: {
            email: { required: true, type: 'string', email: true },
            channelId: { required: true, type: 'string' },
            content: { required: true, type: 'string', minLength: 1, maxLength: 2000 }
        }
    },

    postVote: {
        body: {
            email: { required: true, type: 'string', email: true },
            voteType: { required: true, type: 'string', enum: ['up', 'down', 'none'] }
        }
    }
};

export default { validate, sanitize, sanitizeBody, schemas };
