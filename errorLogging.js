const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
const { transports, format, transport } = require('winston');

module.exports = function() {
    winston.configure({
        format: winston.format.combine(
            format.timestamp(),
            format.json()
        ),
        transports: [
            new winston.transports.File({filename: 'logfile.log'}),
            new winston.transports.Console({format: winston.format.simple()}),
            new winston.transports.MongoDB({ 
                db: process.env.MONGODB_URI,
                level: 'error' 
            })
        ],
        exceptionHandlers: [
            new winston.transports.File({ filename: 'uncaughtExceptions.log' })
        ],
        rejectionHandlers: [
            new winston.transports.File({ filename: 'uncaughtExceptions.log'})
        ]});
};