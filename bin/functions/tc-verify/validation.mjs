'use strict'

import joi from '/opt/node_modules/joi/lib/index.js'

// Define a validation schema using Joi for the payload object.
const payload = joi.object({
    issued_id: joi.string().guid({ version: 'uuidv4' }).required().messages({
        'string.base': 'Issued ID must be a string.',
        'string.guid': 'Issued ID must be a valid UUIDv4.',
        'any.required': 'Issued ID is required.'
    })
})

export { payload }
