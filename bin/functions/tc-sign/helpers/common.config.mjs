'use strict'

import crypto from 'crypto'

/**
 *
 * Generate a SHA-256 hash of the given payload.
 * @param {Buffer} payload - The payload to be hashed.
 * @returns {Buffer} - The SHA-256 hash of the payload.
 *
 */
function sha256_hash(payload) {
    return crypto.createHash('sha256').update(payload).digest()
}

/**
 *
 * Convert a hexadecimal or base64 string to a byte array (Uint8Array).
 * @param {string} payload - The input string to be converted.
 * @returns {Uint8Array} - The byte array representation of the input.
 * @throws {string} - Throws an error message if the input format is invalid.
 *
 */
function hexb64to_bytes(payload) {
    const error_message = ['Valid signatures are of type byte, hex, or base64 only. So please adjust.']

    if (payload instanceof Uint8Array) {
        return payload
    } else if (typeof payload === 'string') {
        try {
            // Check if the input is in hex format
            if (payload.length % 2 === 0 && /^[0-9A-Fa-f]+$/.test(payload)) {
                return Buffer.from(payload, 'hex')
            }
            // Check if the input is in base64 format
            else {
                return new Uint8Array(Buffer.from(payload, 'base64'))
            }
        } catch (error) {
            // Throw the error object
            throw error_message[0]
        }
    } else {
        // Throw the error object
        throw error_message[0]
    }
}

/**
 *
 * Validate a UUIDv4 formatted string.
 * @param {string} payload - The input string to be validated.
 * @returns {boolean} - True if the input is a valid UUIDv4, otherwise false.
 *
 */
function validate_uuidv4(payload) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload)
}

export { sha256_hash, hexb64to_bytes, validate_uuidv4 }
