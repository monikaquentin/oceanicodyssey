'use strict'

import joi from 'joi'

// Define a validation schema using Joi for the payload object.
const payload = joi.object({
    message: joi.string().required().messages({
        'string.base': 'Message must be a string.',
        'any.required': 'Message is required.'
    }),
    keyspec: joi.string().required().valid('secp256k1', 'prime256v1').messages({
        'string.base': 'Keyspec must be a string.',
        'any.required': 'Keyspec is required.',
        'any.only': 'Keyspec must be one of secp256k1 or prime256v1.'
    }),
    applicant: joi.string().email().required().messages({
        'string.base': 'Applicant must be a string.',
        'string.email': 'Applicant must be a valid email address.',
        'any.required': 'Applicant is required.'
    }),
    exp: joi.number().integer().min(1).required().messages({
        'number.base': 'Exp must be a number.',
        'number.integer': 'Exp must be an integer.',
        'number.min': 'Exp must be greater than or equal to 1.',
        'any.required': 'Exp is required.'
    })
})

export { payload }
