/* const {createLogger, format, transports} = require('winston');



module.exports = createLogger({
    format: format.combine(format.simple(), 
        format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`),
        format.colorize(),
        format.json(),
    ),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/log-api.log`
        }),
        new transports.Console({
            level: 'debug'
        })
    ]
})
 */


var winston = require('winston');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: `${__dirname}/../logs/log-api.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
