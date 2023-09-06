'use strict'

import moment from 'moment'

import { lambda_handler } from '../../functions/tc-verify/index.mjs'
// import { lambda_handler as asymmetric_sign } from '../../functions/tc-sign/index.mjs'

import { describe, it } from 'mocha'
import { expect } from 'chai'
import { sha256_hash, hex } from '../../functions/tc-sign/helpers/common.config.mjs'

const sign_event = {
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
const verify_event = {
    body: JSON.stringify({
        issued_id: 'ea5070d6-9df2-456e-8611-395639a142ec'
    }),
    requestContext: {
        identity: {
            sourceIp: '127.0.0.1'
        }
    }
}
const context = {}

describe('Verify::Function', () => {
    it('verifies successful response', async () => {
        const result = await lambda_handler(verify_event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(200)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            meta_data: {
                status: '',
                request_id: '',
                attempts: '',
                delay: ''
            },
            issued_id: '',
            issued_to: '',
            keyspec: '',
            signing_algorithm: '',
            signature: '',
            digest: '',
            signature_valid: '',
            conditions: {
                legitimate: '',
                active: ''
            },
            created_at: '',
            updated_at: '',
            expired_at: ''
        }

        expect(response).to.be.an('object')
        expect(response).to.include.keys(Object.keys(expected_response))
    })
})
