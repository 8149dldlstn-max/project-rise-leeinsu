import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_METADATA_KEY, ERROR_MESSAGE } from '../constants';
import { UserRole } from '../types/user-role.enum';
import { AuthenticatedUser } from '../types/authenticated-user.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authenticatedUser: AuthenticatedUser | undefined = request.user;

    if (
      !authenticatedUser ||
      !requiredRoles.includes(authenticatedUser.role)
    ) {
      throw new ForbiddenException(ERROR_MESSAGE.FORBIDDEN_ROLE);
    }

    return true;
  }
}
