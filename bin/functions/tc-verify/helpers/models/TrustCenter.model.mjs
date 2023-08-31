'use strict'

import mongoose from 'mongoose'

// Define the Mongoose schema for the TrustCenter model.
const TrustCenterSchema = mongoose.Schema(
    {
        issued_id: {
            type: String,
            required: true,
            unique: true
        },
        issued_to: {
            type: String,
            required: true
        },
        extended_issued_id: {
            type: String,
            default: null
        },
        cf_id: {
            type: String,
            default: null
        },
        attempts: {
            type: Number
        },
        signing_algorithm: {
            type: String,
            required: true
        },
        keyspec: {
            type: String,
            required: true
        },
        signature: {
            type: String,
            required: true
        },
        digest: {
            type: String,
            required: true
        },
        created_at: {
            type: String,
            required: true
        },
        updated_at: {
            type: String,
            default: '0000-00-00T00:00:00+00:00'
        },
        expired_at: {
            type: String,
            required: true,
            default: '0000-00-00T00:00:00+00:00'
        }
    },
    { versionKey: false }
)

// Export the Mongoose model named 'TrustCenter' with the defined schema.
export default mongoose.model('TrustCenter', TrustCenterSchema)
