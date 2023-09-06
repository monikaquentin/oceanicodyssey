'use strict'

import fs from 'fs'
import confidence from 'confidence'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse the environment variables from the .env file.
const raw_env = fs.readFileSync(path.join(__dirname, '../../.env'), 'utf-8')
const env_variables = {}
const lines = raw_env.split('\n')
const alpha = /^[a-zA-Z]+$/

for (let i = 0; i < lines.length - 1; i++) {
    if (alpha.test(lines[i].substring(0, 1))) {
        const parts = lines[i].split('=')
        env_variables[parts[0].trim()] = parts.slice(1).join('=').trim()
    }
}
// Define the configuration object using Confidence.
const config = {
    aws: {
        // AWS account ID.
        account_id: env_variables.AWS_ACCOUNT_ID,
        // AWS access key ID.
        access_key_id: env_variables.AWS_ACCESS_KEY_ID,
        // AWS secret access key.
        secret_access_key: env_variables.AWS_SECRET_ACCESS_KEY,
        // Default AWS region.
        default_region: env_variables.AWS_DEFAULT_REGION,
        kms: {
            // AWS KMS RSA 4096-bit key.
            rsa4096: env_variables.AWS_KMS_RSA_4096,
            // AWS KMS ECDSA SECG P-256K1 key.
            secp256k1: env_variables.AWS_KMS_ECC_SECG_P256K1,
            // AWS KMS ECDSA NIST P-256 key.
            prime256v1: env_variables.AWS_KMS_ECC_NIST_P256
        }
    },
    database: {
        // MongoDB database URI.
        uri: env_variables.MONGO_DATABASE_URI
    }
}

// Create a Confidence store with the configuration.
const store = new confidence.Store(config)
// Define a function to get values from the Confidence store.
const get = (key) => store.get(key)

export { get }
