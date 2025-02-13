import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

import { Authorized } from '../auth/decorators/authorizate.decorator';
import { Authorization } from '../auth/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization('ADMIN')
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}
