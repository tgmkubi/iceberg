import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Before controller execution
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const url: string = request?.originalUrl || request?.url || "";

        // Bypass wrapping for Swagger UI assets/responses
        if (url.startsWith("/docs") || url.startsWith("/api-docs")) {
            return next.handle();
        }

        const path = request.url;
        const method = request.method;

        return next.handle().pipe(
            map((response) => ({
                // After controller execution
                success: true,
                message: response?.message || null,
                data: response?.data ?? response,
                ...(response?.meta && { meta: response.meta }),
                timestamp: new Date().toISOString(),
                path,
                method,
            })),
        );
    }
}
