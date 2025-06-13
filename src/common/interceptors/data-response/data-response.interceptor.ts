import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

/**
 * provider for the data response interceptor
 */
@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  /**
   * constructor
   * @param configService
   */
  constructor(
    /**
     * injecting config service
     */
    private readonly configService: ConfigService,
  ) {}

  /**
   * function for formatting the response data
   * @param context
   * @param next
   * @returns the response in {apiVersion: "1.0.0", data: ...} format
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before ...');
    // before method execution
    return next.handle().pipe(
      map((data) => ({
        apiVersion: this.configService.get('appConfig.apiVersion'),
        data: data,
      })),
    );
    // After method execution
  }
}
