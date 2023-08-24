'use strict'

import * as config from '../infra/global.config.mjs'
import * as wrapper from '../utils/wrapper.mjs'

import moment from 'moment'

import db_sync from '../utils/mongo.mjs'
import TCModel from '../models/TrustCenter.model.mjs'

import { ConflictError, InternalServerError } from '../utils/errors.mjs'
import { KMSClient, SignCommand, VerifyCommand } from '@aws-sdk/client-kms'
import { sha256_hash, hexb64to_bytes, validate_uuidv4 } from '../common.config.mjs'

const aws_config = config.get('/aws')

/**
 * The TrustCenter class is responsible for managing asymmetric signature and verification processes.
 */
export default class TrustCenter {
    constructor(event) {
        // Constructor for the TrustCenter class
        // Initializes various properties used within this class.
        this.event = event
        this.caller = this.event.requestContext.identity.sourceIp
        this.time = this.event.requestContext.timeEpoch
        this.kms = new KMSClient({ region: aws_config.default_region })
        this.arn = {
            prime256v1: aws_config.kms.prime256v1,
            secp256k1: aws_config.kms.secp256k1
        }
        this.sign_key = ['prime256v1', 'secp256k1']
        this.message_type = 'DIGEST'
        this.signing_algorithms = 'ECDSA_SHA_256'

        db_sync()
    }

    /**
     *
     * Function for performing asymmetric signature on the provided payload.
     * @param {Object} payload - The data payload to be signed.
     * @returns {Object} The result of asymmetric signature along with metadata.
     *
     */
    async asymmetric_sign(payload) {
        // Implementation of the function for performing asymmetric signature.
        const { message, keyspec, applicant, exp } = payload

        const message_digest = sha256_hash(message).toString('hex')
        const validation_error = await this.sign_layer_validation(keyspec, message_digest)

        if (validation_error) return validation_error
        try {
            const data = await this.kms.send(
                new SignCommand({
                    KeyId: this.arn[keyspec],
                    Message: Buffer.from(message_digest, 'hex'),
                    MessageType: this.message_type,
                    SigningAlgorithm: this.signing_algorithms
                })
            )
            const created_at = moment(this.event.requestContext.timeEpoch)
            const payload = {
                meta_data: this.extract_meta_data(data),
                signing_algorithm: data.SigningAlgorithm,
                signature: Buffer.from(data.Signature).toString('base64'),
                issued_to: sha256_hash(applicant).toString('hex'),
                keyspec,
                digest: message_digest,
                created_at: created_at.format(),
                expired_at: parseInt(exp) !== 0 ? created_at.clone().add(parseInt(exp), 'days').format() : undefined
            }
            await TCModel.create(this.extract_issue_data(payload))
            return wrapper.data(payload)
        } catch (error) {
            // Handle errors from KMS or TCModel
            return wrapper.error(new InternalServerError({ message: error.message }))
        }
    }

    /**
     *
     * Function for performing asymmetric signature verification on the provided payload.
     * @param {Object} payload - The data payload to be verified.
     * @returns {Object} The result of asymmetric signature verification along with metadata.
     *
     */
    async asymmetric_verify(payload) {
        // Implementation of the function for performing asymmetric signature verification.
        const { issued_id } = payload
        const { validation_error, issues_exist_data } = await this.verify_layer_validation(issued_id)

        if (validation_error) return validation_error
        try {
            const { issued_to, keyspec, digest, signature, signing_algorithm, created_at, updated_at, expired_at } = issues_exist_data
            const data = await this.kms.send(
                new VerifyCommand({
                    KeyId: this.arn[keyspec],
                    Message: hexb64to_bytes(digest),
                    MessageType: this.message_type,
                    Signature: hexb64to_bytes(signature),
                    SigningAlgorithm: signing_algorithm
                })
            )
            const isExpired =
                expired_at !== '0000-00-00T00:00:00+00:00'
                    ? moment(expired_at).isAfter(moment(this.event.requestContext.timeEpoch))
                    : true

            const signatureValid = data.SignatureValid && isExpired
            const payload = {
                meta_data: this.extract_meta_data(data),
                issued_id,
                issued_to,
                keyspec,
                signing_algorithm,
                signature,
                digest,
                signature_valid: signatureValid,
                conditions: { legitimate: data.SignatureValid, active: isExpired },
                created_at,
                updated_at,
                expired_at
            }
            return wrapper.data(payload)
        } catch (error) {
            // Handle errors from KMS
            return wrapper.error(new InternalServerError({ message: error.message }))
        }
    }

    /**
     *
     * Function for extracting metadata from the AWS SDK response.
     * @param {Object} payload - The response from the AWS SDK.
     * @returns {Object} Metadata from the AWS SDK response.
     *
     */
    extract_meta_data(payload) {
        // Implementation of the function for extracting metadata from the AWS SDK response.
        const meta = payload.$metadata
        return {
            status: meta.httpStatusCode,
            request_id: meta.requestId,
            extended_request_id: meta.extendedRequestId,
            cf_id: meta.cfId,
            attempts: meta.attempts,
            delay: meta.totalRetryDelay
        }
    }

    /**
     *
     * Function for extracting issue data from the payload to be stored in the database.
     * @param {Object} payload - The data payload resulting from signature or verification.
     * @returns {Object} Issue data to be stored in the database.
     *
     */
    extract_issue_data(payload) {
        // Implementation of the function for extracting issue data from the payload.
        const meta = payload.meta_data
        return {
            issued_id: meta.request_id,
            issued_to: payload.issued_to,
            extended_issued_id: meta.extended_request_id,
            cf_id: meta.cf_id,
            attempts: meta.attempts,
            signing_algorithm: payload.signing_algorithm,
            keyspec: payload.keyspec,
            signature: payload.signature,
            digest: payload.digest,
            created_at: payload.created_at,
            expired_at: payload.expired_at
        }
    }

    /**
     *
     * Function for validating the signature layer before performing asymmetric signature.
     * @param {string} keyspec - The key specification to be used.
     * @param {string} message_digest - The message digest to be signed.
     * @returns {null|Object} - Error object if validation fails, otherwise, null.
     *
     */
    async sign_layer_validation(keyspec, message_digest) {
        // Implementation of the function for signature layer validation.
        let error_message, issues_exist_data
        const issues_exist = await TCModel.find({ digest: { $regex: message_digest, $options: 'i' } })

        if ((issues_exist[0] && keyspec === issues_exist[0].keyspec) || issues_exist.length >= this.sign_key.length) {
            error_message = 'Message already exists, issued and signed. Extend expiration instead of creating a new issue'
            issues_exist_data = issues_exist.map((data) => {
                return { issued_id: data.issued_id, keyspec: data.keyspec, expired_at: data.expired_at }
            })
        }
        if (error_message) {
            return wrapper.error(new ConflictError({ message: error_message, data: issues_exist_data }))
        }
        return null
    }

    /**
     *
     * Function for validating the verification layer before performing asymmetric signature verification.
     * @param {string} issued_id - The ID of the issue to be verified.
     * @returns {Object} - Result of validation at the verification layer.
     *
     */
    async verify_layer_validation(issued_id) {
        // Implementation of the function for verification layer validation.
        let validation_error, error_message, issues_exist_data

        try {
            if (!issued_id || !validate_uuidv4(issued_id)) {
                error_message = 'Sorry, Issued_id is required and must be in UUIDv4 format'
                return { validation_error: wrapper.error(new ConflictError({ message: error_message })) }
            }

            issues_exist_data = await TCModel.findOne({ issued_id })

            if (!issues_exist_data) {
                error_message = "Issue doesn't exist."
                return { validation_error: wrapper.error(new ConflictError({ message: error_message })) }
            }

            return { validation_error, error_message, issues_exist_data }
        } catch (error) {
            return { validation_error: wrapper.error(new InternalServerError({ message: error.message })) }
        }
    }
}
