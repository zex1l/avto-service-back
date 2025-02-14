import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from 'prisma/generated';
import { Request, Response } from 'express';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async register(req: Request, { email, password }: AuthDto) {
    const isExistsEmail = await this.userService.findByEmail(email);

    if (isExistsEmail) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const newUser = await this.userService.create(email, password);

    return this.saveSession(req, newUser);
  }

  async login(req: Request, { email, password }: AuthDto) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Пользователь не найден');

    const isValidPassword = await verify(user.password, password);

    if (!isValidPassword) throw new UnauthorizedException('Неверный пароль');

    return this.saveSession(req, user);
  }

  async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Произошла ошибка при завершении сессии',
            ),
          );
        }

        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));

        resolve();
      });
    });
  }

  private async saveSession(req: Request, { email, id, role }: Partial<User>) {
    return new Promise((resolve, reject) => {
      req.session.userId = id;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Произошла ошибка при сохранении сессии',
            ),
          );
        }

        resolve({ email, id, role });
      });
    });
  }
}
