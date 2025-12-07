import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const start = Date.now();

        console.log(`[Request] ${method} ${originalUrl}`);

        res.on("finish", () => {
            const duration = Date.now() - start;
            console.log(
                `[Response] ${method} ${originalUrl} - ${res.statusCode} (${duration}ms)`
            );
        });

        next();
    }
}
