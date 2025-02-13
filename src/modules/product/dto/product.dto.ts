import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ProductDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  name: string;

  @IsString({ message: 'Описание должно быть строкой' })
  description: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Статус не должно быть пустым' })
  price: number;

  @IsString({ message: 'Картинка должно быть строкой' })
  @IsNotEmpty({ message: 'Картинка не должно быть пустым' })
  img: string;
}
