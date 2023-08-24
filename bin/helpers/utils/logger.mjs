'use strict'

import winston from 'winston'

// Import the printf function from Winston's format module.
const { printf } = winston.format
// Create and configure a logger using Winston.
export default winston.createLogger({
    // Define the log message format, including the log level (uppercase) and the log message itself.
    format: printf(({ level, message }) => `${level.toUpperCase()} ${message}`),
    // Configure the logger to output logs to the console.
    transports: [new winston.transports.Console()]
})
