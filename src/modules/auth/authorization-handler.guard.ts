import { UserFromAuth } from '@auth-client/entities/current-user';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from './auth.constant';

@Injectable()
export class AuthorizationHandlerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const user: UserFromAuth = context.switchToHttp().getRequest().user;

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
