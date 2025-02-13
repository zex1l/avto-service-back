import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

import { UserService } from '../user/user.service';

@Module({
  controllers: [AuthController],

  imports: [UserModule],
  providers: [AuthService, UserService],
})
export class AuthModule {}
