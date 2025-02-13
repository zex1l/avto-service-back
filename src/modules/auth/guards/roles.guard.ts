import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'prisma/generated';
import { Observable } from 'rxjs';
import { ROLES_KEYS } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const roles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEYS, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    if (!roles) return true;

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException(
        'Недостаточно прав для доступа к этому ресурсу',
      );
    }

    return true;
  }
}
