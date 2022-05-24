import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role, ROLES_KEY } from './auth.constant';
import { AuthorizationHandlerGuard } from './authorization-handler.guard';
import { JwtAuthGuard } from './jwt.guard';

export const RequireRoles = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, AuthorizationHandlerGuard),
  );
};
