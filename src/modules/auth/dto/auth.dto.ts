import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Некоректный формат Email ' })
  @IsNotEmpty({ message: 'Некоректный формат Email ' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @IsNotEmpty({ message: 'Пароль должен быть не менее 6 символов' })
  password: string;
}
