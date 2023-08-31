'use strict'

import * as sign_validation from './validation.mjs'
import * as wrapper from './helpers/utils/wrapper.mjs'

import moment from 'moment'

import log from './helpers/utils/logger.mjs'
import TrustCenter from './helpers/classes/TrustCenter.mjs'
import is_valid_payload from './helpers/utils/validator.mjs'

import { InternalServerError, http_success, http_error } from './helpers/utils/errors.mjs'

/**
 *
 * This Lambda function serves as the entry point for the TrustCenter signing process.
 * It handles incoming events, logs information, validates the payload, signs it, and returns a response.
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export async function lambda_handler(event, context) {
    // Set the context for this Lambda function.
    event.ctx = 'TrustCenter::sign'
    // Extract the caller's IP address and request timestamp.
    event.caller = event.requestContext.identity.sourceIp
    event.time = event.requestContext.timeEpoch

    // Log the start of the Lambda function execution.
    log.info(`${event.ctx} Called by ${event.caller} on ${moment(event.time)}`)

    // Create an instance of the TrustCenter service.
    const service = new TrustCenter(event.time)
    try {
        // Parse the JSON body of the event.
        const body = JSON.parse(event.body)
        // Validate the payload against the sign_validation rules.
        const valid_payload = is_valid_payload(body, sign_validation.payload)
        // Define a function to handle the post request.
        const post_request = async (payload) => {
            if (payload.error) return payload
            return await service.asymmetric_sign(payload.data)
        }
        // Define a function to send the response.
        const send_response = (service) => {
            const error = service.error
            if (error) {
                // Log an error and return an HTTP error response.
                log.error(`[${event.caller}] ${error.message}`)
                return {
                    statusCode: wrapper.check_error_code(error),
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(error)
                }
            } else {
                // Log a successful execution and return an HTTP success response.
                log.info(`${event.ctx} Called successfully`)
                return {
                    statusCode: http_success.CREATED,
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(service.data)
                }
            }
        }
        // Return the response by sending the valid payload to the post_request function and then to send_response.
        return send_response(await post_request(valid_payload))
    } catch (error) {
        // Log an error if an exception occurs during the execution.
        log.error(`[${event.caller}] ${error.message}`)
        // Return an HTTP 500 Internal Server Error response with an error message.
        return {
            statusCode: http_error.INTERNAL_SERVER_ERROR,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(wrapper.error(new InternalServerError({ message: error.message })))
        }
    }
}
