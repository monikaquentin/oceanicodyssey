'use strict'

// Define custom error classes for various HTTP error codes.

/**
 * Represents a Bad Request error (HTTP 400).
 */
class BadRequestError {
    constructor(param = 'Bad Request') {
        this.message = param.message || param
        this.data = param.data
    }
}

/**
 * Represents a Common Error that extends the built-in Error class.
 */
class CommonError extends Error {
    constructor(message) {
        super(message)
    }
}

/**
 * Represents a Conflict error (HTTP 409).
 */
class ConflictError {
    constructor(param = 'Conflict') {
        this.message = param.message || param
        this.data = param.data
    }
}

/**
 * Represents an Expectation Failed error (HTTP 417).
 */
class ExpectationFailedError {
    constructor(param = 'Expectation Failed') {
        this.message = param.message || param
        this.data = param.data
    }
}

/**
 * Represents a Forbidden error (HTTP 403).
 */
class ForbiddenError {
    constructor(param = 'Forbidden') {
        this.message = param.message || param
        this.data = param.data
    }
}

/**
 * Represents a Gateway Timeout error (HTTP 504).
 */
class GatewayTimeoutError {
    constructor(param = 'Gateway Timeout') {
        this.message = param.message || param
        this.data = param.data
    }
}

/**
 * Represents an Internal Server Error (HTTP 500).
 */
class InternalServerError {
    constructor(param = 'Internal Server Error') {
        this.message = param.message || param
        this.data = param.data
    }
}

/**
 * Represents a Not Found error (HTTP 404).
 */
class NotFoundError {
    constructor(param = 'Not Found') {
        this.message = param.message || param
        this.data = param.data
    }
}

/**
 * Represents a Service Unavailable error (HTTP 503).
 */
class ServiceUnavailableError {
    constructor(param = 'Service Unavailable') {
        this.message = param.message || param
        this.data = param.data
    }
}

/**
 * Represents an Unauthorized error (HTTP 401).
 */
class UnauthorizedError {
    constructor(param = 'Unauthorized') {
        this.message = param.message || param
        this.data = param.data
    }
}

// Define HTTP error and success codes as constants.

/**
 * HTTP error codes and their corresponding status codes.
 */
const http_error = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
    EXPECTATION_FAILED: 417,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
}

/**
 * HTTP success codes and their corresponding status codes.
 */
const http_success = {
    OK: 200,
    CREATED: 201
}

export {
    BadRequestError,
    CommonError,
    ConflictError,
    ExpectationFailedError,
    ForbiddenError,
    GatewayTimeoutError,
    InternalServerError,
    NotFoundError,
    ServiceUnavailableError,
    UnauthorizedError,
    http_error,
    http_success
}
