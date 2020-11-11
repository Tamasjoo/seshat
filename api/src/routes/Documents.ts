import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NO_CONTENT, NOT_FOUND, BAD_GATEWAY } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { paramMissingError } from '@shared/constants';
import { adminMW } from '../routes/middleware';

import { storage } from '@shared/constants'
import { sysLogger } from '@shared/Logger';

// Init shared
const router = Router().use(adminMW);

/******************************************************************************
*  (DONE)  Download Document <ID> - "GET /api/documents/:document"
******************************************************************************/

router.get('/:document', async (req: Request, res: Response) => {
  let { document } = req.params as ParamsDictionary;
  document = unescape(document) as string;
  if (!document) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  } else {
    const file = await storage.file(document);
    await file.getMetadata();
    res.writeHead(200, {
      'Content-Type': file.metadata.contentType as string,
      'Content-Length': file.metadata.size as string,
      'Content-Disposition': `attachment; filename=${document}`
    });
    file.createReadStream().pipe(res)
    .on('error', (err: any) => {
      sysLogger.error(`File ${document} download error:\n`, err);
      return res.status(BAD_GATEWAY).end();
    })
    .on('end', () => {
      sysLogger.info(`File '${document}' download complete.`);
      return res.status(CREATED).end();
    });
  }
});

/******************************************************************************
*  (DONE)  Delete Document <ID> - "DELETE /api/documents/:document"
******************************************************************************/

router.delete('/:document', async (req: Request, res: Response) => {
  let { document } = req.params as ParamsDictionary;
  document = unescape(document) as string;
  if (!document) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError
    });
  } else {
    const file = await storage.file(document);
    file.delete().then((data: any) => {
      res.status(NO_CONTENT).end();
    }).catch((err: any) => {
      sysLogger.error(err);
      res.status(NOT_FOUND).end();
    });
  }
});

/******************************************************************************
*  (DONE)  Get All Documents - "GET /api/documents"
******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
  const searchLimit = 15;
  const { pattern, pageToken } = req.query as ParamsDictionary;
  if (!!pattern)
    sysLogger.info(`File search: "${unescape(pattern)}"`);
  const callback = (err: Error, files: Array<object>, nextQuery: any, apiResponse: any) => {
    if (!!err) {
      sysLogger.error(err);
      return res.status(BAD_GATEWAY).end();
    } else {
      const docs = files.map((file: any) => ({
        name: file.metadata.name,
        size: file.metadata.size,
        timeCreated: file.metadata.timeCreated
      }));
      sysLogger.info(`Listing ${files.length} files.`);
      res.status(OK).json({
        nextQuery: nextQuery,
        documents: docs
      });
    }
  };
  await storage.getFiles(
    Object.assign({
      ...({ maxResults: searchLimit,
            autoPaginate: true }),
      ...(!!pattern ? { prefix: unescape(pattern) } : {}),
      ...(!!pageToken ? { pageToken: pageToken } : {}),
  }), callback);

});

/******************************************************************************
*  (DONE)  Upload Document <ID> - "POST /api/documents"
******************************************************************************/

router.post('/', async (req: Request, res: Response) => {
  const disposition = req.header('content-disposition') as string;
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(disposition);
  if (matches == null || !matches[1]) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  } else {
    const name = matches[1].replace(/['"]/g, '');
    const file = storage.file(name);
    const writeStream = file.createWriteStream({
      resumable: false
    });
    await req.pipe(writeStream)
    .on('error', (err: any) => {
      sysLogger.error(err);
      return res.status(BAD_GATEWAY).end();
    })
    .on('finish', () => {
      sysLogger.info(`File '${name}' download complete.`);
      return res.status(CREATED).end();
    });
  }
});

/******************************************************************************
*                                     Export
******************************************************************************/

export default router;
