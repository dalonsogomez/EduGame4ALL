// ============================================
// Error Types
// ============================================
export class ServiceError extends Error {
    constructor(message, statusCode = 500, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'ServiceError';
        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}
export class NotFoundError extends ServiceError {
    constructor(message = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}
export class ValidationError extends ServiceError {
    constructor(message = 'Validation failed') {
        super(message, 400, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}
export class AuthenticationError extends ServiceError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}
export class AuthorizationError extends ServiceError {
    constructor(message = 'Not authorized') {
        super(message, 403, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}
//# sourceMappingURL=index.js.map