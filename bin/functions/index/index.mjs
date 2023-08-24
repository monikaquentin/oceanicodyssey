'use strict'

import * as wrapper from '/opt/utils/wrapper.mjs'

import log from '/opt/utils/logger.mjs'
import moment from '/opt/node_modules/moment/moment.js'

import { InternalServerError, http_success, http_error } from '/opt/utils/errors.mjs'

/**
 *
 * This Lambda function serves as the entry point for the TrustCenter module.
 * It handles incoming events, logs information, and returns an appropriate response.
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
    event.ctx = 'TrustCenter::index'
    // Extract the caller's IP address and request timestamp.
    event.caller = event.requestContext.identity.sourceIp
    event.time = event.requestContext.timeEpoch

    // Log the start of the Lambda function execution.
    log.info(`${event.ctx} Called by ${event.caller} on ${moment(event.time)}`)
    try {
        // Log a successful execution.
        log.info(`${event.ctx} Called successfully`)
        // Return an HTTP 200 OK response with a success message.
        return {
            statusCode: http_success.OK,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(wrapper.data({ message: '200 OK', event, context }).data)
        }
    } catch (error) {
        // Log an error if an exception occurs.
        log.error(`[${event.caller}] ${error.message}`)
        // Return an HTTP 500 Internal Server Error response with an error message.
        return {
            statusCode: http_error.INTERNAL_SERVER_ERROR,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(wrapper.error(new InternalServerError(error.message)))
        }
    }
}
