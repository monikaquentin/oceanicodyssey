'use strict'

import moment from 'moment'

import { lambda_handler } from '../../functions/tc-sign/index.mjs'

import { describe, it } from 'mocha'
import { expect } from 'chai'
import { sha256_hash, hex } from '../../functions/tc-sign/helpers/common.config.mjs'

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
    it('verifies successful response', async () => {
        const payload = JSON.parse(event.body)
        const result = await lambda_handler(event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(201)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            meta_data: {
                status: 200,
                request_id: response.meta_data.request_id,
                attempts: 1,
                delay: 0
            },
            signing_algorithm: 'ECDSA_SHA_256',
            signature: response.signature,
            issued_to: sha256_hash(payload.applicant).toString('hex'),
            keyspec: payload.keyspec,
            digest: sha256_hash(payload.message).toString('hex'),
            created_at: moment(response.created_at).format(),
            expired_at: moment(response.expired_at).format()
        }

        expect(response).to.be.an('object')
        expect(response).to.deep.equal(expected_response)
        expect(response).to.include.keys(Object.keys(expected_response))
    })

    it('should return errors for duplicate digests', async () => {
        const fixed_message = hex(32)
        event.body = JSON.stringify({
            message: fixed_message,
            keyspec: 'prime256v1',
            applicant: 're@redvelvet.me',
            exp: 1
        })
        await lambda_handler(event, context)
        const result = await lambda_handler(event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(409)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            message: 'Message already exists, issued and signed. Extend expiration instead of creating a new issue',
            data: [
                {
                    issued_id: response.data[0].issued_id,
                    keyspec: 'prime256v1',
                    expired_at: moment(response.data[0].expired_at).format()
                }
            ]
        }

        expect(response).to.be.an('object')
        expect(response).to.deep.equal(expected_response)
        expect(response).to.include.keys(Object.keys(expected_response))
    })
})
