'use strict'

import { lambda_handler } from '../../functions/tc-verify/index.mjs'

import { describe, it } from 'mocha'
import { v4 as uuidv4 } from 'uuid'
import { expect } from 'chai'

const event = {
    body: JSON.stringify({
        issued_id: null
    }),
    requestContext: {
        identity: {
            sourceIp: '127.0.0.1'
        }
    }
}
const context = {}

describe('Verify::Function', () => {
    it('should return an error for the issued_id not existing', async () => {
        event.body = JSON.stringify({ issued_id: uuidv4() })
        const result = await lambda_handler(event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(409)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            message: "Issue doesn't exist"
        }

        expect(response).to.be.an('object')
        expect(response).to.deep.equal(expected_response)
        expect(response).to.include.keys(Object.keys(expected_response))
    })

    it('should return an error for invalid issued_id', async () => {
        event.body = JSON.stringify({ issued_id: 'invalid-issued_id' })
        const result = await lambda_handler(event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(409)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            message: {
                issued_id: 'Issued ID must be a valid UUIDv4.'
            }
        }

        expect(response).to.be.an('object')
        expect(response).to.deep.equal(expected_response)
        expect(response).to.include.keys(Object.keys(expected_response))
    })

    it('should return an error for required issued_id', async () => {
        event.body = JSON.stringify({})
        const result = await lambda_handler(event, context)

        expect(result).to.be.an('object')
        expect(result.statusCode).to.equal(409)
        expect(result.body).to.be.an('string')

        const response = JSON.parse(result.body)
        const expected_response = {
            message: {
                issued_id: 'Issued ID is required.'
            }
        }

        expect(response).to.be.an('object')
        expect(response).to.deep.equal(expected_response)
        expect(response).to.include.keys(Object.keys(expected_response))
    })
})
