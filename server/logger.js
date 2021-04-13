const { transports, createLogger, format } = require('winston');
const config = require('./config');

const logger = createLogger({
  level: config.LOG_LEVEL,
  format: format.combine(
    format.splat(),
    format.simple(),
    format.timestamp(),
    // format.json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'error.log', level: 'error', timestamp: true }),
    new transports.File({ filename: 'combined.log', timestamp: true }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;
