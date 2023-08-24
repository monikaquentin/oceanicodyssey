'use strict'

import * as config from '/opt/infra/global.config.mjs'

import mongoose from 'mongoose'

// Get the database configuration from the global configuration.
const database_config = config.get('/database')

/**
 *
 * Synchronize with the MongoDB database using Mongoose.
 * This function connects to the database using the provided configuration.
 * @returns {string|undefined} - An error message if the connection fails, or undefined if successful.
 *
 */
export default function db_sync() {
    // Define connection options for Mongoose.
    const options = {
        maxPoolSize: 100,
        socketTimeoutMS: 15000,
        wtimeoutMS: 15000,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        // Attempt to connect to the MongoDB database using Mongoose.
        mongoose.set('strictQuery', true).connect(`${database_config.uri}`, options)
    } catch (error) {
        // If an error occurs during the connection attempt, return an error message.
        return error.message
    }
}
