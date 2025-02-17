import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ProductDto } from '../product/dto/product.dto';
import { SaleDto } from './dto/sale.dto';

@Injectable()
export class SaleService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSale(userId: string, products: SaleDto[], totalCost: number) {

    if(!products.length) throw new BadRequestException('Не указан товар')

    const isUserExist = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    console.log(products);

    if (!isUserExist) throw new NotFoundException('Пользователь не найден');

    const sale = await this.prismaService.sale.create({
      data: {
        userId,
        totalCoast: totalCost,
        SaleItems: {
          createMany: {
            data: products.map((product) => ({
              priceAtSale: product.price,
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      },
    });

    return sale;
  }

  async getAllSales() {
    return await this.prismaService.sale.findMany({
      include: {
        SaleItems: {
          include: {
            Product: true,
          },
        },
      },
    });
  }

  async getUserSales(userId: string) {
    const isUserExist = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!isUserExist) throw new NotFoundException('Пользователь не найден');

    return await this.prismaService.sale.findMany({
      where: {
        userId,
      },
      include: {
        SaleItems: {
          include: {
            Product: true,
          },
        },
      },
    });
  }
}
