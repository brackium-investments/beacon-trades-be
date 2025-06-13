import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constant';

/**
 * guard for authentication
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  // using static means you can use the name of the property of the class without the "this" keyword
  /**
   * default auth type
   */
  private static readonly defaultAuthType = AuthType.Bearer;

  /**
   * map for auth types and guards they use
   */
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };

  /**
   * constructor
   * @param reflector
   * @param accessTokenGuard
   */
  constructor(
    /**
     * injecting the reflector class
     * The reflector class makes you access diff metadata from the execution context
     */
    private readonly reflector: Reflector,

    /**
     * Injecting the access token guard
     *
     */
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  /**
   * function for authenticating a user
   * @param context
   * @returns true or false based on whether user is logged in or not
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get all the auth types from reflector
    // This returns an array of the auth types for a specific class or method in a class
    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    // create an array of the guards
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Default error
    const error = new UnauthorizedException();

    // loop through the guards and fire the canActivate
    for (const instance of guards) {
      let canActivate;

      try {
        canActivate = await Promise.resolve(instance.canActivate(context));
      } catch (err) {
        throw err;
      }

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
