import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsDate,
  IsUUID,
} from 'class-validator';

export class OrderDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  name: string;

  @IsNotEmpty({ message: 'телефон не должно быть пустым' })
  number: string;

  @IsString({ message: 'Статус должно быть строкой' })
  @IsNotEmpty({ message: 'Статус не должно быть пустым' })
  status: string;

  @IsNotEmpty({ message: 'Дата не должно быть пустым' })
  visitDate: string;

  @IsString({ message: 'Тип обслуживанея должно быть строкой' })
  @IsNotEmpty({ message: 'Тип обслуживанея не должно быть пустым' })
  type: string;
}

export class UpdateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  name: string;

  @IsNotEmpty({ message: 'телефон не должно быть пустым' })
  number: string;

  @IsString({ message: 'Статус должно быть строкой' })
  @IsNotEmpty({ message: 'Статус не должно быть пустым' })
  status: string;

  @IsString()
  @IsNotEmpty({ message: 'Статус не должно быть пустым' })
  visitDate: string;

  @IsString({ message: 'Тип обслуживанея должно быть строкой' })
  @IsNotEmpty({ message: 'Тип обслуживанея не должно быть пустым' })
  type: string;
}
