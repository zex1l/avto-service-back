import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllProducts() {
    return await this.prismaService.product.findMany();
  }

  async getProductById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) throw new NotFoundException('Товар не найден');

    return product;
  }

  async create(pruductDto: ProductDto) {
    return await this.prismaService.product.create({
      data: {
        img: pruductDto.img,
        name: pruductDto.name,
        description: pruductDto.description,
        price: pruductDto.price,
      },
    });
  }

  async update(id: string, pruductDto: ProductDto) {
    await this.getProductById(id);

    await this.prismaService.product.update({
      where: {
        id,
      },
      data: {
        img: pruductDto.img,
        name: pruductDto.name,
        description: pruductDto.description,
        price: pruductDto.price,
      },
    });

    return true;
  }

  async delete(id: string) {
    await this.getProductById(id);
    return await this.prismaService.product.delete({ where: { id } });
  }
}
