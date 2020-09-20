import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';

import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import APIRouter from './routes';
import { sysLogger, httpLogger } from '@shared/Logger';
const errorhandler = require('errorhandler');
import { cookieProps } from '@shared/constants';
import cors from 'cors';

// Init express
const app = express();

/************************************************************************************
*                              Set basic express settings
***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieProps.secret));
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
if (process.env.NODE_ENV === 'development') { // Show routes called in console during development
  app.use(httpLogger);
} if (process.env.NODE_ENV === 'production') { // Security configuration
  app.use(helmet());
}

// Add API routes
app.use('/api', APIRouter);


app.use(errorhandler({
  log: (err: Error, str: string, req: Request, res: Response) => {
    sysLogger.error(`(${req.ip})`, err);
  }
}));




/************************************************************************************
*                              Serve front-end content
***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.get('/', (req: Request, res: Response) => {
  res.sendFile('login.html', {root: viewsDir});
});

app.get('/users', (req: Request, res: Response) => {
  const jwt = req.signedCookies[cookieProps.key];
  if (!jwt) {
    res.redirect('/');
  } else {
    res.sendFile('users.html', {root: viewsDir});
  }
});

export default app;
