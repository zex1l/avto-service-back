import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserModel } from '../models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'dawdwadawdkawkdaw12312aD!',
      passReqToCallback: true,
    });
  }

  async validate(payload) {
    return { userId: 1, username: 'Maks' };
  }
}
