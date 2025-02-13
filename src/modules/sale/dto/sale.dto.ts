import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class SaleDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber({ allowInfinity: false })
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({ message: 'Картинка должно быть строкой' })
  @IsNotEmpty({ message: 'Картинка не должно быть пустым' })
  img: string;
}
