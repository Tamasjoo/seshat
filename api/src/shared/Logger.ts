/**
 * Setup the winston logger.
 *
 * Documentation: https://github.com/winstonjs/winston
 */

import path from 'path';
import { createLogger, format, transports } from 'winston';

// Import Functions
const { File, Console } = transports;

// Designed to access each file name whenever called
module.exports = function (module: any) {

  // Init Logger
  const logger = createLogger({
      level: 'info'
  });

  const loggerFormat = format.combine(
      format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.colorize(),
      format.simple(),
      format.printf(info =>
        `[${info.timestamp}]` +
        `[${info.level}]` +
        `[@${path.basename(module.filename)}]: ` +
        (info.stack ? `\n${info.stack}` : `${info.message}`))
  );

  /**
   * For production write to all logs with level `info` and below
   * to `combined.log. Write all logs error (and below) to `error.log`.
   * For development, print to the console.
   */
  if (process.env.NODE_ENV === 'production') {

      const errTransport = new File({
          filename: './logs/error.log',
          format: loggerFormat,
          level: 'error'
      });
      const infoTransport = new File({
          filename: './logs/combined.log',
          format: loggerFormat
      });
      logger.add(errTransport);
      logger.add(infoTransport);

  } else {

      const consoleTransport = new Console({
          format: loggerFormat
      });
      logger.add(consoleTransport);
  }

  return logger;
};
