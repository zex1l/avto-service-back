import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async create(email: string, password: string) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: await hash(password),
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return user;
  }

  async getAllUsers() {
    return await this.prismaService.user.findMany();
  }
}
