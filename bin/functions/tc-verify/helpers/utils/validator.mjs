'use strict'

import * as wrapper from './wrapper.mjs'

import { ConflictError } from './errors.mjs'

/**
 *
 * Validate a payload against a given constraint using Joi and return a wrapped result.
 * @param {object} payload - The payload to be validated.
 * @param {Joi.Schema} constraint - The Joi schema constraint to validate against.
 * @returns {object} - A wrapped result containing either the validated payload or an error message.
 *
 */
const is_valid_payload = (payload, constraint) => {
    const message = {}
    // Check if the payload is empty and return an error if so.
    if (!payload) return wrapper.error(new ConflictError({ message: 'payload is empty' }))
    // Define validation options for Joi.
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    }
    // Validate the payload against the given constraint.
    const { value, error } = constraint.validate(payload, options)
    // If validation results in an error, collect and format error messages.
    if (error) {
        error.details.forEach((detail) => (message[`${detail.path}`] = detail.message))
        return wrapper.error(new ConflictError({ message }))
    }
    // If validation is successful, return the validated payload.
    return wrapper.data(value)
}

export default is_valid_payload
