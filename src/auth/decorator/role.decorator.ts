// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../constants/role.constant';

/**
 * decoraror for gaurding the user roles
 * @param roles
 * @returns the metadata for the role decorator
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
