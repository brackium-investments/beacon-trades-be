// src/common/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/auth/constants/role.constant';
import { Role } from 'src/auth/enums/role.enum';

/**
 * role guard
 */
@Injectable()
export class RolesGuard implements CanActivate {
  // using static means you can use the name of the property of the class without the "this" keyword
  //   private static readonly defaultRoleType: Role = Role.ADMIN;

  /**
   * constructor
   * @param reflector
   */
  constructor(private reflector: Reflector) {}

  /**
   * function for validating role of user
   * @param context
   * @returns true or false depending whether the users role meets the role requirements in the role decorator
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; //  allow access.
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not found.');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }

    return true;
  }
}
