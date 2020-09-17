import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NO_CONTENT, NOT_FOUND, BAD_GATEWAY } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { paramMissingError } from '@shared/constants';
import { adminMW } from '../routes/middleware';

import { storage } from '@shared/constants'
import { Writable, Readable } from 'stream';
const logger = require('@shared/Logger')(module);

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
          logger.error(`File ${document} download error:\n`, err);
          return res.status(BAD_GATEWAY).end();
        })
        .on('end', () => {
          logger.info(`File '${document}' download complete.`);
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
            logger.error(err);
            res.status(NOT_FOUND).end();
        });
    }
});

/******************************************************************************
 *  (DONE)  Get All Documents - "GET /api/documents"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    const response = await storage.getFiles();
    const files = response[0].map((file: any) => ({
        name: file.metadata.name,
        timeCreated: file.metadata.timeCreated,
        size: file.metadata.size
    }));
    res.status(OK).json(files);
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
            logger.error(err);
            return res.status(BAD_GATEWAY).end();
        })
        .on('finish', () => {
            logger.info(`File '${name}' download complete.`);
            return res.status(CREATED).end();
        });
    }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
