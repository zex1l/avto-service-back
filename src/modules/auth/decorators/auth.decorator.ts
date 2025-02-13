import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRoles } from 'prisma/generated';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Authorization(...roles: UserRoles[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
  }

  return applyDecorators(UseGuards(AuthGuard));
}
