'use strict'

import fs from 'fs'
import confidence from 'confidence'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Parse the environment variables from the .env.json file.
const env = JSON.parse(fs.readFileSync(path.join(__dirname, '../../env.json'), 'utf-8'))
// Define the configuration object using Confidence.
const config = {
    aws: {
        // AWS account ID.
        account_id: env.AWS_ACCOUNT_ID,
        // AWS access key ID.
        access_key_id: env.AWS_ACCESS_KEY_ID,
        // AWS secret access key.
        secret_access_key: env.AWS_SECRET_ACCESS_KEY,
        // Default AWS region.
        default_region: env.AWS_DEFAULT_REGION,
        kms: {
            // AWS KMS RSA 4096-bit key.
            rsa4096: env.AWS_KMS_RSA_4096,
            // AWS KMS ECDSA SECG P-256K1 key.
            secp256k1: env.AWS_KMS_ECC_SECG_P256K1,
            // AWS KMS ECDSA NIST P-256 key.
            prime256v1: env.AWS_KMS_ECC_NIST_P256
        }
    },
    database: {
        // MongoDB database URI.
        uri: env.MONGO_DATABASE_URI
    }
}

// Create a Confidence store with the configuration.
const store = new confidence.Store(config)
// Define a function to get values from the Confidence store.
const get = (key) => store.get(key)

export { get }
