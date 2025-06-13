import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constant';

/**
 * guard for access token
 */
@Injectable()
export class AccessTokenGuard implements CanActivate {
  /**
   * constructor
   * @param jwtService
   * @param jwtConfiguration
   */
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * inject jwt config
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * function for checking if user has access token
   * @param context
   * @returns true or false depending on whether user is signed in or not
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // we can grab the request from the excetion context
    const request = context.switchToHttp().getRequest();

    // extract the token from the header
    const token = this.extractRequestFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    // validate the token
    try {
      // if the token is valid, jwt returns the payload which contains info for indetifying the user
      const payload = await this.jwtService.verify(
        token,
        this.jwtConfiguration,
      );

      // setting the request.user = payload
      request[REQUEST_USER_KEY] = payload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      throw new UnauthorizedException();
    }

    // accept or deny req based on validation
    return true;
  }

  /**
   * function for extracting the access token from the request headers
   * @param request
   * @returns access token
   */
  private extractRequestFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
