'use strict'

import {
    NotFoundError,
    InternalServerError,
    BadRequestError,
    ConflictError,
    ExpectationFailedError,
    ForbiddenError,
    GatewayTimeoutError,
    ServiceUnavailableError,
    UnauthorizedError,
    http_error
} from './errors.mjs'

/**
 *
 * Create a data object with the provided data.
 * @param {object} data - The data to be included in the response.
 * @returns {object} - A data object with the provided data.
 *
 */
const data = (data) => ({ error: undefined, data })

/**
 *
 * Create an error object with the provided error.
 * @param {object} error - The error to be included in the response.
 * @returns {object} - An error object with the provided error.
 *
 */
const error = (error) => ({ error, data: undefined })

/**
 *
 * Determine the HTTP error code based on the error object's constructor.
 * @param {object} error - The error object.
 * @returns {number} - The corresponding HTTP error code.
 *
 */
const check_error_code = (error) => {
    switch (error.constructor) {
        case BadRequestError:
            return http_error.BAD_REQUEST
        case ConflictError:
            return http_error.CONFLICT
        case ExpectationFailedError:
            return http_error.EXPECTATION_FAILED
        case ForbiddenError:
            return http_error.FORBIDDEN
        case GatewayTimeoutError:
            return http_error.GATEWAY_TIMEOUT
        case InternalServerError:
            return http_error.INTERNAL_ERROR
        case NotFoundError:
            return http_error.NOT_FOUND
        case ServiceUnavailableError:
            return http_error.SERVICE_UNAVAILABLE
        case UnauthorizedError:
            return http_error.UNAUTHORIZED
        default:
            return http_error.CONFLICT
    }
}

export { data, error, check_error_code }
