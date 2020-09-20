import path from 'path';
import winston from 'winston';
import morgan from 'morgan';
import chalk from 'chalk';
import { Request, Response } from 'express';
import { appRoot } from '@shared/constants';

// Winston Logger
export const sysLogger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({
      level: 'error',
      filename: path.join(appRoot, 'log', 'error.log')
    })
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf(info =>
      `[${info.timestamp}] ` +
      `[${info.level}]: ` +
      `${info.message}`
    )
  )
});

export const httpLogger = morgan(
  '(:remote-addr) ":method :url" :status - :response-time ms', {
  stream: { write: message => sysLogger.info(message) }
});
