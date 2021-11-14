import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map((value) => recursivelyStripNullValues(value)));
    }
}

function recursivelyStripNullValues(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(recursivelyStripNullValues);
    }

    if (value !== null && value instanceof Date) {
        return value;
    }

    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, value]) => [key, recursivelyStripNullValues(value)]),
        );
    }

    if (value !== null) {
        return value;
    }
}
