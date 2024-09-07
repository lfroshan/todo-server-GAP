import { createLogger, format, transports } from 'winston';

const { printf, combine, timestamp, colorize } = format;

/**
 * Custom format to apply color based on log level.
 */
const levelColorizer = (level: string) => {
  switch (level) {
    case 'info':
      return '\x1b[32m'; // Green
    case 'warn':
      return '\x1b[33m'; // Yellow
    case 'error':
      return '\x1b[31m'; // Red
    case 'debug':
      return '\x1b[34m'; // Blue
    default:
      return '\x1b[0m'; // Reset
  }
};

const customFormat = printf(({ level, message, timestamp }) => {
  const color = levelColorizer(level);
  return `${color}${timestamp} [${level}]: ${message}\x1b[0m`; // Reset color
});

// Create a logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    // Console transport with colorized output
    new transports.Console({
      format: combine(
        colorize({ all: true }), // Enable colorize for all log levels
        customFormat
      )
    }),
    // File transport
    new transports.File({ filename: 'logs/app.log' })
  ]
});

export default logger;
