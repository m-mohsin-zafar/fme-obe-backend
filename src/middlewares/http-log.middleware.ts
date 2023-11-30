import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLogMiddleware implements NestMiddleware {
  constructor() {}

  use(req: Request, res: Response, next: NextFunction) {
    // Perform any pre-processing logic here (e.g., logging, modifying request/response, etc.)

    let responseData = '';
    const ENABLE_DETAILED_LOGGING = Boolean(process.env?.['ENABLE_DETAILED_LOGGING']) || false;
    if (ENABLE_DETAILED_LOGGING) {
      // Create an array to capture response data
      const chunks: any[] = [];

      // Override the response's write method
      const originalWrite = res.write;
      res.write = function (this: Response, chunk: any, encoding?: BufferEncoding): boolean {
        chunks.push(chunk);
        return originalWrite.call(this, chunk, encoding);
      } as any;

      // Override the response's end method
      const originalEnd = res.end;
      res.end = function (this: Response, chunk?: any, encoding?: BufferEncoding): void {
        if (chunk) {
          chunks.push(chunk);
        }

        // Log the captured response data
        responseData = Buffer.concat(chunks).toString('utf8');

        // Restore the original methods
        res.write = originalWrite;
        res.end = originalEnd;

        originalEnd.call(this, chunk, encoding);
      } as any;
    }

    const responseInterceptor = () => {
      Logger.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage}`);
      if (responseData !== '') {
        Logger.log(`[HTTP] Response data:\n${this.prettifyResponseData(responseData)}`);
      }
      res.removeListener('finish', responseInterceptor);
    };

    res.on('finish', responseInterceptor);

    next();
  }

  private prettifyResponseData(responseData: string) {
    try {
      return JSON.stringify(JSON.parse(responseData), null, 2);
    } catch (error) {
      Logger.log(`[HTTP] Error while prettifying response data: ${error.message}`);
      return responseData;
    }
  }
}
