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
        const sourceSchemas = [
            ['params', req.params, schema.params || {}],
            ['query', req.query, schema.query || {}],
            ['body', req.body, schema.body || {}],
        ];

        const isTypeMatch = (value, expectedType) => {
            if (expectedType === 'number') {
                if (typeof value === 'number') return Number.isFinite(value);
                if (typeof value === 'string' && value.trim() !== '') return Number.isFinite(Number(value));
                return false;
            }
            if (expectedType === 'boolean') {
                if (typeof value === 'boolean') return true;
                if (value === 0 || value === 1) return true;
                if (typeof value === 'string') {
                    return ['true', 'false', '0', '1'].includes(value.toLowerCase());
                }
                return false;
            }
            if (expectedType === 'array') return Array.isArray(value);
            return typeof value === expectedType;
        };

        for (const [sourceName, source, rules] of sourceSchemas) {
            if (!rules || Object.keys(rules).length === 0) continue;

            for (const [field, rule] of Object.entries(rules)) {
                const value = source?.[field];
                const fieldName = `${sourceName}.${field}`;

                // Required check
                if (rule.required && (value === undefined || value === null || value === '')) {
                    errors.push(`${fieldName} is required`);
                    continue;
                }

                // Skip optional empty fields
                if (!rule.required && (value === undefined || value === null)) {
                    continue;
                }

                // Type check
                if (rule.type && !isTypeMatch(value, rule.type)) {
                    errors.push(`${fieldName} must be of type ${rule.type}`);
                    continue;
                }

                // Min length
                if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
                    errors.push(`${fieldName} must be at least ${rule.minLength} characters`);
                }

                // Max length
                if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
                    errors.push(`${fieldName} must be at most ${rule.maxLength} characters`);
                }

                // Email validation
                if (rule.email && typeof value === 'string') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errors.push(`${fieldName} must be a valid email`);
                    }
                }

                // Enum validation
                if (rule.enum && !rule.enum.includes(value)) {
                    errors.push(`${fieldName} must be one of: ${rule.enum.join(', ')}`);
                }

                const numericValue = typeof value === 'number' ? value : Number(value);
                if (rule.min !== undefined && Number.isFinite(numericValue) && numericValue < rule.min) {
                    errors.push(`${fieldName} must be at least ${rule.min}`);
                }
                if (rule.max !== undefined && Number.isFinite(numericValue) && numericValue > rule.max) {
                    errors.push(`${fieldName} must be at most ${rule.max}`);
                }
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
        .replace(/'/g, '&#x27;');
};

/**
 * Sanitize request body middleware
 */
export const sanitizeBody = (req, res, next) => {
    const sanitizeValue = (value) => {
        if (typeof value === 'string') return sanitize(value);
        if (Array.isArray(value)) return value.map(sanitizeValue);
        if (value && typeof value === 'object') {
            const clean = {};
            for (const [key, nestedValue] of Object.entries(value)) {
                clean[key] = sanitizeValue(nestedValue);
            }
            return clean;
        }
        return value;
    };

    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeValue(req.body);
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
            problemId: { required: true, type: 'string' },
            tz: { required: false, type: 'string' }
        }
    },

    jobSave: {
        body: {
            email: { required: true, type: 'string', email: true },
            jobId: { required: true, type: 'number' }
        }
    },

    jobApply: {
        body: {
            email: { required: true, type: 'string', email: true },
            jobId: { required: true, type: 'number' },
            notes: { required: false, type: 'string', maxLength: 3000 }
        }
    },

    jobUnsave: {
        params: {
            jobId: { required: true, type: 'number' },
        },
        body: {
            email: { required: false, type: 'string', email: true },
        },
        query: {
            email: { required: false, type: 'string', email: true },
        }
    },

    chatMessage: {
        body: {
            email: { required: true, type: 'string', email: true },
            channelId: { required: true, type: 'string' },
            content: { required: true, type: 'string', minLength: 1, maxLength: 2000 }
        }
    },

    chatDeleteMessage: {
        params: {
            id: { required: true, type: 'number' },
        },
        body: {
            email: { required: false, type: 'string', email: true },
        },
        query: {
            email: { required: false, type: 'string', email: true },
        }
    },

    postVote: {
        body: {
            email: { required: true, type: 'string', email: true },
            voteType: { required: true, type: 'string', enum: ['up', 'down', 'none'] }
        }
    },

    postCreate: {
        body: {
            email: { required: true, type: 'string', email: true },
            title: { required: true, type: 'string', minLength: 1, maxLength: 300 },
            content: { required: false, type: 'string', maxLength: 10000 }
        }
    },

    channelCreate: {
        body: {
            name: { required: true, type: 'string', minLength: 1, maxLength: 100 },
            description: { required: false, type: 'string', maxLength: 500 }
        }
    },

    interviewComplete: {
        body: {
            email: { required: true, type: 'string', email: true },
            completed: { required: false, type: 'boolean' },
            notes: { required: false, type: 'string', maxLength: 2000 }
        }
    }
};

export default { validate, sanitize, sanitizeBody, schemas };
