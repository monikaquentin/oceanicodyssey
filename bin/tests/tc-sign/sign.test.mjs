'use strict'

import { lambda_handler } from '../../functions/tc-sign/index.mjs'

import { describe, it } from 'mocha'
import { expect } from 'chai'
import { hex } from '../../functions/tc-sign/helpers/common.config.mjs'

const event = {
    body: JSON.stringify({
        message: hex(32),
        keyspec: 'prime256v1',
        applicant: 're@redvelvet.me',
        exp: 1
    }),
    requestContext: {
        identity: {
            sourceIp: '127.0.0.1'
        }
    }
}
const context = {}

describe('Sign::Function', () => {
    it('should return an error for invalid payload', async () => {
        event.body = JSON.stringify({
            message: '',
            keyspec: 'invalid-prime256v1',
            applicant: 're@redvelvet.me-invalid',
            exp: -1
        })
        const result = await lambda_handler(event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(409)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            message: {
                message: '"message" is not allowed to be empty',
                keyspec: 'Keyspec must be one of secp256k1 or prime256v1.',
                applicant: 'Applicant must be a valid email address.',
                exp: 'Exp must be greater than or equal to 1.'
            }
        }

        expect(response).to.be.an('object')
        expect(response).to.deep.equal(expected_response)
        expect(response).to.include.keys(Object.keys(expected_response))
    })

    it('should return an error for an required payload', async () => {
        event.body = JSON.stringify({})
        const result = await lambda_handler(event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(409)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            message: {
                message: 'Message is required.',
                keyspec: 'Keyspec is required.',
                applicant: 'Applicant is required.',
                exp: 'Exp is required.'
            }
        }

        expect(response).to.be.an('object')
        expect(response).to.deep.equal(expected_response)
        expect(response).to.include.keys(Object.keys(expected_response))
    })

    it('should return an error because there is no payload', async () => {
        event.body = null
        const result = await lambda_handler(event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(409)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            message: 'payload is empty'
        }

        expect(response).to.be.an('object')
        expect(response).to.deep.equal(expected_response)
        expect(response).to.include.keys(Object.keys(expected_response))
    })
})
